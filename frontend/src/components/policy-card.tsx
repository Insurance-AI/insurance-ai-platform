"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// @ts-ignore
export default function PolicyCard({ policy }) {
    const [isOpen, setIsOpen] = useState(false)

    const renderDetail = (label: string, value: any) => {
        if (!value || value === 'null') return null
        return (
            <p>
                <span className="font-medium">{label}:</span>{" "}
                {Array.isArray(value) ? value.join(", ") : String(value)}
            </p>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{policy.plan}</CardTitle>
            </CardHeader>
            <CardContent>
                {renderDetail("Premium Range", policy.premium_range)}
                {renderDetail("Type", policy.type)}
            </CardContent>
            <CardFooter>
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full">
                            {isOpen ? "Hide Details" : "View Details"}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-2">
                        {renderDetail("Confidence", policy.confidence)}
                        {renderDetail("CSR", policy.csr)}
                        {renderDetail("Death Benefit Option", policy.death_benefit_option)}
                        {renderDetail("Features", policy.features)}
                        {renderDetail("Income Criteria", policy.income_criteria)}
                        {renderDetail("Life Cover Till Age", policy.life_cover_till_age)}
                        {renderDetail("Medical Required", policy.medical_required)}
                        {renderDetail("Payment Option", policy.payment_option)}
                        {renderDetail("Payout Type", policy.payout_type)}
                        {renderDetail("Policy Term Range", policy.policy_term_range)}
                        {renderDetail("Return of Premium", policy.return_of_premium)}
                        {renderDetail("Riders Available", policy.riders_available)}
                        {renderDetail("Sum Assured Range", policy.sum_assured_range)}
                    </CollapsibleContent>
                </Collapsible>
            </CardFooter>
        </Card>
    )
}
