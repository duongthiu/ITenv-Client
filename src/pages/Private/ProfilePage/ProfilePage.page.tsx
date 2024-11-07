import { Button, Image, Skeleton } from 'antd';
import { useMemo, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useAppSelector } from '../../../redux/app/hook';
import ProfileFriendTab from './components/ProfileFriendTab/ProfileFriendTab.component';
import ProfilePageSidebar from './components/ProfilePageSidebar';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getUserById } from '../../../services/user/user.service';
import ActivityTab from './components/ActivityTab/ActivityTab.component';
import useFriendStatus from '../../../utils/hooks/useFriendStatus.hook';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user: userSelector } = useAppSelector((state) => state.user);

  const { userId } = useParams();
  const isOwnProfile = useMemo(() => userSelector?._id === userId, [userSelector?._id, userId]);
  const { data: userData, isLoading: isLoadingUser } = useSWR('profile' + userId, () => getUserById(userId!));
  console.log(userId);
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };
  const status = useFriendStatus({ friendWithMe: userData?.data?.friendWithMe, userId: userSelector?._id || '' });
  console.log(status);
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto px-4">
        <div className="card overflow-hidden rounded-xl p-0 shadow-lg">
          <div
            style={{ background: 'linear-gradient(-150deg, #222222 15%, #373737 70%, #3c4859 94%)' }}
            className="h-72"
          ></div>
          <div className="relative px-6 py-4">
            <div className="md:flex-row flex items-center">
              {isLoadingUser ? (
                <div>
                  <Skeleton round />
                </div>
              ) : (
                <div>
                  <div className="avatar-wrapper absolute -top-24 rounded-full">
                    <Image
                      className="h-40 w-40 rounded-full border-4 border-white shadow-lg"
                      src={userData?.data?.avatar}
                    />
                  </div>
                  <div className="md:mt-0 md:ml-40 mt-16 pr-20">
                    <div className="flex items-center justify-between">
                      <h1 className="text-[2.4rem] font-bold">{userData?.data?.username}</h1>
                      {isOwnProfile && (
                        <Button
                          onClick={handleEditProfile}
                          className="ml-4 rounded-lg bg-primary-color px-4 py-2 text-[1.2rem] text-white transition hover:bg-primary-color-hover"
                          aria-label="Edit profile"
                        >
                          <FaEdit className="mr-2 inline" /> Edit Profile
                        </Button>
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
        <div className="flex">
          <div className="">
            <ProfileFriendTab userId={userData?.data?._id || ''} />
          </div>
          <div className="flex-1">
            <ActivityTab userId={userData?.data?._id || ''} />
          </div>
          <div className="">
            <ProfilePageSidebar />
          </div>
        </div>
        {/* Right Column - Projects & Social */}
      </div>
    </div>
  );
};

export default ProfilePage;
