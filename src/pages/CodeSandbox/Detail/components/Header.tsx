import { Typography } from 'antd';

const { Title } = Typography;

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => (
  <div className="flex flex-none items-center px-6 py-3 shadow-sm">
    <Title level={4} className="!mb-0 !mr-4">
      {name}
    </Title>
    {/* Add author, actions, etc. here */}
  </div>
);

export default Header;
