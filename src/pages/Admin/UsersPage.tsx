import { UserCheck, UserPlus, UsersIcon, UserX } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../components/CommonAdmin/Header';
import StatCard from '../../components/CommonAdmin/StatCard';
import UserGrowthChart from '../../components/chartAdmin/users/UserGrowthChart';
import UsersTable from '../../components/chartAdmin/users/UsersTable';
import UserActivityHeatmap from '../../components/chartAdmin/users/UserActivityHeatmap';
import UserDemographicsChart from '../../components/chartAdmin/users/UserDemographicsChart';

const userStats = {
  totalUsers: 152845,
  newUsersToday: 243,
  activeUsers: 98520,
  churnRate: '2.4%'
};

const UsersPage = () => {
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
          <StatCard name="Total Users" icon={UsersIcon} value={userStats.totalUsers.toLocaleString()} color="#6366F1" />
          <StatCard name="New Users Today" icon={UserPlus} value={userStats.newUsersToday} color="#10B981" />
          <StatCard
            name="Active Users"
            icon={UserCheck}
            value={userStats.activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard name="Churn Rate" icon={UserX} value={userStats.churnRate} color="#EF4444" />
        </motion.div>

        <UsersTable />

        {/* USER CHARTS */}
        <div className="lg:grid-cols-2 mt-8 grid grid-cols-3 gap-6">
          <UserGrowthChart />
          <UserActivityHeatmap />
          <UserDemographicsChart />
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
