import { Button, Popover } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SettingsComponent from './Settings.component';

const SettingsPopover = () => {
  const { user, isLogged } = useSelector((state: any) => state.user);
  const [settingsVisible, setSettingsVisible] = useState(false);
  if (!isLogged)
    return (
      <Button href="/login" type="primary">
        Login
      </Button>
    );
  return (
    <Popover
      placement="bottomRight"
      content={<SettingsComponent />}
      trigger="click"
      arrow={false}
      className="popover-notification cursor-pointer"
      overlayClassName="max-w-[45rem] max-h-[40rem] p-0"
      autoAdjustOverflow={false}
      open={settingsVisible}
      onOpenChange={(visible) => setSettingsVisible(visible)}
    >
      <img src={user?.avatar} alt="" className="h-[32px] w-[32px] rounded-full object-cover" />
    </Popover>
  );
};

export default SettingsPopover;
