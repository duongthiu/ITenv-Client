import { Button, Divider, Drawer, Spin } from 'antd';
import { CiBoxList } from 'react-icons/ci';
import { FiUploadCloud } from 'react-icons/fi';
import { TbTriangle } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../assets/logo/logo.png';
import SettingsPopover from '../../../../components/commons/header/components/Settings/SettingsPopover.component';
import { useAppSelector } from '../../../../redux/app/hook';
import { paths } from '../../../../routes/paths';
import Timer from './Timmer.component';
import ProblemListDrawer from './ProblemListDrawer';
import { useState } from 'react';
type EditorHeaderProps = {
  handleSubmitCode: () => Promise<void>;
  isSubmitLoading: boolean;
  handleRunCode: () => Promise<void>;
  isRunLoading: boolean;
};
const HeaderComponent: React.FC<EditorHeaderProps> = ({
  handleSubmitCode,
  isSubmitLoading,
  handleRunCode,
  isRunLoading
}) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const toggleDrawer = () => {
    setDrawerVisible((prev) => !prev);
  };
  return (
    <div className="flex h-[60px] items-center justify-between px-5">
      <div className="flex items-center">
        <div onClick={() => navigate(paths.home)} className="flex cursor-pointer items-center gap-2">
          <img src={logo} className="h-[24px] w-[24px]" style={{ userSelect: 'none' }} alt="Logo" />
        </div>
        <Divider type="vertical" className="mx-4" />

        <Button onClick={toggleDrawer}>
          <CiBoxList size={20} />
          Problem List
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button size="large" className="text-primary-color" onClick={handleRunCode}>
          {isRunLoading ? <Spin /> : <TbTriangle className="rotate-90" size={18} />}
          Run
        </Button>
        <Button size="large" className="text-success-color" onClick={handleSubmitCode} disabled={isSubmitLoading}>
          {isSubmitLoading ? <Spin /> : <FiUploadCloud size={20} />}
          Submit
        </Button>
        <Timer />
      </div>
      <div>
        {' '}
        {user.isLogged && user?.user?._id ? (
          <div className="flex items-center gap-3">
            <SettingsPopover />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button href="/signup" type="default">
              Signup
            </Button>
            <Button href="/login" type="primary">
              Login
            </Button>
          </div>
        )}
      </div>
      <Drawer
        size="large"
        title="Problem List"
        placement="left"
        // width={400}
        onClose={toggleDrawer}
        open={drawerVisible}
      >
        <ProblemListDrawer />
      </Drawer>
    </div>
  );
};

export default HeaderComponent;
