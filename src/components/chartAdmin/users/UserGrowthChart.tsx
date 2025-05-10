import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getUserGrowth } from '../../../services/user/user.admin.service';

const UserGrowthChart: React.FC = () => {
  const { data: userGrowth } = useSWR('user-growth', () => getUserGrowth());
  const chartData = userGrowth?.data?.map((item: { month: number; total: number }) => ({
    month: item.month, // This will be used for the X-Axis
    users: item.total // This will be used for the Y-Axis
  }));
  return (
    <motion.div
      className="box rounded-xl bg-opacity-50 p-6 shadow-lg backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="sub-title mb-4 text-base font-semibold">User Growth</h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563'
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserGrowthChart;
