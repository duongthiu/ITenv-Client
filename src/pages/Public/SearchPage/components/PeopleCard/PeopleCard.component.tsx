import React from 'react';
import { UserType } from '../../../../../types/UserType';
import { Avatar, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/app/hook';
import { createFriendRequest } from '../../../../../services/user/user.service';
import { notifyError, notifySuccess } from '../../../../../utils/helpers/notify';

type PeopleCardProps = {
  user: UserType;
};

const PeopleCard: React.FC<PeopleCardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { user: userSelector } = useAppSelector((state) => state.user);
  console.log(user);
  function timeAgo(date: string | Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }

  const handleAddFriend = async () => {
    if (user?._id) {
      const res = await createFriendRequest({ receiver: user._id });
      if (res.success) {
        notifySuccess('Friend request sent successfully');
      } else notifyError('Failed to send friend request');
    }
  };
  return (
    <div key={user._id} className="card h-fit overflow-hidden rounded-xl duration-300 hover:shadow-lg">
      <div className="flex flex-col gap-5 pb-6">
        <div className="bg-thumbnail relative h-[100px] w-full rounded-lg">
          <div className="absolute bottom-[-20px] left-[50%] translate-x-[-50%]">
            <Avatar src={user?.avatar} size={64} />
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <div className="flex w-full flex-col gap-1">
            <h3 className="text-center text-[1.6rem] font-semibold">{user.username}</h3>
            <p className="text-center text-gray-600">{user.email}</p>
            <p className="text-center">Active {timeAgo(user.createdAt!)}</p>
            <div className="">
              <p className="flex items-center text-gray-500"></p>
              <p className="mt-1 text-gray-500">
                <span className="text-center text-[1.2rem]">{user?.friends?.length || 0} connections</span>
              </p>
            </div>
            <div className="flex w-full gap-3">
              {userSelector?._id !== user?._id ? (
                <Button
                  onClick={handleAddFriend}
                  className="w-full rounded-full bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
                >
                  Add friend
                </Button>
              ) : (
                <Button className="w-full rounded-full" type="default">
                  Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
