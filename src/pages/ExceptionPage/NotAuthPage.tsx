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
        <div className="flex justify-center">
          <div className="flex w-fit items-center justify-center gap-5">
            <Button className="mx-auto w-fit" type="default" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button className="mx-auto w-fit" type="primary" onClick={() => navigate(paths.login)}>
              Login
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default NotAuthPage;
