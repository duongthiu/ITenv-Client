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
    <div className="flex cursor-pointer items-center gap-4 rounded-lg bg-gray-200 px-5 py-2 text-sm font-semibold opacity-70 duration-500 hover:bg-gray-300 hover:opacity-100">
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
            <button onClick={() => setIsRunning(false)} className="rounded-full text-black duration-300">
              <FaRegPauseCircle size={20} />
            </button>
          ) : (
            <button onClick={() => setIsRunning(true)} className="rounded-full text-black duration-300">
              <FaRegPlayCircle size={20} />
            </button>
          )}
        </motion.div>
        <div className="text-sm font-semibold">{formatTime(time)}</div>
        <button
          onClick={() => {
            setTime(0);
            setIsRunning(false);
          }}
          className="flex items-center rounded-full rounded-md text-sm text-black duration-300"
        >
          <GrPowerReset size={18} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
