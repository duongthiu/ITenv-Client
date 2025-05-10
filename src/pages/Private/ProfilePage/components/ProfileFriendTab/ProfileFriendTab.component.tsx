import { Divider, Empty, Skeleton, Tooltip } from 'antd';
import Link from 'antd/es/typography/Link';
import React, { memo, useState } from 'react';
import useSWR from 'swr';
import { UserType } from '../../../../../types/UserType';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../../routes/paths';
import ProfileSidebar from '../ProfilePageSidebar';
import { getFriendsByUserId } from '../../../../../services/friend/friend.service';
import { QueryOptions } from '../../../../../types/common';

type ProfileFriendTabProps = {
  userId: string;
};

type FriendUserType = Pick<UserType, '_id' | 'username' | 'avatar'>;

const ProfileFriendTab: React.FC<ProfileFriendTabProps> = memo(({ userId }) => {
  const [queryOptions] = useState<QueryOptions>({
    page: 1,
    pageSize: 10
  });
  const { data: friendData, isLoading } = useSWR(`getFriendsByUserId-${userId}`, () =>
    getFriendsByUserId(userId, queryOptions)
  );
  const navigate = useNavigate();
  const FriendBlock: React.FC<{ user: FriendUserType }> = ({ user }) => {
    return (
      <Tooltip title={user.username}>
        <div
          className="flex cursor-pointer flex-col items-center gap-3 overflow-x-hidden"
          onClick={() => navigate(paths.profile.replace(':userId', user._id))}
        >
          <img src={user.avatar} alt="avatar" className="aspect-square w-[70px] rounded-md object-cover" />
          <div className="w-[70px]">
            <p className="truncate text-center text-xs font-bold">{user.username}</p>
          </div>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="card m-5 ml-0">
      <div className="flex justify-between">
        <h3 className="text-base font-semibold">Friends</h3>
        <Link>See all</Link>
      </div>
      <p className="sub-title mb-[20px] mt-2 text-xs">
        {friendData?.total || 0} {friendData?.total === 1 ? 'friend' : 'friends'}
      </p>
      {friendData?.data?.length === 0 && <Empty />}
      {isLoading && (
        <div className="flex gap-5">
          {[1, 2, 3].map((_) => (
            <Skeleton.Image className="w-[70px]" active />
          ))}
        </div>
      )}
      <div className="grid grid-cols-3 gap-5">
        {friendData?.data?.slice(0, 9)?.map((friend) => {
          const friendUser = friend.receiver?._id === userId ? friend.sentBy : friend.receiver;
          return typeof friendUser === 'object' && friendUser !== null ? (
            <FriendBlock key={friendUser._id} user={friendUser} />
          ) : null;
        })}
      </div>
      <Divider />
      <ProfileSidebar />
    </div>
  );
});

export default ProfileFriendTab;
