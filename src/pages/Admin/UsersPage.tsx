import { motion } from 'framer-motion';
import { UserCheck, UserPlus, UsersIcon, UserX } from 'lucide-react';
import useSWR from 'swr';
import Header from '../../components/CommonAdmin/Header';
import StatCard from '../../components/CommonAdmin/StatCard';
import UserActivityHeatmap from '../../components/chartAdmin/users/UserActivityHeatmap';
import UserDemographicsChart from '../../components/chartAdmin/users/UserDemographicsChart';
import UserGrowthChart from '../../components/chartAdmin/users/UserGrowthChart';
import UsersTable from '../../components/chartAdmin/users/UsersTable';
import {
  getTotalActiveUsers,
  getTotalChurnUsers,
  getTotalNewUsers,
  getTotalUsers
} from '../../services/user/user.admin.service';

const UsersPage = () => {
  const { data: totalUsers } = useSWR('total-users', () => getTotalUsers());
  const { data: totalActiveUsers } = useSWR('total-active-users', () => getTotalActiveUsers());
  const { data: totalNewUsers } = useSWR('total-new-users', () => getTotalNewUsers());
  const { data: totalChurnUsers } = useSWR('total-churn-users', () => getTotalChurnUsers());
  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Users" />

      <main className="lg:px-8 mx-auto px-4 py-6">
        {/* STATS */}
        <motion.div
          className="sm:grid-cols-2 lg:grid-cols-4 mb-8 grid grid-cols-4 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Users"
            icon={UsersIcon}
            value={totalUsers?.data?.toLocaleString() || ''}
            color="#6366F1"
          />
          <StatCard
            name="New Users Today"
            icon={UserPlus}
            value={totalNewUsers?.data?.toLocaleString() || ''}
            color="#10B981"
          />
          <StatCard
            name="Online Users"
            icon={UserCheck}
            value={totalActiveUsers?.data?.toLocaleString() || ''}
            color="#F59E0B"
          />
          <StatCard
            name="Churn Rate"
            icon={UserX}
            value={totalChurnUsers?.data?.toLocaleString() || ''}
            color="#EF4444"
          />
        </motion.div>

        <UsersTable />

        {/* USER CHARTS */}
        <div className="lg:grid-cols-2 mt-8 grid grid-cols-2 gap-6">
          <UserGrowthChart />
          {/* <UserActivityHeatmap /> */}
          <UserDemographicsChart />
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
