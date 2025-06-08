import { Button, Result } from 'antd';

const DevelopingPage = () => {
  return (
    <Result
      title="Your operation has been executed"
      extra={
        <Button type="primary" key="console">
          Go Console
        </Button>
      }
    />
  );
};

export default DevelopingPage;
