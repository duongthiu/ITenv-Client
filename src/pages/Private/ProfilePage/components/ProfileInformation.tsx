import { GithubOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Menu } from 'antd';
import React from 'react';
import { cn } from '../../../../utils/helpers/cn';

const ProfileInformation: React.FC = () => {
  return (
    <div
      className={cn(
        'card m-5 mr-0 flex h-fit min-w-[250px] flex-col rounded-2xl p-8 text-[1.4rem] shadow-xl duration-200'
      )}
    >
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

      {/* Community Stats */}
      <div className="mt-4">
        <Menu />
      </div>
    </div>
  );
};

export default ProfileInformation;
