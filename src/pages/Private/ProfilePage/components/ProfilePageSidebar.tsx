import { CheckSquareFilled, EyeFilled, GithubOutlined, MessageFilled, StarFilled } from '@ant-design/icons';
import { Avatar, Button, Divider, Tag } from 'antd';
import React from 'react';
import { cn } from '../../../../utils/helpers/cn';

const ProfileSidebar: React.FC = () => {
  return (
    <div className={cn('card m-5 ml-0 flex h-fit flex-col rounded-2xl p-8 text-[1.4rem] shadow-xl duration-200')}>
      <div className="flex flex-col items-center">
        <Avatar size={64} icon={<GithubOutlined />} />
        <h2 className="mt-2 text-[1.6rem] font-semibold">tranduongthieu</h2>
        <p className="text-[1.2rem]">TranDuongThieu</p>
        <p className="text-[1.4rem] text-gray-400">Rank ~5,000,000</p>
        <Button type="primary" className="mt-4 w-full bg-green-700 hover:bg-green-600">
          Edit Profile
        </Button>
      </div>
      <Divider />
      {/* GitHub Link */}
      <div className="mt-6 flex items-center gap-x-5">
        <GithubOutlined size={30} className="text-[2rem]" />
        <span className="text-[1.4rem]">TranDuongThieu</span>
      </div>

      {/* Community Stats */}
      <div className="mt-4">
        <h3 className="text-[1.6rem] font-semibold">Community Stats</h3>
        <div className="mt-2">
          <StatItem icon={<EyeFilled className="text-[1.8rem] text-primary-color" />} label="Views" value="0" />
          <StatItem icon={<CheckSquareFilled className="text-[1.8rem] text-blue-600" />} label="Solution" value="0" />
          <StatItem icon={<MessageFilled className="text-[1.8rem] text-green-400" />} label="Discuss" value="0" />
          <StatItem icon={<StarFilled className="text-[1.8rem] text-yellow-500" />} label="Reputation" value="0" />
        </div>
      </div>

      {/* Languages */}
      <div className="mt-4">
        <h3 className="text-[1.6rem] font-semibold">Languages</h3>
        <div className="mt-2 flex justify-between">
          <Tag>C++</Tag>
          <span>1 problem solved</span>
        </div>
        <div className="mt-2 flex justify-between">
          <Tag>TypeScript</Tag>
          <span>1 problem solved</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4">
        <h3 className="text-[1.6rem] font-semibold">Skills</h3>
        <div className="mt-2">
          <SkillItem level="Advanced" data="Not enough data" />
          <SkillItem level="Intermediate" data="Hash Table" count={1} />
          <SkillItem level="Fundamental" data="Array, String" count={2} />
        </div>
      </div>
    </div>
  );
};

// Helper components
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value }) => (
  <div className="mt-2 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-right">
      <span>{value}</span>
      <p className="text-[1.1rem] text-gray-400">Last week 0</p>
    </div>
  </div>
);

interface SkillItemProps {
  level: string;
  data: string;
  count?: number;
}

const SkillItem: React.FC<SkillItemProps> = ({ level, data, count }) => (
  <div className="mt-2">
    <div className="flex justify-between">
      <span>{level}</span>
      <span className="text-sm text-gray-400">{count ? `x${count}` : null}</span>
    </div>
    <div className="text-sm text-gray-400">{data}</div>
  </div>
);

export default ProfileSidebar;
