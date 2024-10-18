import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';
import { setCloseModal } from '../../../redux/app/app.slice';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook';

interface CustomModalProps {
  status: 'success' | 'error' | 'warning';
  title: string;
  description?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({ status, title, description }) => {
  const dispatch = useAppDispatch();
  const { modal } = useAppSelector((state) => state.app);

  const handleOk = () => {
    dispatch(setCloseModal());
  };

  const handleCancel = () => {
    dispatch(setCloseModal());
  };

  // Define icon and color based on the status
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '5rem' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '5rem' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '5rem' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return '';
    }
  };

  return (
    <Modal
      title={null}
      open={modal.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <Button key="ok" type="primary" onClick={handleOk}>
          OK
        </Button>
      }
      className="rounded-lg"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center p-4 text-center"
      >
        <div className={`mb-4 ${getStatusColor()}`}>{getStatusIcon()}</div>
        <h2 className="text-[2rem] font-semibold">{title}</h2>
        <p className="subtitle mt-2">{description}</p>
      </motion.div>
    </Modal>
  );
};

export default CustomModal;
