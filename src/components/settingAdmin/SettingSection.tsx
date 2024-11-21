import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react'; // Import LucideProps

// Define the types for the props
interface SettingSectionProps {
  icon: React.ComponentType<LucideProps>; // Sử dụng React.ComponentType<LucideProps>
  title: string; // Title of the section
  children: ReactNode; // Children can be any valid React node
}

const SettingSection: FC<SettingSectionProps> = ({ icon: Icon, title, children }) => {
  return (
    <motion.div
      className="box mb-8 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-center">
        <Icon className="mr-4 text-indigo-400" size={24} />
        <h2 className="sub-title text-[1.6rem] font-semibold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
};

export default SettingSection;
