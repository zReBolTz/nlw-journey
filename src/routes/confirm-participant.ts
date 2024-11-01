import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {dayjs} from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { clientError } from "../errors/client-errors";


export async function confirmParticipants(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId/confirm', {
        schema:{
            params: z.object ({
                participantId: z.string().uuid()
            })
        }
    }, async (request)=>{
      const {participantId} = request.params

      const participant = await prisma.participant.findUnique({
        where:{
            id:participantId,
        }
      })
      if(!participant){
        throw new Error('participant not found!')
      }
      if(participant.if_confirmed){
        throw new clientError('participant already confirmed')
      }

      await prisma.participant.update({
        where:{id:participantId},
        data:{if_confirmed: true}
      })

    })
}