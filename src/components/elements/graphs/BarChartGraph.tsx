import React from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BarChartGraph: React.FC = () => {
  const data = [
    { month: "Jan", amount: "2351981.52" },
    { month: "Feb", amount: "1497082.93" },
    { month: "Mar", amount: "1811594.92" },
    { month: "Apr", amount: "1857947.04" },
    { month: "May", amount: "2563365.89" },
    { month: "Jun", amount: "3428219.42" },
    { month: "Jul", amount: "849287.92" },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '700px', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis width={40} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="amount" fill="#54b5e3" activeBar={{ fill: '#a6e7f8' }} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartGraph;