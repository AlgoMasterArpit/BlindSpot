import { Resend } from 'resend';



// new Resend(...): Humne Resend ka ek "Client" banaya. and usko export kardia
 export const resend = new Resend(process.env.RESEND_API_KEY);