import { Avatar } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/app/hook';
import { UserType } from '../../../../../types/UserType';
import useFriendStatus from '../../../../../utils/hooks/useFriendStatus.hook';
import StatusButton from '../StatusButton';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import { paths } from '../../../../../routes/paths';

type PersonCardProps = {
  user: UserType;
};

const PersonCard: React.FC<PersonCardProps> = ({ user }) => {
  console.log(user);
  const navigate = useNavigate();
  const { user: userSelector } = useAppSelector((state) => state.user);

  const relationship = useFriendStatus({ friendWithMe: user?.friendWithMe, userId: userSelector?._id || '' });

  return (
    <div
      key={user._id}
      className="card h-full cursor-pointer overflow-hidden rounded-xl duration-300 hover:shadow-lg"
      onClick={() => navigate(paths.profile.replace(':userId', user._id))}
    >
      <div className="flex flex-col gap-5 pb-6">
        <div className="bg-thumbnail relative h-[100px] w-full rounded-lg">
          <div className="absolute bottom-[-20px] left-[50%] translate-x-[-50%]">
            <Avatar src={user?.avatar} size={64} />
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <div className="flex w-full flex-col justify-between gap-1">
            <h3 className="text-center text-[1.6rem] font-semibold">{user.username}</h3>
            <p className="text-center text-gray-600">{user.email}</p>
            <p className="text-center">Active {timeAgo(user.createdAt!)}</p>
            <div className="">
              <p className="flex items-center text-gray-500"></p>
              <p className="mt-1 text-gray-500">
                <span className="text-center text-[1.2rem]">{user?.friends?.length || 0} connections</span>
              </p>
            </div>
            <StatusButton relationship={relationship} user={user} relationshipId={user.friendWithMe?._id || ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;