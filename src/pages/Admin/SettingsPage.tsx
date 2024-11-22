import { Button, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { BsCheck } from 'react-icons/bs';
import { CiCircleInfo, CiSettings } from 'react-icons/ci';
import { FaBell, FaCamera, FaRegBell, FaSpinner } from 'react-icons/fa';
import { IoClose, IoInformationCircleOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/CommonAdmin/Header';
import { useAppDispatch, useAppSelector } from '../../redux/app/hook';
import { setUser } from '../../redux/user/user.slice';
import { updateAvatar } from '../../services/user/user.service';
import { getBase64 } from '../../utils/helpers/getBase64';
import { notifyError, notifySuccess } from '../../utils/helpers/notify';
import BasicInfo from '../Private/EditProfilePage/components/BasicInfo.component';
import ChangePassword from '../Private/EditProfilePage/components/ChangePassword.component';
import AccountSettings from '../Private/EditProfilePage/components/EditAccount.component';
import './EditProfilePage.style.scss';
import Notifications from './Notifications';
import { FiSettings } from 'react-icons/fi';

// import ConnectedAccounts from '../../components/settingAdmin/ConnectedAccounts';
// import DangerZone from '../../components/settingAdmin/DangerZone';
// import Notifications from '../../components/settingAdmin/Notifications';
// import Profile from '../../components/settingAdmin/Profile';
// import Security from '../../components/settingAdmin/Security';

const SettingsPage = () => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((user) => user.user);
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState<{ src: string; file?: File }>({ src: user?.avatar || '' });
  const [isLoading, setsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(tab);
  const EditProfileSidebar = [
    {
      label: 'Basic Info',
      icon: <IoInformationCircleOutline size={20} />,
      href: '/admin/edit-profile/basic-info',
      key: 'basic-info'
    },
    {
      label: 'Account',
      icon: <FiSettings size={20} />,
      href: '/admin/edit-profile/account',
      key: 'account'
    },
    {
      label: 'Notifications',
      icon: <FaRegBell size={20} />,
      href: '/admin/edit-profile/notifications',
      key: 'notifications'
    },
    {
      label: 'Change Password',
      href: '/admin/edit-profile/change-password',
      key: 'change-password',
      icon: <RiLockPasswordLine size={20} />
    }
  ];
  const renderContent = () => {
    switch (tab) {
      case 'basic-info':
        return <BasicInfo />;
      case 'account':
        return <AccountSettings />;
      case 'change-password':
        return <ChangePassword />;
      case 'notifications':
        return <Notifications />;
      default:
        return <BasicInfo />;
    }
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        notifyError('Only image files are allowed');
        return;
      }
      const base64 = await getBase64(file);
      setAvatar({ file: file, src: base64 || '' });
    }
  };

  const handleIconClick = () => {
    if (!isLoading) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  useEffect(() => {
    if (tab === undefined || tab === ':tab') navigate('/admin/edit-profile/basic-info');
  }, [navigate, tab]);
  const handleUpdateAvatar = async () => {
    try {
      if (avatar.src !== user?.avatar) {
        setsLoading(true);
        const formData = new FormData();
        formData.append('image', avatar.file || '');
        const result = await updateAvatar(formData);
        if (result?.success) {
          setsLoading(false);
          dispatch(setUser({ ...user, avatar: result.data?.avatar }));
          setAvatar({ src: result.data?.avatar || '' });
          notifySuccess('Avatar updated successfully.');
        }
      }
    } catch (error) {
      setsLoading(false);
      notifyError('Error updating avatar');
    }
  };
  return (
    <div className="editprofile-wrapper relative flex h-full min-h-screen w-full flex-col">
      <Header title="Settings" />
      <div className="bg-gradient-editprofile flex-[0.5]"></div>
      <div className="flex-[0.5]">
        <div className="absolute left-1/2 top-[50%] mt-[20px] flex translate-x-[-50%] translate-y-[-50%] items-center gap-10 rounded-2xl bg-white bg-opacity-40 shadow-lg backdrop-blur-md">
          <div className="flex flex-col gap-1 p-5">
            <div className="mb-10 flex w-full flex-col items-center justify-center gap-5 text-center">
              <div className="group relative cursor-pointer rounded-lg border border-[5px] border-white shadow-lg">
                <img src={avatar.src} className="aspect-square w-[120px] object-cover shadow-lg" />
                <div
                  className={`absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black duration-300 group-hover:bg-opacity-50 ${isLoading ? 'bg-opacity-50' : 'bg-opacity-0'}`}
                  onClick={handleIconClick}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin text-white" size={30} />
                  ) : (
                    <FaCamera className="hidden text-white group-hover:block" size={30} />
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                </div>
              </div>
              {avatar.src !== user?.avatar && (
                <div className="flex w-full items-center justify-center gap-5">
                  <Tooltip title="Cancel">
                    <Button
                      onClick={() => setAvatar({ src: user?.avatar || '', file: undefined })}
                      type="default"
                      shape="circle"
                      icon={<IoClose />}
                    />
                  </Tooltip>
                  <Tooltip title="Accept">
                    <Button
                      onClick={handleUpdateAvatar}
                      type="primary"
                      disabled={avatar.src === user?.avatar}
                      shape="circle"
                      icon={<BsCheck />}
                    />
                  </Tooltip>
                </div>
              )}

              <p className="mt-2 text-[1.6rem] font-bold">{user?.username}</p>
            </div>
            {EditProfileSidebar.map((item) => (
              <div
                onClick={() => navigate(item.href)}
                key={item.key}
                className={`flex w-[250px] cursor-pointer items-center gap-3 rounded-lg px-6 py-3 text-[1.5rem] duration-300 ${tab !== item.key && 'hover:bg-blue-100 hover:text-black'} ${tab === item.key && 'bg-white text-black'}`}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
          <p className="card h-[500px] min-w-[500px] overflow-y-auto px-10 text-center">{renderContent()}</p>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
