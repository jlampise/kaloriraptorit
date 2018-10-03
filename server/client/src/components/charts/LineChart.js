import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export default ({ data, instructions }) => {
  let yAxisKey = '';
  if (instructions.size === 1) {
    yAxisKey = instructions[0].dataKey;
  }

  return (
    <ResponsiveContainer width="100%" aspect={3}>
      <LineChart
        data={data}
        margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
      >
        { instructions.map(i => {
          return (
            <Line
              key={i.dataKey}
              name={i.name}
              type="monotone"
              dataKey={i.dataKey}
              stroke={i.stroke}
            />
          );
        })}
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="datePresentation" />
        <YAxis dataKey={yAxisKey} />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};
