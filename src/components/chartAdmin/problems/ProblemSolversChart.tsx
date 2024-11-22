import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { getTop10Solver } from '../../../services/problem/problem.admin.service';
import useSWR from 'swr';

// Define the data type for top solvers
interface SolverData {
  name: string;
  problems: number;
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

const ProblemSolversChart: React.FC = () => {
  // Fetch top solvers data
  const { data: top10Solver } = useSWR('top-10-solver', () => getTop10Solver());

  // Map the API response to the format required by the chart
  const formattedData: SolverData[] =
    top10Solver?.data.map((solver: any) => ({
      name: solver.username,
      problems: solver.submitCount
    })) || [];

  return (
    <motion.div
      className="box lg:col-span-2 rounded-xl bg-opacity-50 p-6 shadow-lg backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="sub-title mb-4 text-[1.6rem] font-medium">Top 10 Problem Solvers</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563'
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Legend />
            <Bar dataKey="problems" fill="#8884d8">
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProblemSolversChart;
