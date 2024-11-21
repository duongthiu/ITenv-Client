import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react';
import Header from '../../components/CommonAdmin/Header';
import StatCard from '../../components/CommonAdmin/StatCard';
import ProductsTable from '../../components/CommonAdmin/products/ProductsTable';

const ProductsPage = () => {
  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Products" />

      <main className="lg:px-8 mx-auto px-4 py-6">
        {/* STATS */}
        <motion.div
          className="sm:grid-cols-2 lg:grid-cols-4 mb-8 grid grid-cols-4 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Products" icon={Package} value={1234} color="#6366F1" />
          <StatCard name="Top Selling" icon={TrendingUp} value={89} color="#10B981" />
          <StatCard name="Low Stock" icon={AlertTriangle} value={23} color="#F59E0B" />
          <StatCard name="Total Revenue" icon={DollarSign} value="$543,210" color="#EF4444" />
        </motion.div>

        <ProductsTable />

        {/* CHARTS */}
        <div className="grid-col-1 lg:grid-cols-2 grid gap-8">
          {/* <SalesTrendChart /> */}
          {/* <CategoryDistributionChart /> */}
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
