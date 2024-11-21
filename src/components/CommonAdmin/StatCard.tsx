import { FC } from 'react';
import { LucideProps } from 'lucide-react'; // Import LucideProps
import { motion } from 'framer-motion';

interface StatCardProps {
  name: string;
  icon: React.ComponentType<LucideProps>; // Sử dụng React.ComponentType<LucideProps>
  value: string | number;
  color?: string;
}

const StatCard: FC<StatCardProps> = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      className="box overflow-hidden rounded-xl bg-opacity-50 shadow-lg backdrop-blur-md"
      whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
    >
      <div className="sm:p-6 px-4 py-5">
        <span className="flex items-center text-sm font-medium text-gray-400">
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
        <p className="sub-title mt-1 text-3xl font-semibold">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
