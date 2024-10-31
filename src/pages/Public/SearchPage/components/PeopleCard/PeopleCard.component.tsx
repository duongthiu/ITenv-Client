import React from 'react';
import { UserType } from '../../../../../types/UserType';
import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';

type PeopleCardProps = {
  user: UserType;
};

const PeopleCard: React.FC<PeopleCardProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div key={user._id} className="card h-fit overflow-hidden rounded-xl duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex space-x-4">
          <Avatar src={user?.avatar} size={36} />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="">
              <p className="flex items-center text-gray-500">
                {/* <span className="text-sm">{user.location}</span> */}
              </p>
              <p className="mt-1 text-gray-500">
                <span className="text-sm">{user?.friends?.length || 0} connections</span>
              </p>
            </div>
            <button className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600">
              Add friend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
