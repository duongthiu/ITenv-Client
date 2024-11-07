import { Empty, Skeleton, Tooltip } from 'antd';
import Link from 'antd/es/typography/Link';
import React from 'react';
import useSWR from 'swr';
import { getFriendsByUserId } from '../../../../../services/user/user.service';
import { UserType } from '../../../../../types/UserType';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../../routes/paths';

type ProfileFriendTabProps = {
  userId: string;
};

type FriendUserType = Pick<UserType, '_id' | 'username' | 'avatar'>;

const ProfileFriendTab: React.FC<ProfileFriendTabProps> = ({ userId }) => {
  const { data: friendData, isLoading } = useSWR(`getFriendsByUserId-${userId}`, () => getFriendsByUserId(userId));
  const navigate = useNavigate();
  const FriendBlock: React.FC<{ user: FriendUserType }> = ({ user }) => {
    return (
      <Tooltip title={user.username}>
        <div
          className="flex cursor-pointer flex-col items-center gap-3 overflow-x-hidden"
          onClick={() => navigate(paths.profile.replace(':userId', user._id))}
        >
          <img src={user.avatar} alt="avatar" className="aspect-square w-[100px] rounded-md" />
          <p className="truncate text-center text-[1.2rem] font-bold">{user.username}</p>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="card m-5 ml-0">
      <div className="flex justify-between">
        <h3 className="text-[1.6rem] font-semibold">Friends</h3>
        <Link>See all</Link>
      </div>
      <p className="sub-title mb-[20px] mt-2 text-[1.2rem]">
        {friendData?.total || 0} {friendData?.total === 1 ? 'friend' : 'friends'}
      </p>
      {friendData?.data?.length === 0 && <Empty />}
      {isLoading && <Skeleton active />}
      <div className="grid grid-cols-3 gap-5">
        {friendData?.data?.map((friend) => {
          const friendUser = friend.receiver?._id === userId ? friend.sendBy : friend.receiver;
          return typeof friendUser === 'object' && friendUser !== null ? (
            <FriendBlock key={friendUser._id} user={friendUser} />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default ProfileFriendTab;
