import React from 'react';
import { Card, Avatar, Tag, Space, Typography, Tooltip } from 'antd';
import { CodeSandboxType } from '../../../types/codesandbox.type';
import { TeamOutlined } from '@ant-design/icons';
import { Lock, Unlock } from 'lucide-react';
import { timeAgo } from '../../../utils/helpers/formatDate';

const { Text } = Typography;

interface CodeSandboxCardProps {
  sandbox: CodeSandboxType;
  onClick?: () => void;
}

const CodeSandboxCard: React.FC<CodeSandboxCardProps> = ({ sandbox, onClick }) => {
  return (
    <Card hoverable onClick={onClick} className="h-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Typography.Title level={5} className="font-bold">
            {sandbox.name}
          </Typography.Title>
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
            {timeAgo(sandbox.updatedAt)}
          </Text>
        </div>

        <div className="flex items-center justify-end">
          {sandbox.isPublic ? (
            <Unlock size={20} className="text-success-color" />
          ) : (
            <Lock size={20} className="text-danger-color" />
          )}
        </div>
      </div>
    </Card>
  );
};

export default CodeSandboxCard;
