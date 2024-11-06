import { Badge, List } from 'antd';
import React from 'react';
import FriendRequest from './FriendRequest.component';
import { Typography } from 'antd';
import { ResponsePagination } from '../../../../../types/common';
import { FriendType } from '../../../../../types/FriendType';
type FriendsComponentProps = {
  friendRequestData: ResponsePagination<FriendType[]>;
};
const FriendsComponent: React.FC<FriendsComponentProps> = ({ friendRequestData }) => {
  return (
    <List
      header={
        <div className="flex gap-2 pb-0 text-[1.6rem] font-semibold">
          <div className="mb-5 flex gap-2 text-[1.6rem] font-semibold">
            <Typography.Title className="text-[1.6rem]">Friend Requests</Typography.Title>
            <Badge count={friendRequestData?.total} />
          </div>
        </div>
      }
      children={<FriendRequest />}
      footer={
        <div className="flex justify-center">
          <Typography.Link className="text-center">All notification</Typography.Link>
        </div>
      }
    />
  );
};

export default FriendsComponent;
