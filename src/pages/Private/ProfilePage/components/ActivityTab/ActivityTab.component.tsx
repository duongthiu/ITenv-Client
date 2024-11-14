import React from 'react';
import ContributionGrid from '../Contribute/Contribute.component';
import { Tabs } from 'antd';
import { PostType } from '../../../../../types/PostType';
type ProfileFriendTabProps = {
  userId: string;
};
const ActivityTab: React.FC<ProfileFriendTabProps> = ({ userId }) => {
  const contributions = [
    new Date(2024, 0, 15),
    new Date(2024, 6, 10), // 10th Jul, 2024
    new Date(2024, 10, 30) // 30th Nov, 2024
  ];
  const TabItems = [
    {
      key: 'contributions-discuss',
      label: `Discuss`,
      children: <ContributionGrid contributions={contributions} />
    },
    {
      key: 'contributions-problems',
      label: `Problems`,
      children: 'TabProblems'
    }
  ];
  return (
    <div>
      <div className="card">
        <h3 className="mb-5 text-[1.6rem] font-semibold">Activity</h3>
        <Tabs tabPosition="left" items={TabItems} />
      </div>
    </div>
  );
};

export default ActivityTab;
