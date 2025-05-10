'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface Policy {
  insurance_name: string;
  insurance_type: string;
  policy_term_min: number;
  policy_term_max: number;
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

// ✅ Normalizes raw policy data
const normalizePolicy = (raw: any): Policy => ({
  insurance_name: raw['Insurance Name'] ?? '',
  insurance_type: raw['Insurance Type'] ?? '',
  policy_term_min: Number(raw['Policy Term Min']) || 0,
  policy_term_max: Number(raw['Policy Term Max']) || 0,
  sum_assured_min: Number(raw['Sum Assured Min']) || 0,
  sum_assured_unit_note: raw['Sum Assured Unit Note'] || '',
  key_benefits_or_riders: raw['Key Benefits/Riders'] || [],
  medical_considerations: raw['Medical Considerations'] || '',
  premium_payment_option: raw['Premium Payment Option'] || '',
  features_description: raw['Features Description'] || '',
  sample_premium: Number(raw['Sample Premium']) || 0,
  sample_premium_note: raw['Sample Premium Note'] || '',
});

const ComparisonDashboardPage = () => {
  const searchParams = useSearchParams();
  const result = searchParams.get('result');
  const [data, setData] = useState<PoliciesData | null>(null);

  useEffect(() => {
    let parsed: PoliciesData | null = null;

    if (typeof result === 'string') {
      try {
        parsed = JSON.parse(result);
      } catch (error) {
        console.error('Invalid result format:', error);
      }
    }

    if (!parsed) {
      const storedData = localStorage.getItem('comparison_result');
      if (storedData) {
        try {
          const parsedStored = JSON.parse(storedData);
          if (parsedStored?.policies) {
            parsed = {
              insurance_plans: parsedStored.policies.map(normalizePolicy),
              comparison_summary: parsedStored.comparison_summary || { notes: [] },
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
    { key: 'policy_term_min', label: 'Min Policy Term' },
    { key: 'policy_term_max', label: 'Max Policy Term' },
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
    if (value === undefined || value === null || value === '')
      return <span className="text-gray-500">N/A</span>;
    return String(value);
  };

  // Prepare data for charts
  const insuranceTypeCounts: { [type: string]: number } = {};
  const samplePremiumData: { name: string; premium: number }[] = [];

  insurance_plans.forEach((plan) => {
    // Count insurance types
    const type = plan.insurance_type || 'Unknown';
    insuranceTypeCounts[type] = (insuranceTypeCounts[type] || 0) + 1;

    // Collect sample premium data
    samplePremiumData.push({
      name: plan.insurance_name,
      premium: plan.sample_premium,
    });
  });

  const pieData = {
    labels: Object.keys(insuranceTypeCounts),
    datasets: [
      {
        label: 'Insurance Type Distribution',
        data: Object.values(insuranceTypeCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const barData = {
    labels: samplePremiumData.map((item) => item.name),
    datasets: [
      {
        label: 'Sample Premium',
        data: samplePremiumData.map((item) => item.premium),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Insurance Plan Comparison Dashboard
      </h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
       <div className="bg-white p-4 rounded shadow flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Insurance Type Distribution
        </h2>
        <div className="w-112 h-112">
            <Pie data={pieData} />
        </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Sample Premium Comparison
          </h2>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="sticky left-0 z-10 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300">
                Feature
              </th>
              {insurance_plans.map((plan) => (
                <th
                  key={plan.insurance_name}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap"
                >
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
                  <td
                    key={`${plan.insurance_name}-${attr.key}`}
                    className="px-6 py-4 whitespace-normal text-sm text-gray-700"
                  >
                    {renderCellValue(plan, attr.key)}
                    {attr.key === 'sum_assured_min' && plan.sum_assured_unit_note && (
                      <small className="block text-xs text-gray-500 mt-1">
                        ({plan.sum_assured_unit_note})
                      </small>
                    )}
                    {attr.key === 'sample_premium' && plan.sample_premium_note && (
                      <small className="block text-xs text-gray-500 mt-1">
                        ({plan.sample_premium_note})
                      </small>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison Summary */}
      {comparison_summary && (
        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow border border-gray-200">

            <div className="mt-10 p-6 bg-white rounded-lg shadow border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Explanation of Each Feature</h2>
            <ul className="list-disc list-inside space-y-3 text-sm text-gray-700">
                <li><strong>Insurance Name:</strong> The official name of the insurance policy.</li>
                <li><strong>Insurance Type:</strong> The category of the insurance, such as life, term, health, etc.</li>
                <li><strong>Min/Max Policy Term:</strong> The minimum and maximum number of years for which the policy can be held.</li>
                <li><strong>Min Sum Assured:</strong> The lowest amount guaranteed to be paid under the policy (often the base coverage).</li>
                <li><strong>Key Benefits/Riders:</strong> Important features or optional add-ons that enhance the policy’s coverage.</li>
                <li><strong>Medical Considerations:</strong> Any health checks or medical requirements involved in getting the policy.</li>
                <li><strong>Premium Payment:</strong> How premiums are paid — monthly, annually, lump sum, etc.</li>
                <li><strong>Features Description:</strong> Additional highlights or unique features of the policy.</li>
                <li><strong>Sample Premium:</strong> An example premium amount based on a specific age/income/lifestyle scenario.</li>
            </ul>
            </div>


        </div>
      )}
    </div>
  );
};

export default ComparisonDashboardPage;
