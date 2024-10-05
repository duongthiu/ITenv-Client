import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';

const NotAuthPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you don't have permission to access this page."
      extra={
        <Button className="mx-auto" type="primary" onClick={() => navigate(paths.login)}>
          Login
        </Button>
      }
    />
  );
};

export default NotAuthPage;
