import React from 'react';
import ContributionGrid from '../Contribute/Contribute.component';
import { Tabs } from 'antd';
import { PostType } from '../../../../../types/PostType';
import useSWR from 'swr';
import { getProblemActivities } from '../../../../../services/problem/problem.service';
import { getPostActivities } from '../../../../../services/post/post.service';
type ProfileFriendTabProps = {
  userId: string;
};
const ActivityTab: React.FC<ProfileFriendTabProps> = ({ userId }) => {
  const { data: problemActivities } = useSWR('problemActivities', () => getProblemActivities(userId, { year: 2024 }));
  const { data: postActivities } = useSWR('postActivities', () => getPostActivities(userId, { year: 2024 }));
  const problemContributions = problemActivities?.data?.map((item: PostType) => new Date(item.createdAt));
  const postContributions = postActivities?.data?.map((item: PostType) => new Date(item.createdAt));

  const TabItems = [
    {
      key: 'contributions-discuss',
      label: `Discuss`,
      children: <ContributionGrid contributions={postContributions || []} />
    },
    {
      key: 'contributions-problems',
      label: `Problems`,
      children: <ContributionGrid contributions={problemContributions || []} />
    }
  ];
  return (
    <div>
      <div className="card">
        <h3 className="mb-5 text-base font-semibold">Activity</h3>
        <Tabs tabPosition="left" items={TabItems} />
      </div>
    </div>
  );
};

export default ActivityTab;
