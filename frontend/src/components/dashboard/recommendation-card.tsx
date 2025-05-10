"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

interface RecommendationCardProps {
  type: string;
  recommendation: {
    reason: string;
    amount: number;
    percentage: number;
    priority: string;
  };
}

export default function RecommendationCard({ type, recommendation }: RecommendationCardProps) {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      High: "bg-red-500",
      Medium: "bg-orange-500",
      Low: "bg-yellow-500"
    };
    return colors[priority] || "bg-blue-500";
  };

  // Map insurance types to icons and descriptions
  const insuranceDetails = {
    Credit: {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      description: "Protects your finances if you're unable to make loan payments due to unexpected events.",
    },
    Life: {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      description: "Provides financial security for your loved ones in case of your unexpected death.",
    },
    Health: {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      description: "Covers your medical expenses, ensuring you get quality healthcare when needed.",
    },
    Home: {
      icon: <Shield className="h-8 w-8 text-yellow-500" />,
      description: "Protects your home and belongings from damage, theft, and liability claims.",
    },
    Travel: {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      description: "Covers unexpected events during travel, such as medical emergencies or trip cancellations.",
    },
    Motor: {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      description: "Provides coverage for vehicle damage, theft, and liability for others' injuries or property.",
    },
    Liability: {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      description: "Protects against claims resulting from injuries and damage to people or property.",
    },
    Other: {
      icon: <Shield className="h-8 w-8 text-gray-500" />,
      description: "Specialized insurance coverage tailored to your specific needs and circumstances.",
    },
  };

  // Use default if type not found
  const details = insuranceDetails[type] || {
    icon: <Shield className="h-8 w-8 text-gray-500" />,
    description: "Insurance coverage recommended based on your spending patterns.",
  };

  // Calculate estimated values
  const monthlyCost = recommendation.amount * (recommendation.percentage / 100) / 12;
  const yearlySavings = recommendation.amount * 0.1; // Estimate 10% savings

  return (
    <Card className="border-t-4 border-t-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {details.icon}
            <div>
              <CardTitle className="text-xl">{type} Insurance</CardTitle>
              <CardDescription>Recommended coverage</CardDescription>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(recommendation.priority)}`}>
            {recommendation.priority} Priority
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Coverage of spending</span>
          <div className="flex items-end space-x-1">
            <span className="text-2xl font-bold">{formatPercentage(recommendation.percentage)}</span>
            <span className="text-sm text-gray-500">of transactions</span>
          </div>
        </div>

        {recommendation.amount && (
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Recommended coverage amount</span>
            <div className="flex items-end space-x-1">
              <span className="text-2xl font-bold">{formatCurrency(recommendation.amount)}</span>
              <span className="text-sm text-gray-500">per year</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Description</span>
          <p className="text-gray-700">{details.description}</p>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Estimated premium</span>
          <div className="flex items-end space-x-1">
            <span className="text-2xl font-bold">{formatCurrency(monthlyCost)}</span>
            <span className="text-sm text-gray-500">per month</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Estimated savings</span>
          <div className="flex items-end space-x-1">
            <span className="text-2xl font-bold">{formatCurrency(yearlySavings)}</span>
            <span className="text-sm text-gray-500">per year</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Recommended action</span>
          <p className="text-gray-700">{recommendation.reason}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}