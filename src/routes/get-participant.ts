import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { clientError } from "../errors/client-errors";






export async function getParticipant(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId', {
        schema:{
            params: z.object({
                participantId: z.string().uuid()
            }),
        }
    }, async (request)=>{
        const {participantId } = request.params
        
        const participant= await prisma.participant.findUnique({
            where:{ id: participantId },
        
            select:{
                name: true,
                email: true,
                if_confirmed: true
            }
            
        })

        if(!participantId){
            throw new clientError('trip not found!')
          }


        return {participant}
    })
}