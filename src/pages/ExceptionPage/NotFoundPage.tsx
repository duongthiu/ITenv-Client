import { Button, Result } from 'antd';

import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, we can't seem to find the page you're looking for."
      extra={
        <Button className="mx-auto" type="primary" onClick={() => navigate(paths.home)}>
          Back Home
        </Button>
      }
    />
  );
};

export default NotFoundPage;
