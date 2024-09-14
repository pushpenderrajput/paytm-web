"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnrampTransaction(amount:number, provider:string){
    const session = await getServerSession(authOptions);
    const userId = session.user.id;
    if(!userId){
        return {
            "message":"User not Logged in!"
        }
    }
    const response = await fetch('https://bank-api.pushpenderrajputsp.workers.dev/api/addMoney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, provider, userId: userId }), 
    });
    
    if (!response.ok) {
        throw new Error('Error creating transaction');
    }

    const { token } = await response.json();
    await prisma.onRampTransaction.create({
        data:{
            userId:Number(userId),
            amount:amount,
            status:"Processing",
            startTime: new Date(),
            provider,
            token:token
        }
    })
}
