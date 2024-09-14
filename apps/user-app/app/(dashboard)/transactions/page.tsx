import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/p2ptransactions";
import { OnRampTransactions } from "../../../components/OnRampTransactions";

async function getAllP2PTransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    include: {
      fromUser: true,
      toUser: true,
    },
    orderBy: { timestamp: "desc" },
  });

  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    direction: t.fromUserId === userId ? "sent" : "received",
    mobileNumber: t.fromUserId === userId ? t.toUser.number : t.fromUser.number,
  }));
}

async function getAllOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
    orderBy: { startTime: "desc" },
  });

  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

export default async function Transactions() {
  const p2pTransactions = await getAllP2PTransactions();
  const onRampTransactions = await getAllOnRampTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">Transaction History</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <h2 className="text-2xl text-[#6a51a6] mb-4">Mobile Transactions</h2>
          <P2PTransactions transactions={p2pTransactions} />
        </div>
        <div>
          <h2 className="text-2xl text-[#6a51a6] mb-4">Bank Transactions</h2>
          <OnRampTransactions transactions={onRampTransactions} />
        </div>
      </div>
    </div>
  );
}
