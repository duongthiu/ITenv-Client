import { CheckCircle, Clock, DollarSign, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/CommonAdmin/StatCard';
import DailyProblems from '../../components/CommonAdmin/orders/DailyProblems';
import ProblemsTable from '../../components/CommonAdmin/orders/ProblemsTable';
import Header from '../../components/CommonAdmin/Header';
import useSWR from 'swr';
import { getTotalDataProblemPage } from '../../services/problem/problem.admin.service';

const ProblemsPage = () => {
  const { data } = useSWR('problem-datapage', getTotalDataProblemPage);
  console.log(data);
  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Posts" />
      <main className="lg:px-8 mx-auto px-4 py-6">
        <motion.div
          className="sm:grid-cols-2 lg:grid-cols-4 mb-8 grid grid-cols-4 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total problems" icon={ShoppingBag} value={data?.data?.totalProblems} color="#6366F1" />
          <StatCard name="Resolved Problems" icon={CheckCircle} value={data?.data?.resolvedProblems} color="#10B981" />
          <StatCard name="Active Problems" icon={Clock} value={data?.data?.totalActivePorblems} color="#F59E0B" />

          <StatCard
            name="Blocked Problems"
            icon={DollarSign}
            value={data?.data?.totalBlockedProblems}
            color="#EF4444"
          />
        </motion.div>
        <div className="lg:grid-cols-2 mb-8 grid grid-cols-1 gap-2">
          <ProblemsTable />
        </div>

        <div className="lg:grid-cols-2 mb-8 grid grid-cols-1 gap-2">
          <DailyProblems />
        </div>
      </main>
    </div>
  );
};
export default ProblemsPage;
