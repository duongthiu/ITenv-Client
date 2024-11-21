import { Users, BookCopy, FilePlus2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/CommonAdmin/StatCard';
import Header from '../../components/CommonAdmin/Header';
import ProblemsOverviewChart from '../../components/OverviewAdmin/ProblemsOverviewChart';
import ActivityDistributionChart from '../../components/OverviewAdmin/ActivityDistributionChart';
import ProblemSolversChart from '../../components/OverviewAdmin/ProblemSolversChart';
import { getAverageProblemsPerUser } from '../../services/problem/problem.service.js';
import { useEffect, useState } from 'react';

const OverviewPage: React.FC = () => {
  const [averageProblemsPerUser, setAverageProblemsPerUser] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const averageProblems = await getAverageProblemsPerUser();
        setAverageProblemsPerUser(averageProblems.total ?? null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

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
            value={averageProblemsPerUser !== null ? averageProblemsPerUser.toString() : 'Loading...'}
            color="#6366F1"
          />
          <StatCard name="Total Post" icon={FilePlus2} value="1,234" color="#8B5CF6" />
          <StatCard name="Total Problems" icon={BookCopy} value="567" color="#EC4899" />
          <StatCard name="New Users ( In month )" icon={UserPlus} value="770" color="#10B981" />
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
