import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Đảm bảo bạn đã import motion
import { Link } from "react-router-dom";

// Định nghĩa kiểu cho các item trong Sidebar
interface SidebarItem {
	name: string;
	icon: React.ElementType; // Thể hiện là một component icon
	color: string;
	href: string;
}

// Dữ liệu các item trong sidebar
const SIDEBAR_ITEMS: SidebarItem[] = [
	{
		name: "Overview",
		icon: BarChart2,
		color: "#6366f1",
		href: "/overviews",
	},
	{ name: "Users", icon: Users, color: "#EC4899", href: "/users" },
	{ name: "Posts", icon: ShoppingBag, color: "#8B5CF6", href: "/posts" },
	{ name: "Sales", icon: DollarSign, color: "#10B981", href: "/sales" },
	{ name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
	{ name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
	{ name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

// Định nghĩa kiểu cho props và state của Sidebar component
const Sidebar: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

	return (
		<div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<button
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href}>
							<div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</div>
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;
