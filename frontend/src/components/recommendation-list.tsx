"use client";

import { InsuranceRecommendations } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage, getPriorityColor } from "@/lib/utils";
import { Shield, ChevronRight } from "lucide-react";

interface RecommendationListProps {
  recommendations: InsuranceRecommendations;
  onSelect: (type: string) => void;
  selectedType: string | null;
}

export default function RecommendationList({ 
  recommendations, 
  onSelect,
  selectedType
}: RecommendationListProps) {
  // Convert to array for sorting
  const recommendationItems = Object.entries(recommendations).map(([type, data]) => ({
    type,
    ...data,
  }));
  
  // Sort by priority (High > Medium > Low) and then by percentage
  const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
  const sortedRecommendations = recommendationItems.sort((a, b) => {
    const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    
    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }
    
    return b.percentage - a.percentage;
  });

  // Map insurance types to icons
  const insuranceIcons: Record<string, JSX.Element> = {
    Credit: <Shield className="h-5 w-5 text-blue-500" />,
    Life: <Shield className="h-5 w-5 text-green-500" />,
    Health: <Shield className="h-5 w-5 text-red-500" />,
    Home: <Shield className="h-5 w-5 text-yellow-500" />,
    Travel: <Shield className="h-5 w-5 text-purple-500" />,
    Motor: <Shield className="h-5 w-5 text-orange-500" />,
    Liability: <Shield className="h-5 w-5 text-indigo-500" />,
    Accident: <Shield className="h-5 w-5 text-pink-500" />,
    Other: <Shield className="h-5 w-5 text-gray-500" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Recommendations</CardTitle>
        <CardDescription>
          Based on your transaction analysis, we recommend these insurance types
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedRecommendations.map((item) => {
            const isSelected = selectedType === item.type;
            const priorityColorClass = getPriorityColor(item.priority);
            
            return (
              <div 
                key={item.type}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => onSelect(item.type)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {insuranceIcons[item.type] || <Shield className="h-5 w-5 text-gray-500" />}
                    <div>
                      <h3 className="font-medium">{item.type} Insurance</h3>
                      <p className="text-sm text-gray-500">
                        Coverage for {formatPercentage(item.percentage)} of spending
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${priorityColorClass}`}>
                      {item.priority}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })}
          
          {sortedRecommendations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No recommendations available. Please upload your transaction data.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}