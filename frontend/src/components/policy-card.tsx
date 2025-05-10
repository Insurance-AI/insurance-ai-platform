// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// // @ts-ignore
// export default function PolicyCard({ policy  }) {
//     const [isOpen, setIsOpen] = useState(false)

//     return (
//         <Card className="h-full">
//             <CardHeader>
//                 <CardTitle>{policy.insuranceName}</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="space-y-2">
//                     <p>
//                         <span className="font-medium">Type:</span> {policy.insuranceType.join(", ")}
//                     </p>
//                     <p>
//                         <span className="font-medium">Premium Range:</span> ${policy.premiumMin} - ${policy.premiumMax}
//                     </p>
//                 </div>
//             </CardContent>
//             <CardFooter>
//                 <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
//                     <CollapsibleTrigger asChild>
//                         <Button variant="outline" className="w-full">
//                             {isOpen ? "Hide Details" : "View Details"}
//                         </Button>
//                     </CollapsibleTrigger>
//                     <CollapsibleContent className="mt-4 space-y-2">
//                         <p>
//                             <span className="font-medium">Entry Age:</span> {policy.entryAgeMin} - {policy.entryAgeMax} years
//                         </p>
//                         <p>
//                             <span className="font-medium">Sum Assured:</span> {policy.sumAssuredMin} - {policy.sumAssuredMax}
//                         </p>
//                         <p>
//                             <span className="font-medium">Medical Exam Required:</span> {policy.requiresMedicalExam}
//                         </p>
//                         {policy.incomeCriteria && (
//                             <p>
//                                 <span className="font-medium">Income Criteria:</span> {policy.incomeCriteria}
//                             </p>
//                         )}
//                         <p>
//                             <span className="font-medium">Riders Available:</span> {policy.ridersAvailable.join(", ")}
//                         </p>
//                         <p>
//                             <span className="font-medium">Return of Premium:</span> {policy.returnOfPremium}
//                         </p>
//                         {policy.csr && (
//                             <p>
//                                 <span className="font-medium">CSR:</span> {policy.csr}
//                             </p>
//                         )}
//                         <p>
//                             <span className="font-medium">Features:</span> {policy.features.join(", ")}
//                         </p>
//                         <p>
//                             <span className="font-medium">Policy Term:</span> {policy.policyTermRange}
//                         </p>
//                         <p>
//                             <span className="font-medium">Life Cover Till Age:</span> {policy.lifeCoverTillAge}
//                         </p>
//                         <p>
//                             <span className="font-medium">Policy Type:</span> {policy.policyTypeCategory.join(", ")}
//                         </p>
//                         <p>
//                             <span className="font-medium">Payout Options:</span> {policy.payoutOptions.join(", ")}
//                         </p>
//                         <p>
//                             <span className="font-medium">Payout Frequency:</span> {policy.payoutFrequency.join(", ")}
//                         </p>
//                         <p>
//                             <span className="font-medium">Waiting Period:</span> {policy.waitingPeriod}
//                         </p>
//                     </CollapsibleContent>
//                 </Collapsible>
//             </CardFooter>
//         </Card>
//     )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// @ts-ignore
export default function PolicyCard({ policy }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{policy.insuranceName}</CardTitle>
            </CardHeader>
            <CardFooter>
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full">
                            {isOpen ? "Hide Details" : "View Details"}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-2">
                        <p>
                            <span className="font-medium">Plan:</span> {policy.insuranceName}
                        </p>
                        {policy.confidence && (
                            <p>
                                <span className="font-medium">Confidence:</span> {policy.confidence}
                            </p>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </CardFooter>
        </Card>
    )
}
