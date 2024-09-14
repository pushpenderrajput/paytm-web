"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { use, useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnrampTransaction } from "../app/lib/actions/createOnrampTxn";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https:/hdfc.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
},
{
    name:"State Bank of India",
    redirectUrl:"https://www.onlinesbi.sbi/"
},
{
    name:"Central Bank of India",
    redirectUrl:"https://www.centralbankofindia.co.in/en"
},
{
    name:"IndusInd Bank",
    redirectUrl:"https://www.indusind.com/in/en/personal.html"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount , setAmount] = useState(0);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    return <Card title="Add Money">
    <div className="w-full">
        <TextInput label={"Amount"} placeholder={"Amount"} onChange={(value:any) => {
            setAmount(value)
        }} />
        <div className="py-4 text-left">
            Bank
        </div>
        <Select onSelect={(value) => {
            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
            setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")
        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
            <Button onClick={async () => {
                await createOnrampTransaction(amount * 100, provider);
                window.location.href = redirectUrl || "";
            }}>
            Add Money

            </Button>
        </div>
    </div>
</Card>
}