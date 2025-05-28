import React, { useState } from 'react';
import { Card, Avatar, Space, Typography, Tooltip, Dropdown, Button, MenuProps } from 'antd';
import { CodeSandboxType, CodeSandboxLanguage } from '../../../types/codesandbox.type';
import { TeamOutlined, MoreOutlined } from '@ant-design/icons';
import { Lock, Unlock } from 'lucide-react';
import { timeAgo } from '../../../utils/helpers/formatDate';
import { useNavigate } from 'react-router-dom';
import ManageSandboxModal from './ManageSandboxModal';

// Import language icons
import htmlIcon from '../../../assets/lang-icons/icons8-html5-48.png';
import jsIcon from '../../../assets/lang-icons/icons8-javascript-48.png';
import typescriptIcon from '../../../assets/lang-icons/icons8-typescript-48.png';
import pythonIcon from '../../../assets/lang-icons/icons8-python-48.png';
import javaIcon from '../../../assets/lang-icons/icons8-java-48.png';
import cppIcon from '../../../assets/lang-icons/icons8-cpp-64.png';
import cssIcon from '../../../assets/lang-icons/icons8-css-48.png';

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
            {sandbox.language.map((lang) => {
              const getIcon = () => {
                switch (lang) {
                  case CodeSandboxLanguage.HTML:
                    return htmlIcon;
                  case CodeSandboxLanguage.CSS:
                    return cssIcon;
                  case CodeSandboxLanguage.JAVASCRIPT:
                    return jsIcon;
                  case CodeSandboxLanguage.TYPESCRIPT:
                    return typescriptIcon;
                  case CodeSandboxLanguage.PYTHON:
                    return pythonIcon;
                  case CodeSandboxLanguage.JAVA:
                    return javaIcon;
                  case CodeSandboxLanguage.CPP:
                    return cppIcon;
                  default:
                    return jsIcon; // Default to JavaScript icon
                }
              };

              return (
                <Tooltip key={lang} title={lang}>
                  <img
                    src={getIcon()}
                    alt={lang}
                    className="h-8 w-8 cursor-pointer transition-transform hover:scale-110"
                  />
                </Tooltip>
              );
            })}
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
