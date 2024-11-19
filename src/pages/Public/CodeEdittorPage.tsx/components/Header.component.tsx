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
};
const HeaderComponent: React.FC<EditorHeaderProps> = ({ handleSubmitCode, isSubmitLoading }) => {
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

        <button
          onClick={toggleDrawer}
          className="flex cursor-pointer items-center gap-4 rounded-lg px-5 py-3 text-[1.4rem] font-semibold duration-500 hover:bg-gray-200"
        >
          <CiBoxList size={20} />
          Problem List
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          className={`flex cursor-pointer items-center gap-4 rounded-lg bg-gray-200 px-5 py-2 text-[1.4rem] font-semibold opacity-70 duration-500 hover:bg-gray-300 hover:opacity-100 ${isSubmitLoading && 'disabled'}`}
        >
          <TbTriangle className="rotate-90" size={18} />
          Run
        </button>
        <button
          onClick={handleSubmitCode}
          disabled={isSubmitLoading}
          className="flex cursor-pointer items-center gap-4 rounded-lg bg-gray-200 px-5 py-2 text-[1.4rem] font-semibold text-green-500 opacity-70 duration-500 hover:bg-gray-300 hover:opacity-100"
        >
          {isSubmitLoading ? <Spin /> : <FiUploadCloud size={20} />}
          Submit
        </button>
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
