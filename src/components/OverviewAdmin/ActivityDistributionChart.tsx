import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

// Define data type
interface PostData {
  name: string;
  value: number;
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

const ActivityDistributionChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // Default month is January
  const [selectedYear, setSelectedYear] = useState<number>(2024); // Default year is 2024

  const months = Array.from({ length: 12 }, (_, index) => index + 1); // Generate months [1, 12]
  const years = [2023, 2024, 2025]; // Years available for selection

  const postData: PostData[] = [
    { name: 'Post', value: 4500 },
    { name: 'Comment', value: 3200 },
    { name: 'Upvote', value: 2800 },
    { name: 'Share', value: 2100 },
    { name: 'Downvote', value: 1900 }
  ];

  return (
    <motion.div
      className="box rounded-xl bg-opacity-50 p-6 shadow-lg backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="sub-title mb-4 text-[1.6rem] font-medium">Post Activity Distribution by Month</h2>

      {/* Dropdowns for Month and Year */}
      <div className="mb-4 flex gap-4">
        {/* Ant Design Select for Month */}
        <Select value={selectedMonth} onChange={(value) => setSelectedMonth(value)} className="w-[100px]">
          {months.map((month) => (
            <Option key={month} value={month}>
              Tháng {month}
            </Option>
          ))}
        </Select>

        {/* Ant Design Select for Year */}
        <Select value={selectedYear} onChange={(value) => setSelectedYear(value)} className="w-[100px]">
          {years.map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
      </div>

      {/* Pie Chart Section */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="104%">
          <PieChart>
            <Pie
              data={postData}
              cx="50%"
              cy="47%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {postData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563'
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ActivityDistributionChart;
