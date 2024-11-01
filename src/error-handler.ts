import type { FastifyInstance } from "fastify";
import { clientError } from "./errors/client-errors";
import { ZodError } from "zod";

type fastityErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: fastityErrorHandler=(error, request, reply)=>{
   
   if( error instanceof ZodError){
    return reply.status(400).send({message: 'invalid Input',errors: error.flatten().fieldErrors })
   }
   
   
    if ( error instanceof clientError ){
        return reply.status(400).send({message:error.message})
    }
}