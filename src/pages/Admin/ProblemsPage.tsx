import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "antd/es/layout/layout";
import StatCard from "../../components/CommonAdmin/StatCard";
import DailyProblems from "../../components/CommonAdmin/orders/DailyProblems";
import ProblemsTable from "../../components/CommonAdmin/orders/ProblemsTable";


const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const OrdersPage = () => {
	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title="Problems" />

			<main className='lg:px-8 mx-auto px-4 py-6 '>
				<motion.div
					className='sm:grid-cols-2 lg:grid-cols-4 mb-8 grid grid-cols-4 gap-5'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total problems' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
					<StatCard
						name='Resolved Problems'
						icon={CheckCircle}
						value={orderStats.completedOrders}
						color='#10B981'
					/>
					<StatCard name='Active Problems' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />

					<StatCard name='Blocked Problems' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8'>
					<ProblemsTable />
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8'>
					<DailyProblems />
				</div>

			</main>
		</div>
	);
};
export default OrdersPage;
