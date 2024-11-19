// AdminLayout.tsx (Tạo một layout dành riêng cho Admin)

import React from 'react';
import Sidebar from '../../components/CommonAdmin/Sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex">
            {/* Sidebar sẽ hiển thị trong AdminLayout */}
            <Sidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
