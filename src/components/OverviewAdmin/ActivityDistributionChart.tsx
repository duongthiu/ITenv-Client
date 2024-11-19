import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, TooltipProps } from "recharts";

// Định nghĩa kiểu dữ liệu cho categoryData
interface PostData {
	name: string;
	value: number;
}

const postData: PostData[] = [
	{ name: "Post", value: 4500 },
	{ name: "Comment ", value: 3200 },
	{ name: "Upvote", value: 2800 },
	{ name: "Share ", value: 2100 },
	{ name: "Downvote", value: 1900 },
];

// Mảng màu cho các phần
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];
import { useState } from "react";

const ActivityDistributionChart: React.FC = () => {
	// Thêm state để chọn tháng và năm
	const [selectedMonth, setSelectedMonth] = useState<number>(1); // Tháng mặc định là tháng 1
	const [selectedYear, setSelectedYear] = useState<number>(2024); // Năm mặc định là 2024

	// Danh sách các tháng và năm
	const months = Array.from({ length: 12 }, (_, index) => index + 1); // Tạo mảng tháng từ 1 đến 12
	const years = [2023, 2024, 2025]; // Thêm các năm muốn chọn

	// Dữ liệu mô phỏng, bạn có thể thay đổi theo tháng và năm
	const postData: PostData[] = [
		{ name: "Post", value: 4500 },
		{ name: "Comment", value: 3200 },
		{ name: "Upvote", value: 2800 },
		{ name: "Share", value: 2100 },
		{ name: "Downvote", value: 1900 },
	];

	// Thêm logic để thay đổi dữ liệu theo tháng/năm nếu cần

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className="text-lg font-medium mb-4 text-gray-100">Post Activity Distribution by Month</h2>

			{/* Dropdown chọn tháng */}
			<div className="mb-4">
				<select
					value={selectedMonth}
					onChange={(e) => setSelectedMonth(Number(e.target.value))}
					className="bg-gray-500 text-white px-4 py-2 rounded-md"
				>
					{months.map((month) => (
						<option key={month} value={month}>
							Tháng {month}
						</option>
					))}
				</select>

				{/* Dropdown chọn năm */}
				<select
					value={selectedYear}
					onChange={(e) => setSelectedYear(Number(e.target.value))}
					className="bg-gray-500 text-white px-4 py-2 rounded-md ml-4"
				>
					{years.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
			</div>

			<div className="h-80">
				<ResponsiveContainer width="100%" height="104%">
					<PieChart>
						<Pie
							data={postData}
							cx="50%"
							cy="47%"
							labelLine={false}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{postData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default ActivityDistributionChart;
