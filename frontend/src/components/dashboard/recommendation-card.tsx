"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InsuranceRecommendation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { formatCurrency, formatPercentage, getPriorityColor } from "@/lib/utils";
import Link from "next/link";
import { JSX } from "react";

interface RecommendationCardProps {
  type: string;
  recommendation: InsuranceRecommendation;
}

export default function RecommendationCard({ type, recommendation }: RecommendationCardProps) {
  // Map insurance types to icons and descriptions
  const insuranceDetails: Record<string, { icon: JSX.Element; description: string }> = {
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
    Accident: {
      icon: <Shield className="h-8 w-8 text-pink-500" />,
      description: "Provides benefits for accidental injuries or death, regardless of who is at fault.",
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

  // Priority badge styling
  const priorityColorClass = getPriorityColor(recommendation.priority);

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
          <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${priorityColorClass}`}>
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
          <span className="text-sm text-gray-500">Recommended provider</span>
          <p className="text-gray-700">{recommendation.amount}</p>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Estimated premium</span>
          <div className="flex items-end space-x-1">
            <span className="text-2xl font-bold">{formatCurrency(recommendation.percentage)}</span>
            <span className="text-sm text-gray-500">per month</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Estimated savings</span>
          <div className="flex items-end space-x-1">
            <span className="text-2xl font-bold">{formatCurrency(recommendation.percentage)}</span>
            <span className="text-sm text-gray-500">per year</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Recommended action</span>
          <p className="text-gray-700">{recommendation.reason}</p>
        </div>
        </CardContent>
        <CardFooter>
            <Link href={recommendation.priority} passHref>
                <Button variant="outline" className="w-full">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </CardFooter>
    </Card>
    );
}
