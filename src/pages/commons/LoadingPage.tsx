import { Spin } from 'antd';

const LoadingPage = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        position: 'fixed',
        zIndex: 10000,
        top: 0,
        left: 0
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default LoadingPage;
