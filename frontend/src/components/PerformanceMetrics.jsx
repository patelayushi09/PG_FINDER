import React from 'react';
import { Building2, Star, MessageSquare } from 'lucide-react';

export function PerformanceMetrics() {
  const metrics = [
    { label: 'Property Verification Rate', value: 92, icon: Building2 },
    { label: 'User Satisfaction', value: 88, icon: Star },
    { label: 'Response Rate', value: 95, icon: MessageSquare }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#103538] mb-4">Performance Metrics</h2>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-[#DCD29F] bg-opacity-20 p-2 rounded-full">
                <metric.icon className="w-5 h-5 text-[#D8B258]" />
              </div>
              <span className="ml-3 text-sm text-gray-600">{metric.label}</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                <div 
                  className="h-full bg-[#D96851] rounded-full"
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-[#103538]">{metric.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerformanceMetrics;
