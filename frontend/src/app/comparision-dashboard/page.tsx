'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Policy {
    insurance_name: string;
    insurance_type: string;
    entry_age_min: number;
    entry_age_max: number;
    sum_assured_min: number;
    sum_assured_unit_note?: string;
    key_benefits_or_riders: string[] | string;
    medical_considerations: string;
    premium_payment_option: string;
    features_description: string;
    sample_premium: number;
    sample_premium_note?: string;
}

interface PoliciesData {
    insurance_plans: Policy[];
    comparison_summary: {
        notes: string[];
        [key: string]: any;
    };
}

const ComparisonDashboardPage = () => {
    const searchParams = useSearchParams();
    const result = searchParams.get('result');
    const [data, setData] = useState<PoliciesData | null>(null);

    useEffect(() => {
        let parsed: PoliciesData | null = null;

        // Try parsing from URL parameter
        if (typeof result === 'string') {
            try {
                parsed = JSON.parse(result);
            } catch (error) {
                console.error('Invalid result format:', error);
            }
        }

        // If parsing from URL fails or is not present, fallback to localStorage
        if (!parsed) {
            const storedData = localStorage.getItem('comparison_result');
            if (storedData) {
                try {
                    const parsedStored = JSON.parse(storedData);
                    if (parsedStored?.policies) {
                        parsed = {
                            insurance_plans: parsedStored.policies,
                            comparison_summary: parsedStored.comparison_summary || { notes: [] }
                        };
                    }
                } catch (error) {
                    console.error('Error parsing localStorage data:', error);
                }
            }
        }

        if (parsed) {
            setData(parsed);
        }
    }, [result]);

    if (!data) {
        return <p className="p-4 text-center text-gray-600">Loading comparison data...</p>;
    }

    const { insurance_plans, comparison_summary } = data;

    if (!insurance_plans || insurance_plans.length === 0) {
        return <p className="p-4 text-center text-gray-600">No insurance plan data available.</p>;
    }

    const attributesToShow: { key: keyof Policy; label: string }[] = [
        { key: 'insurance_name', label: 'Insurance Name' },
        { key: 'insurance_type', label: 'Insurance Type' },
        { key: 'entry_age_min', label: 'Min Entry Age' },
        { key: 'entry_age_max', label: 'Max Entry Age' },
        { key: 'sum_assured_min', label: 'Min Sum Assured' },
        { key: 'key_benefits_or_riders', label: 'Key Benefits/Riders' },
        { key: 'medical_considerations', label: 'Medical Considerations' },
        { key: 'premium_payment_option', label: 'Premium Payment' },
        { key: 'features_description', label: 'Features Description' },
        { key: 'sample_premium', label: 'Sample Premium' },
    ];

    const renderCellValue = (policy: Policy, attributeKey: keyof Policy) => {
        const value = policy[attributeKey];
        if (Array.isArray(value)) return value.join(', ');
        if (value === undefined || value === null) return <span className="text-gray-500">N/A</span>;
        return String(value);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Insurance Plan Comparison Dashboard
            </h1>

            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="sticky left-0 z-10 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300">
                                Feature
                            </th>
                            {insurance_plans.map((plan) => (
                                <th key={plan.insurance_name} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                    {plan.insurance_name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attributesToShow.map((attr) => (
                            <tr key={attr.key} className="hover:bg-gray-50">
                                <td className="sticky left-0 z-10 bg-white hover:bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 border-r border-gray-300">
                                    {attr.label}
                                </td>
                                {insurance_plans.map((plan) => (
                                    <td key={`${plan.insurance_name}-${attr.key}`} className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                                        {renderCellValue(plan, attr.key)}
                                        {attr.key === 'sum_assured_min' && plan.sum_assured_unit_note && (
                                            <small className="block text-xs text-gray-500 mt-1">({plan.sum_assured_unit_note})</small>
                                        )}
                                        {attr.key === 'sample_premium' && plan.sample_premium_note && (
                                            <small className="block text-xs text-gray-500 mt-1">({plan.sample_premium_note})</small>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {comparison_summary && (
                <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Comparison Summary</h2>
                    {comparison_summary.notes && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Notes:</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {comparison_summary.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {Object.entries(comparison_summary).map(([key, value]) => {
                        if (key === 'notes') return null;
                        const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            return (
                                <div key={key} className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">{title}:</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                        {Object.entries(value as Record<string, string>).map(([subKey, subValue]) => (
                                            <li key={subKey}>
                                                <strong className="font-semibold">{subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {subValue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        } else if (typeof value === 'string') {
                            return (
                                <div key={key} className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">{title}:</h3>
                                    <p className="text-sm text-gray-600">{value}</p>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};

export default ComparisonDashboardPage;
