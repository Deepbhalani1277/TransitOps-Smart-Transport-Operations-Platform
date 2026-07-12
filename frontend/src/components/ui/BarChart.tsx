import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: { name: string; revenue: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-panel border border-gray-800 p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Monthly Fleet Financial Summary
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#141414',
              borderColor: '#262626',
              borderRadius: '6px',
            }}
            itemStyle={{ color: '#d97706' }}
            labelStyle={{ color: '#a3a3a3' }}
            cursor={{ fill: '#1f1f1f' }}
          />
          <Bar dataKey="revenue" fill="#d97706" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
