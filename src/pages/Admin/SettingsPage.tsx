import Header from "../../components/CommonAdmin/Header";
import ConnectedAccounts from "../../components/settingAdmin/ConnectedAccounts";
import DangerZone from "../../components/settingAdmin/DangerZone";
import Notifications from "../../components/settingAdmin/Notifications";
import Profile from "../../components/settingAdmin/Profile";
import Security from "../../components/settingAdmin/Security";


const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
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
