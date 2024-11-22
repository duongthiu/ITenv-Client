import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Define the type for the sales data
interface SalesData {
	name: string;
	posts: number;
}

const dailyPostsData: SalesData[] = [
	{ name: "Mon", posts: 1000 },
	{ name: "Tue", posts: 1200 },
	{ name: "Wed", posts: 900 },
	{ name: "Thu", posts: 1100 },
	{ name: "Fri", posts: 1300 },
	{ name: "Sat", posts: 1600 },
	{ name: "Sun", posts: 1400 },
];

const DailyPostsTrend: React.FC = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Daily Posts Trend</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={dailyPostsData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='name' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Bar dataKey='posts' fill='#10B981' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default DailyPostsTrend;
