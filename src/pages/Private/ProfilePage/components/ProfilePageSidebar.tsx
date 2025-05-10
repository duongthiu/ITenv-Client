import { CheckSquareFilled, EyeFilled, MessageFilled, StarFilled } from '@ant-design/icons';
import { Tag } from 'antd';
import React, { memo } from 'react';
import { cn } from '../../../../utils/helpers/cn';

const ProfileSidebar: React.FC = memo(() => {
  return (
    <div className={cn('mr-0 mt-5 flex h-fit flex-col text-sm duration-200')}>
      <div className="mt-4">
        <h3 className="text-base font-semibold">Community Stats</h3>
        <div className="mt-2">
          <StatItem icon={<EyeFilled className="text-lg text-primary-color" />} label="Views" value="0" />
          <StatItem icon={<CheckSquareFilled className="text-lg text-blue-600" />} label="Solution" value="0" />
          <StatItem icon={<MessageFilled className="text-lg text-green-400" />} label="Discuss" value="0" />
          <StatItem icon={<StarFilled className="text-lg text-yellow-500" />} label="Reputation" value="0" />
        </div>
      </div>

      {/* Languages */}
      <div className="mt-4">
        <h3 className="text-base font-semibold">Languages</h3>
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
        <h3 className="text-base font-semibold">Skills</h3>
        <div className="mt-2">
          <SkillItem level="Advanced" data="Not enough data" />
          <SkillItem level="Intermediate" data="Hash Table" count={1} />
          <SkillItem level="Fundamental" data="Array, String" count={2} />
        </div>
      </div>
    </div>
  );
});

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
      <p className="text-xs text-gray-400">Last week 0</p>
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
