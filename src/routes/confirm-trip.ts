import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {dayjs} from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { clientError } from "../errors/client-errors";


export async function confirmTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
        schema:{
            params: z.object ({
                tripId: z.string().uuid()
            })
        }
    }, async (request)=>{
      const {tripId}= request.params

      const trip= await prisma.trip.findUnique({
        where:{
            id: tripId
        },
        include:{
          participants:{
            where:{
              is_owner: false,
            }
          }
        }
      })

      if(!trip){
        throw new clientError('trip not found!')
      }
      if(trip.if_confirmed){
        throw new clientError('trip already confirmed')
      }

      await prisma.trip.update({
        where:{id: tripId},
        data:{if_confirmed: true}
      })

      
      const formattedStartDate = dayjs(trip.starts_at).format('LL')
      const formattedEndDate= dayjs(trip.ends_at).format('LL')

      const mail= await getMailClient()


      await Promise.all(
        trip.participants.map(async (participant) => {
          const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`
        
          const message= await mail.sendMail({
            from:{
                name:"Equipe plann.er",
                address: "oi@plann.er"
            },
            to: participant.email,

            subject: `Confirme sua presença para ${trip.destination} `,
            html:` <div style="font-family: sans-serif;font-size: 16px;line-height: 1.6;">
    
            <p>Você foi convidado(a) para participar de uma viagem para ${trip.destination} </strong> nas datas de <strong>${formattedStartDate} até ${formattedEndDate}</strong>.</p>

                <p>Para confirmar sua presença na viagem, clique no link abaixo: </p>
                <p></p>
                <p>
                <a href="${confirmationLink}">Confirmar viagem </a>
                </p>
                Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.
                </div>`.trim()
        
        })
            console.log(nodemailer.getTestMessageUrl(message))
        
        
        })
      )


        return {tripId: request.params.tripId}
    })
}