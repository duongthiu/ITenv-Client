import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react';
import Header from '../../components/CommonAdmin/Header';
import StatCard from '../../components/CommonAdmin/StatCard';
import PostsTable from '../../components/CommonAdmin/posts/PostsTable';
import DailyPostsTrend from '../../components/chartAdmin/posts/DailyPostsTrend';
import PostsOverviewChart from '../../components/chartAdmin/posts/PostsOverviewChart';
import useSWR from 'swr';
import { getTotalDataPost } from '../../services/post/post.admin.service';

const PostsPage = () => {
  const { data, isLoading } = useSWR('data-postpage', getTotalDataPost);
  console.log(data);
  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Posts" />

      <main className="lg:px-8 mx-auto px-4 py-6">
        {/* STATS */}
        <motion.div
          className="sm:grid-cols-2 lg:grid-cols-4 mb-8 grid grid-cols-4 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Posts" icon={Package} value={data?.data?.totalPost} color="#6366F1" />
          <StatCard name="New posts today" icon={TrendingUp} value={data?.data?.totalNewPostsToday} color="#10B981" />
          <StatCard name="Blocked Posts" icon={AlertTriangle} value={data?.data?.postBlocked} color="#F59E0B" />
          <StatCard name="Active Posts" icon={DollarSign} value={data?.data?.postActive} color="#EF4444" />
        </motion.div>

        <PostsTable />

        {/* CHARTS */}
        <div className="lg:grid-cols-2 grid grid-cols-2 gap-8">
          <DailyPostsTrend />
          <PostsOverviewChart />
        </div>
      </main>
    </div>
  );
};

export default PostsPage;
