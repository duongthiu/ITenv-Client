import React from 'react';
import ProfilePageSidebar from './components/ProfilePageSidebar';
import ProfileInformation from './components/ProfileInformation';

const ProfilePagePage = () => {
  return (
    <div className="flex min-h-full gap-5">
      <ProfileInformation />
      <div className="flex-1">Content</div>
      <ProfilePageSidebar />
    </div>
  );
};

export default ProfilePagePage;
