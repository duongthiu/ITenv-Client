import React, { useState } from 'react';
import { Card, Avatar, Tag, Space, Typography, Tooltip, Dropdown, Button, MenuProps } from 'antd';
import { CodeSandboxType } from '../../../types/codesandbox.type';
import { TeamOutlined, MoreOutlined } from '@ant-design/icons';
import { Lock, Unlock } from 'lucide-react';
import { timeAgo } from '../../../utils/helpers/formatDate';
import { useNavigate } from 'react-router-dom';
import ManageSandboxModal from './ManageSandboxModal';

const { Text } = Typography;

interface CodeSandboxCardProps {
  sandbox: CodeSandboxType;
  onClick?: () => void;
  isOwnProfile: boolean;
  mutate?: () => void;
}

const CodeSandboxCard: React.FC<CodeSandboxCardProps> = ({ sandbox, onClick, isOwnProfile, mutate }) => {
  const navigate = useNavigate();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation();
    if (e.key === 'detail') {
      navigate(`/code-sandbox/${sandbox._id}`);
    } else if (e.key === 'manage') {
      setIsManageModalOpen(true);
    }
  };

  const menuItems = [
    {
      key: 'detail',
      label: 'View Details'
    },
    {
      key: 'manage',
      label: 'Manage Sandbox'
    }
  ];

  return (
    <>
      <Card hoverable onClick={onClick} className="h-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Typography.Title level={5} className="font-bold">
              {sandbox.name}
            </Typography.Title>
            <div className="flex items-center gap-2">
              <Tooltip
                title={
                  <div className="flex flex-col items-center gap-1">
                    <Avatar src={sandbox.createdBy.avatar} size="default">
                      {sandbox.createdBy.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Text strong>{sandbox.createdBy.username}</Text>
                  </div>
                }
                placement="left"
              >
                <Avatar src={sandbox.createdBy.avatar} size="default">
                  {sandbox.createdBy.username.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
              {isOwnProfile && (
                <Dropdown
                  menu={{ items: menuItems, onClick: handleMenuClick }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
              )}
            </div>
          </div>

          <Text className="text-gray-500" type="secondary" ellipsis>
            {sandbox.description}
          </Text>

          <Space wrap>
            {sandbox.language.map((lang) => (
              <Tag key={lang} color="blue">
                {lang.toUpperCase()}
              </Tag>
            ))}
          </Space>

          <div className="flex items-center justify-between">
            <div className="mt-2 flex items-center gap-4 text-gray-500">
              <Space>
                <TeamOutlined />
                <Text type="secondary">{sandbox.members.length} contributors</Text>
              </Space>
            </div>
            <Text type="secondary" className="text-md">
              {timeAgo(sandbox.createdAt)}
            </Text>
          </div>

          <div className="flex items-center justify-between">
            <Text type="secondary" className="text-md">
              Last updated: {timeAgo(sandbox.updatedAt)}
            </Text>
            {sandbox.isPublic ? (
              <Unlock size={20} className="text-success-color" />
            ) : (
              <Lock size={20} className="text-danger-color" />
            )}
          </div>
        </div>
      </Card>

      <ManageSandboxModal
        open={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        sandbox={sandbox}
        mutate={mutate || (() => {})}
      />
    </>
  );
};

export default CodeSandboxCard;
