"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PolicyCard from "@/components/policy-card"
import { insurancePolicies } from "@/lib/sample-data"

export default function RecommendationForm() {
    const [formData, setFormData] = useState({
        age: "",
        income: "",
        existingPremium: "",
        existingLoan: "",
        gender: "",
        health: "",
        medicalHistory: "",
    })

    const [showRecommendations, setShowRecommendations] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setShowRecommendations(true)
    }

    return (
        <div className="space-y-8">
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                placeholder="Enter your age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="income">Monthly Income (USD)</Label>
                            <Input
                                id="income"
                                name="income"
                                type="number"
                                placeholder="Enter your monthly income"
                                value={formData.income}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="existingPremium">Existing Insurance Premium (monthly)</Label>
                            <Input
                                id="existingPremium"
                                name="existingPremium"
                                type="number"
                                placeholder="Enter existing premium amount"
                                value={formData.existingPremium}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="existingLoan">Existing Loan (USD)</Label>
                            <Input
                                id="existingLoan"
                                name="existingLoan"
                                type="number"
                                placeholder="Enter existing loan amount"
                                value={formData.existingLoan}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <RadioGroup
                                value={formData.gender}
                                onValueChange={(value) => handleSelectChange("gender", value)}
                                required
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Female</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="other" />
                                    <Label htmlFor="other">Other</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="health">Health Status</Label>
                            <Select onValueChange={(value) => handleSelectChange("health", value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select health status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="excellent">Excellent</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="fair">Fair</SelectItem>
                                    <SelectItem value="poor">Poor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="medicalHistory">Medical History</Label>
                            <Select onValueChange={(value) => handleSelectChange("medicalHistory", value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select medical history" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No pre-existing conditions</SelectItem>
                                    <SelectItem value="diabetes">Diabetes</SelectItem>
                                    <SelectItem value="hypertension">Hypertension</SelectItem>
                                    <SelectItem value="heart">Heart Disease</SelectItem>
                                    <SelectItem value="other">Other Conditions</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
                        {insurancePolicies.map((policy, index) => (
                            <PolicyCard key={index} policy={policy} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
