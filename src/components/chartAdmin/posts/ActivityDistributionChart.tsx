import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select } from 'antd';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { QueryOptions } from '../../../types/common';
import { getPostActivityByMonth } from '../../../services/post/post.admin.service';

const { Option } = Select;

// Define data type
interface PostData {
  name: string;
  value: number;
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

const ActivityDistributionChart: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based, so add 1
  const currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Query options for fetching data
  const queryOptions: QueryOptions = {
    month: selectedMonth,
    year: selectedYear
  };

  // Fetch data based on queryOptions
  const { data: postActivityDistribution, isValidating } = useSWR(
    ['post-activity-distribution', queryOptions],
    () => getPostActivityByMonth(queryOptions),
    { revalidateOnFocus: false }
  );

  // Transform fetched data into chart-friendly format
  const postData: PostData[] = postActivityDistribution?.data
    ? [
      { name: 'Posts', value: postActivityDistribution.data.totalPosts },
      { name: 'Comments', value: postActivityDistribution.data.totalComments },
      { name: 'Upvotes', value: postActivityDistribution.data.totalUpvotes },
      { name: 'Downvotes', value: postActivityDistribution.data.totalDownvotes },
      { name: 'Shares', value: postActivityDistribution.data.totalShares }
    ]
    : [];

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
          {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
            <Option key={month} value={month}>
              Tháng {month}
            </Option>
          ))}
        </Select>

        {/* Ant Design Select for Year */}
        <Select value={selectedYear} onChange={(value) => setSelectedYear(value)} className="w-[100px]">
          {[2023, 2024, 2025].map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
      </div>

      {/* Pie Chart Section */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
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

      {/* Loading Indicator */}
      {isValidating && <div className="mt-4 text-center text-gray-500">Loading...</div>}
    </motion.div>
  );
};

export default ActivityDistributionChart;
