import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useSWR from 'swr';
import { getPostOverViews } from '../../../services/post/post.admin.service';

const PostsOverviewChart: React.FC = () => {
  const { data, isLoading } = useSWR('postOverviewChart', getPostOverViews);
  // Define the state type

  return (
    <motion.div
      className="box mb-8 h-full rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="sub-title text-[1.6rem] font-semibold">Posts Overview</h2>
      </div>

      <div className="h-full max-h-[300px] max-w-full">
        <ResponsiveContainer>
          <AreaChart data={data?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4B5563' }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Area type="monotone" dataKey="total" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PostsOverviewChart;
