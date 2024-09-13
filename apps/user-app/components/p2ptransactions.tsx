import { Card } from "@repo/ui/card"

export const P2PTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        direction:string,
        mobileNumber: string
        }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="text-sm">
                    {t.direction === 'received' ? `Received from ${t.mobileNumber}` : `Sent to ${t.mobileNumber}`}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                {t.direction === 'received' ? `+ Rs ${t.amount / 100}` : `- Rs ${t.amount / 100}`}
                </div>

            </div>)}
        </div>
    </Card>
}