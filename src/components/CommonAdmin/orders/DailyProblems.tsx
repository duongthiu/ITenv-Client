import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useSWR from 'swr';
import { getDailyProblemTrend } from '../../../services/problem/problem.admin.service';

const DailyOrders: React.FC = () => {
  const { data } = useSWR('dailyProblems', () => getDailyProblemTrend());
  return (
    <motion.div
      className="box rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="sub-title mb-4 text-base font-semibold">Daily Problem Solver</h2>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="DayOfWeek" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563'
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;
