import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartData } from "./types";

// Combine class names with tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

// Format percentage values
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// Convert object to chart data array
export function objectToChartData(obj: Record<string, number>): ChartData[] {
  return Object.entries(obj).map(([name, value]) => ({
    name,
    value,
  }));
}

// Get color by priority
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-blue-500";
  }
}

// Generate random pastel colors for charts
export function generateChartColors(count: number): string[] {
  const baseColors = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(199, 199, 199, 0.7)",
    "rgba(83, 102, 255, 0.7)",
    "rgba(78, 129, 188, 0.7)",
    "rgba(80, 172, 138, 0.7)",
  ];
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // If we need more colors than in our base set, duplicate with slight variations
  const colors = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    const idx = i % baseColors.length;
    const baseColor = baseColors[idx].match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)!;
    colors.push(
      `rgba(${Math.min(255, parseInt(baseColor[1]) + 40)}, ${Math.min(
        255,
        parseInt(baseColor[2]) + 40
      )}, ${Math.min(255, parseInt(baseColor[3]) + 40)}, ${baseColor[4]})`
    );
  }
  
  return colors;
}

// Format date for display
export function formatDate(dateString: string): string {
  // Depending on the format in your data, you might need to adjust this
  if (dateString.includes("W")) {
    // Weekly format like "2025-W08"
    const [year, week] = dateString.split("-W");
    return `Week ${week}, ${year}`;
  }
  
  if (dateString.includes(" ")) {
    // Monthly format like "Apr 2024"
    return dateString;
  }
  
  // Default date formatting
  const date = new Date(dateString);
  return date.toLocaleDateString();
}