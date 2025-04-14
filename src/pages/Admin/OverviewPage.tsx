import { Users, BookCopy, FilePlus2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/CommonAdmin/StatCard';
import Header from '../../components/CommonAdmin/Header';
import ProblemsOverviewChart from '../../components/chartAdmin/problems/ProblemsOverviewChart.js';
import ActivityDistributionChart from '../../components/chartAdmin/posts/ActivityDistributionChart.js';
import ProblemSolversChart from '../../components/chartAdmin/problems/ProblemSolversChart.js';
import { getAverageProblemsPerUser } from '../../services/problem/problem.service.js';
import useSWR from 'swr';
import { getTotalPosts } from '../../services/post/post.admin.service.js';
import { getTotalProblems } from '../../services/problem/problem.admin.service.js';
import { getTotalNewUsersInMonths } from '../../services/user/user.admin.service.js';

const OverviewPage: React.FC = () => {
  const { data: averageProblemsPerUser, isLoading: averageLoading } = useSWR('average-problems-per-user', () =>
    getAverageProblemsPerUser()
  );
  const { data: totalPost, isLoading: isLoadingPost } = useSWR('total-posts', () => getTotalPosts());
  const { data: totalProblems, isLoading: isLoadingProblems } = useSWR('total-problems', () => getTotalProblems());
  const { data: totalUserInMonths, isLoading: isLoadingUser } = useSWR('total-user-in-months', () =>
    getTotalNewUsersInMonths()
  );
  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Overview" />

      <main className="lg:px-8 mx-auto px-4 py-6">
        {/* STATS */}
        <motion.div
          className="mb-8 grid grid-cols-4 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="TAverage Problems Per User"
            icon={Users}
            value={
              !averageLoading
                ? averageProblemsPerUser?.data?.toString()
                  ? averageProblemsPerUser?.data?.toString()
                  : '0'
                : 'Loading...'
            }
            color="#6366F1"
          />
          <StatCard
            name="Total Post"
            icon={FilePlus2}
            value={!isLoadingPost ? (totalPost?.data?.toString() ? totalPost?.data?.toString() : '0') : 'Loading...'}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Problems"
            icon={BookCopy}
            value={
              !isLoadingProblems
                ? totalProblems?.data?.toString()
                  ? totalProblems?.data?.toString()
                  : '0'
                : 'Loading...'
            }
            color="#EC4899"
          />
          <StatCard
            name="New Users ( In month )"
            icon={UserPlus}
            value={
              !isLoadingUser
                ? totalUserInMonths?.data?.toString()
                  ? totalUserInMonths?.data?.toString()
                  : '0'
                : 'Loading...'
            }
            color="#10B981"
          />
        </motion.div>

        {/* CHARTS */}
        <div className="lg:grid-cols-1 grid grid-cols-2 gap-8">
          <ProblemsOverviewChart />
          <ActivityDistributionChart />
          <ProblemSolversChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
