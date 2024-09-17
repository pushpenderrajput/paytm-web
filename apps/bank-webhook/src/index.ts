import express from 'express';
import db from '@repo/db/client';

const app = express();
app.use(express.json());

app.post('/hdfcWebhook', async (req, res) => {
    const { token, userId, amount } = req.body;

    if (!token || !userId || !amount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        console.log(`Processing transaction: token=${token}, userId=${userId}, amount=${amount}`);

        const result = await db.$transaction([
            db.balance.updateMany({
                where: { userId: Number(userId) },
                data: { amount: { increment: Number(amount) } }
            }),
            db.onRampTransaction.updateMany({
                where: { token: token },
                data: { status: "Success" }
            })
        ]);

        console.log('Transaction result:', result);
        res.json({ message: 'Captured' });
    } catch (e) {
        console.error('Error during transaction:', e);
        res.status(500).json({ message: 'Error while processing webhook' });
    }
});


app.listen(3003, () => {
    console.log('Webhook server listening on port 3003');
});
