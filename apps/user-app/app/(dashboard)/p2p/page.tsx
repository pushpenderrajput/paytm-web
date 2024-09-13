import { SendCard } from "../../../components/SendMoney"
import { BalanceCard } from "../../../components/BalanceCard"
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/p2ptransactions";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}
async function getP2PTransactions() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    const txns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        include: {
            fromUser: true, 
            toUser: true    
        },
        orderBy: { timestamp: 'desc' } 
    });

    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        direction: t.fromUserId === userId ? 'sent' : 'received',
        mobileNumber: t.fromUserId === userId ? t.toUser.number : t.fromUser.number
    }));
}
export default async function () {
    const balance = await getBalance();
    const transactions = await getP2PTransactions();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Pay to Mobile Number
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendCard />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <P2PTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}
