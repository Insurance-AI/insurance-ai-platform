"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PolicyCard from "@/components/policy-card";
import { useRouter } from "next/navigation";

const RecommendationForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    Age: "",
    Gender: "",
    Smoking_Status: "",
    Annual_Income: "",
    Existing_Loans_Debts: "",
    Existing_Insurance_Policies: "",
    Desired_Sum_Assured: "",
    Policy_Term_Years: "",
    Premium_Payment_Option: "",
    Death_Benefit_Option: "",
    Payout_Type: "",
    Medical_History: "",
    Lifestyle_Habits: "",
    Interest_in_Optional_Riders: false,
    Interest_in_Tax_Saving: false,
  });

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = {
        Age: parseInt(formData.Age, 10),
        Gender: formData.Gender,
        Smoking_Status: formData.Smoking_Status,
        Annual_Income: parseFloat(formData.Annual_Income),
        Existing_Loans_Debts: formData.Existing_Loans_Debts === "true" ? 1 : 0,
        Existing_Insurance_Policies: formData.Existing_Insurance_Policies === "true" ? 1 : 0,
        Desired_Sum_Assured: parseFloat(formData.Desired_Sum_Assured),
        Policy_Term_Years: parseInt(formData.Policy_Term_Years, 10),
        Premium_Payment_Option: formData.Premium_Payment_Option,
        Death_Benefit_Option: formData.Death_Benefit_Option,
        Payout_Type: formData.Payout_Type,
        Medical_History: formData.Medical_History,
        Lifestyle_Habits: formData.Lifestyle_Habits,
        Interest_in_Optional_Riders: formData.Interest_in_Optional_Riders,
        Interest_in_Tax_Saving: formData.Interest_in_Tax_Saving,
      };

      const res = await axios.post("http://localhost:8080/api/recommend", cleanedData);
      const data = res.data;

      console.log("Recommendations:", data.recommendations);

      setRecommendations(data.recommendations || []);
      setShowRecommendations(true);

      const compareResponse = await axios.post("http://localhost:8080/api/gemini/compare", data.recommendations);

      localStorage.setItem("comparison_result", JSON.stringify(compareResponse.data));

      router.push("/comparision-dashboard");
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputField label="Age" name="Age" type="number" value={formData.Age} onChange={handleChange} required />
            <InputField label="Annual Income (USD)" name="Annual_Income" type="number" value={formData.Annual_Income} onChange={handleChange} required />
            <SelectField label="Existing Loan" name="Existing_Loans_Debts" value={formData.Existing_Loans_Debts} onChange={handleSelectChange} options={["true", "false"]} />
            <SelectField label="Gender" name="Gender" value={formData.Gender} onChange={handleSelectChange} options={["Male", "Female", "Other"]} />
            <SelectField label="Smoking Status" name="Smoking_Status" value={formData.Smoking_Status} onChange={handleSelectChange} options={["Smoker", "Non-Smoker"]} />
            <SelectField label="Existing Insurance Policies" name="Existing_Insurance_Policies" value={formData.Existing_Insurance_Policies} onChange={handleSelectChange} options={["true", "false"]} />
            <InputField label="Desired Sum Assured" name="Desired_Sum_Assured" type="number" value={formData.Desired_Sum_Assured} onChange={handleChange} required />
            <InputField label="Policy Term (Years)" name="Policy_Term_Years" type="number" value={formData.Policy_Term_Years} onChange={handleChange} required />
            <SelectField label="Premium Payment Option" name="Premium_Payment_Option" value={formData.Premium_Payment_Option} onChange={handleSelectChange} options={["Regular", "Limited", "Single"]} />
            <SelectField label="Death Benefit Option" name="Death_Benefit_Option" value={formData.Death_Benefit_Option} onChange={handleSelectChange} options={["Level", "Increasing"]} />
            <SelectField label="Payout Type" name="Payout_Type" value={formData.Payout_Type} onChange={handleSelectChange} options={["Installments", "Lump sum"]} />
            <SelectField label="Medical History" name="Medical_History" value={formData.Medical_History} onChange={handleSelectChange} options={["Hypertensive", "Healthy", "Diabetic"]} />
            <SelectField label="Lifestyle Habits" name="Lifestyle_Habits" value={formData.Lifestyle_Habits} onChange={handleSelectChange} options={["Active", "Sedentary"]} />
            <SelectField label="Interested in Optional Riders?" name="Interest_in_Optional_Riders" value={String(formData.Interest_in_Optional_Riders)} onChange={handleSelectChange} options={["true", "false"]} />
            <SelectField label="Interested in Tax Saving?" name="Interest_in_Tax_Saving" value={String(formData.Interest_in_Tax_Saving)} onChange={handleSelectChange} options={["true", "false"]} />
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
  );
};

export default RecommendationForm;

function InputField({ label, name, type, value, onChange, required }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
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
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
