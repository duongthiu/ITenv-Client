import React, { useState } from "react";
import { Input, Table, Button } from "antd";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";

// Define the Post type
interface Post {
  id: number;
  Title: string;
  PostedBy: string;
  Tags: number;
  Views: number;
  Vote: number;
  IsAnonymous: boolean;
  Resolve: boolean;
  Status: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

const POST_DATA: Post[] = [
  {
    id: 1,
    Title: "How to learn React",
    PostedBy: "John Doe",
    Tags: 3,
    Views: 120,
    Vote: 15,
    IsAnonymous: false,
    Resolve: false,
    Status: true,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date("2024-01-02"),
  },
  {
    id: 2,
    Title: "Understanding TypeScript",
    PostedBy: "Jane Smith",
    Tags: 2,
    Views: 98,
    Vote: 22,
    IsAnonymous: false,
    Resolve: true,
    Status: false,
    CreatedAt: new Date("2024-01-03"),
    UpdatedAt: new Date("2024-01-04"),
  },
  {
    id: 3,
    Title: "Node.js Best Practices",
    PostedBy: "Michael Brown",
    Tags: 4,
    Views: 150,
    Vote: 30,
    IsAnonymous: false,
    Resolve: false,
    Status: true,
    CreatedAt: new Date("2024-01-05"),
    UpdatedAt: new Date("2024-01-06"),
  },
];

const PostsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(POST_DATA);

  // Filter posts based on the search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = POST_DATA.filter(
      (post) =>
        post.Title.toLowerCase().includes(term) || post.PostedBy.toLowerCase().includes(term)
    );
    setFilteredPosts(filtered);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
    },
    {
      title: "Posted By",
      dataIndex: "PostedBy",
      key: "PostedBy",
    },
    {
      title: "Tags",
      dataIndex: "Tags",
      key: "Tags",
    },
    {
      title: "Views",
      dataIndex: "Views",
      key: "Views",
    },
    {
      title: "Vote",
      dataIndex: "Vote",
      key: "Vote",
    },
    {
      title: "Is Anonymous",
      dataIndex: "IsAnonymous",
      key: "IsAnonymous",
      render: (isAnonymous: boolean) => (isAnonymous ? "Yes" : "No"),
    },
    {
      title: "Resolved",
      dataIndex: "Resolve",
      key: "Resolve",
      render: (resolve: boolean) => (resolve ? "Yes" : "No"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status: boolean) => (status ? "Active" : "Inactive"),
    },
    {
      title: "Created At",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Updated At",
      dataIndex: "UpdatedAt",
      key: "UpdatedAt",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Post) => (
        <div className="flex items-center gap-2">
          <Button
            type="link"
            icon={<Edit size={18} />}
            className="text-indigo-400 hover:text-indigo-300"
            aria-label="Edit post"
          />
          <Button
            type="link"
            icon={<Trash2 size={18} />}
            className="text-red-400 hover:text-red-300"
            aria-label="Delete post"
          />
        </div>
      ),
    },
  ];


  return (
    <motion.div
      className="box mb-8 rounded-xl bg-opacity-50 p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="sub-title text-[1.6rem] font-semibold">Posts List</h2>
        <Input
          type="text"
          placeholder="Search posts..."
          className="w-[300px] rounded-lg px-5 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
          prefix={<Search className="text-gray-400" size={18} />}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredPosts}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="bg-opacity-50"
      />
    </motion.div>
  );
};

export default PostsTable;
