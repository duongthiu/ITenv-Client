import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaRegPauseCircle, FaRegPlayCircle } from 'react-icons/fa';
import { GrPowerReset } from 'react-icons/gr';
const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup when isRunning changes or component unmounts
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Button type="dashed" size="large">
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center"
          key={isRunning ? 'pause' : 'play'} // Key helps Framer Motion recognize state changes
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isRunning ? (
            <Button size="small" icon={<FaRegPauseCircle size={18} />} onClick={() => setIsRunning(false)} />
          ) : (
            <Button size="small" icon={<FaRegPlayCircle size={18} />} onClick={() => setIsRunning(true)} />
          )}
        </motion.div>
        <div className="text-sm font-semibold">{formatTime(time)}</div>
        <Button
          size="small"
          onClick={() => {
            setTime(0);
            setIsRunning(false);
          }}
        >
          <GrPowerReset size={18} />
        </Button>
      </div>
    </Button>
  );
};

export default Timer;
