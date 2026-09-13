import React from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

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
    <BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 2.418 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <XAxis dataKey="month" />
      <YAxis width="auto" />
      <Tooltip />
      <Bar dataKey="amount" fill="#54b5e3" activeBar={{ fill: '#a6e7f8' }} radius={[6, 6, 0, 0]} />
    </BarChart>
  );
};

export default BarChartGraph;
