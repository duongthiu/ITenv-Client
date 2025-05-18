import { Button, Image, Skeleton, Tabs } from 'antd';
import { useMemo } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoCodeSlashOutline } from 'react-icons/io5';
import { VscCommentDiscussion } from 'react-icons/vsc';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useAppSelector } from '../../../redux/app/hook';
import { paths } from '../../../routes/paths';
import { getUserById } from '../../../services/user/user.service';
import useFriendStatus from '../../../utils/hooks/useFriendStatus.hook';
import StatusButton from '../../Public/SearchPage/components/StatusButton';
import ActivityTab from './components/ActivityTab/ActivityTab.component';
import ListPost from './components/ListPost/ListPost.component';
import './components/ListPost/ListPost.style.scss';
import ListSubmission from './components/ListSubmissions/ListSubmission';
import ProfileFriendTab from './components/ProfileFriendTab/ProfileFriendTab.component';
import Sandbox from './components/Sandbox/Sandbox.component';

const ProfilePage = () => {
  const { user: userSelector } = useAppSelector((state) => state.user);
  const { userId } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = useMemo(() => userSelector?._id === userId, [userSelector?._id, userId]);
  const { data: userData, isLoading: isLoadingUser } = useSWR('profile' + userId, () => getUserById(userId!));
  const handleEditProfile = () => {
    navigate(paths.editProfile.replace(':tab', ''));
  };
  const status = useFriendStatus({
    friendWithMe: userData?.data?.friendWithMe,
    currentUserId: userSelector?._id || ''
  });

  const TabItems = [
    {
      key: '1',
      label: `Discuss`,
      children: <ListPost userId={userId || ''} />,
      icon: <VscCommentDiscussion size={20} />
    },
    {
      key: '2',
      label: `Problems`,
      children: <ListSubmission userId={userId || ''} />,
      icon: <IoCodeSlashOutline size={20} />
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto px-4">
        <div className="card overflow-hidden rounded-xl p-0 shadow-lg">
          <div
            style={{ background: 'linear-gradient(-150deg, #222222 15%, #373737 70%, #3c4859 94%)' }}
            className="h-72"
          ></div>
          <div className="relative px-2 py-4">
            <div className="md:flex-row flex items-center">
              {isLoadingUser ? (
                <div>
                  <Skeleton round />
                </div>
              ) : (
                <div className="w-full">
                  <div className="avatar-wrapper absolute -top-24 rounded-full">
                    <Image
                      loading="lazy"
                      className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-lg"
                      src={userData?.data?.avatar}
                    />
                  </div>
                  <div className="md:mt-0 md:ml-40 mt-16">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold">{userData?.data?.username}</h1>
                      {isOwnProfile && (
                        <Button
                          onClick={handleEditProfile}
                          className="ml-4 rounded-lg bg-primary-color px-4 py-2 text-sm text-white transition hover:bg-primary-color-hover"
                          aria-label="Edit profile"
                        >
                          <FaEdit className="mr-2 inline" /> Edit Profile
                        </Button>
                      )}
                      {!isOwnProfile && (
                        <div className="ml-4 rounded-lg">
                          <StatusButton
                            relationship={status}
                            userId={userData?.data?._id || ''}
                            relationshipId={userData?.data?.friendWithMe?._id || ''}
                          />
                        </div>
                      )}
                    </div>

                    {/* <p className="mt-1 text-gray-600">{profileData.title}</p>
                <p className="mt-2 text-gray-500">{profileData.location}</p> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex h-full">
          <div className="flex-none">
            <ProfileFriendTab userId={userId || ''} />
          </div>
          <div className="my-5 flex h-full flex-auto flex-col gap-5">
            <ActivityTab userId={userId || ''} />

            <div className="card tab-wraper h-full">
              <Tabs type="card" defaultActiveKey="1" items={TabItems} />
            </div>
            <Sandbox isOwnProfile={isOwnProfile} userId={userId || ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
