import useSWR from 'swr';
import { getFriendRequests } from '../../../services/user/user.service';

const HomePage = () => {
  const { data } = useSWR('friendRequest', getFriendRequests);
  console.log(data);
  return <div>HomePage</div>;
};

export default HomePage;
