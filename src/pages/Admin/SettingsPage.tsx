import Header from '../../components/CommonAdmin/Header';
import ConnectedAccounts from '../../components/settingAdmin/ConnectedAccounts';
import DangerZone from '../../components/settingAdmin/DangerZone';
import Notifications from '../../components/settingAdmin/Notifications';
import Profile from '../../components/settingAdmin/Profile';
import Security from '../../components/settingAdmin/Security';

const SettingsPage = () => {
  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Settings" />
      <main className="lg:px-8 mx-auto grid max-w-4xl grid-cols-1 px-4 py-6">
        <Profile />
        <Notifications />
        <Security />
        <ConnectedAccounts />
        <DangerZone />
      </main>
    </div>
  );
};
export default SettingsPage;
