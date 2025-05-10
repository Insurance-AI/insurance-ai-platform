"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PolicyCard from "@/components/policy-card"

export default function RecommendationForm() {
    const [formData, setFormData] = useState({
        age: "",
        gender: "",
        smokingStatus: "",
        income: "",
        existingLoan: "",
        existingPolicies: "",
        desiredSumAssured: "",
        policyTerm: "",
        premiumPaymentOption: "",
        deathBenefitOption: "",
        payoutType: "",
        medicalHistory: "",
        lifestyleHabits: "",
        interestInRiders: "",
        interestInTaxSaving: ""
    })

    const [showRecommendations, setShowRecommendations] = useState(false)
    const [recommendations, setRecommendations] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:8080/api/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                throw new Error("Failed to fetch recommendations")
            }

            const data = await res.json()
            setRecommendations(data)
            setShowRecommendations(true)
        } catch (error) {
            console.error("Error fetching recommendations:", error)
        }
    }

    return (
        <div className="space-y-8">
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <InputField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                        <InputField label="Annual Income (USD)" name="income" type="number" value={formData.income} onChange={handleChange} required />
                        <SelectField label="Existing Loan" name="existingLoan" value={formData.existingLoan} onChange={handleSelectChange} options={["true", "false"]} />
                        <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleSelectChange} options={["male", "female", "other"]} />
                        <SelectField label="Smoking Status" name="smokingStatus" value={formData.smokingStatus} onChange={handleSelectChange} options={["Smoker", "Non-Smoker"]} />
                        <SelectField label="Existing Insurance Policies" name="existingPolicies" value={formData.existingPolicies} onChange={handleSelectChange} options={["true", "false"]} />
                        <InputField label="Desired Sum Assured" name="desiredSumAssured" type="number" value={formData.desiredSumAssured} onChange={handleChange} required />
                        <InputField label="Policy Term (Years)" name="policyTerm" type="number" value={formData.policyTerm} onChange={handleChange} required />
                        <SelectField label="Premium Payment Option" name="premiumPaymentOption" value={formData.premiumPaymentOption} onChange={handleSelectChange} options={["Regular", "Limited", "Single"]} />
                        <SelectField label="Death Benefit Option" name="deathBenefitOption" value={formData.deathBenefitOption} onChange={handleSelectChange} options={['Level', 'Increasing']} />
                        <SelectField label="Payout Type" name="payoutType" value={formData.payoutType} onChange={handleSelectChange} options={['Installments', 'Lump sum']} />
                        <SelectField label="Medical History" name="medicalHistory" value={formData.medicalHistory} onChange={handleSelectChange} options={['Hypertensive', 'Healthy', 'Diabetic']} />
                        <SelectField label="Lifestyle Habits" name="lifestyleHabits" value={formData.lifestyleHabits} onChange={handleSelectChange} options={["Active", "Sedentary"]} />
                        <SelectField label="Interested in Optional Riders?" name="interestInRiders" value={formData.interestInRiders} onChange={handleSelectChange} options={["true", "false"]} />
                        <SelectField label="Interested in Tax Saving?" name="interestInTaxSaving" value={formData.interestInTaxSaving} onChange={handleSelectChange} options={["true", "false"]} />
                    </div>

                    <Button type="submit" className="w-full">
                        Get Recommendations
                    </Button>
                </form>
            </Card>

            {showRecommendations && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Recommended Policies</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {recommendations.map((policy, index) => (
                            <PolicyCard key={index} policy={policy} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function InputField({ label, name, type, value, onChange, required }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={`Enter ${label.toLowerCase()}`} value={value} onChange={onChange} required={required} />
        </div>
    )
}

function SelectField({ label, name, value, onChange, options }) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Select onValueChange={(val) => onChange(name, val)} value={value}>
                <SelectTrigger>
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
