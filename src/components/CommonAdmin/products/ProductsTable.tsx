import React, { useState } from 'react';
import { Input, Table, Button } from 'antd';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2 } from 'lucide-react';

// Define the Product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
}

const PRODUCT_DATA: Product[] = [
  { id: 1, name: 'Wireless Earbuds', category: 'Electronics', price: 59.99, stock: 143, sales: 1200 },
  { id: 2, name: 'Leather Wallet', category: 'Accessories', price: 39.99, stock: 89, sales: 800 },
  { id: 3, name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 56, sales: 650 },
  { id: 4, name: 'Yoga Mat', category: 'Fitness', price: 29.99, stock: 210, sales: 950 },
  { id: 5, name: 'Coffee Maker', category: 'Home', price: 79.99, stock: 78, sales: 720 }
];

const ProductsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCT_DATA);

  // Filter products based on the search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = PRODUCT_DATA.filter(
      (product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <img src="https://via.placeholder.com/40" alt="Product img" className="h-10 w-10 rounded-full" />
          {text}
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <div className="flex items-center gap-2">
          <Button
            type="link"
            icon={<Edit size={18} />}
            className="text-indigo-400 hover:text-indigo-300"
            aria-label="Edit product"
          />
          <Button
            type="link"
            icon={<Trash2 size={18} />}
            className="text-red-400 hover:text-red-300"
            aria-label="Delete product"
          />
        </div>
      )
    }
  ];

  return (
    <motion.div
      className="box mb-8 rounded-xl bg-opacity-50 p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="sub-title text-[1.6rem] font-semibold">Product List</h2>
        <Input
          type="text"
          placeholder="Search products..."
          className="w-[300px] rounded-lg px-5 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
          prefix={<Search className="text-gray-400" size={18} />}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="bg-opacity-50"
      />
    </motion.div>
  );
};

export default ProductsTable;
