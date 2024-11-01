import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { array, z } from "zod";
import { prisma } from "../lib/prisma";
import {dayjs} from "../lib/dayjs";
import { clientError } from "../errors/client-errors";






export async function getTripDetails(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId', {
        schema:{
            params: z.object({
                tripId: z.string().uuid()
            }),
        }
    }, async (request)=>{
        const {tripId } = request.params
        
        const trip= await prisma.trip.findUnique({
            select:{
                destination: true,
                starts_at: true,
                ends_at: true
            },
            where:{
                id: tripId
            },
        })

        if(!trip){
            throw new clientError('trip not found!')
          }


        return {trip}
    })
}