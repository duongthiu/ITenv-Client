import { User } from 'lucide-react';
import SettingSection from './SettingSection';

const Profile = () => {
  return (
    <SettingSection icon={User} title={'Profile'}>
      <div className="sm:flex-row mb-6 flex flex-col items-center">
        <img
          src="https://res-console.cloudinary.com/dcti265mg/thumbnails/v1/image/upload/v1731606986/dXNlcnMvaW1ncy94M2RpdnJzZmhpZWpzZDhhcXF1aA==/drilldown"
          alt="Profile"
          className="mr-4 h-20 w-20 rounded-full object-cover"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-100">ITenv</h3>
          <p className="text-gray-400">ITenv@gmail.com</p>
        </div>
      </div>

      <button className="sm:w-auto w-full rounded bg-indigo-600 px-4 py-2 font-bold text-white transition duration-200 hover:bg-indigo-700">
        Edit Profile
      </button>
    </SettingSection>
  );
};
export default Profile;
