import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats a date string into a more readable format
 */
export function formatDate(dateStr: string): string {
  // Basic formatting function - can be expanded based on specific date format needs
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Converts an object to an array of chart data objects
 */
export function objectToChartData(obj: Record<string, number>): Array<{name: string, value: number}> {
  return Object.entries(obj).map(([name, value]) => ({
    name,
    value
  }));
}

/**
 * Generates an array of colors for charts
 */
export function generateChartColors(count: number): string[] {
  const baseColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#f97316", // orange
    "#6366f1"  // indigo
  ];
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // If we need more colors than in our base set, we'll repeat with variations
  const colors = [...baseColors];
  
  for (let i = 0; colors.length < count; i++) {
    const index = i % baseColors.length;
    // Add a slightly modified version of the base color
    colors.push(baseColors[index]);
  }
  
  return colors.slice(0, count);
}