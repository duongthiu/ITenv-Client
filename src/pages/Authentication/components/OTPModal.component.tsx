import React, { useState, useRef, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
interface OTPModalProps {
  setIsShowOtp: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (otp: string) => void;
}
const OTPModal: React.FC<OTPModalProps> = ({ setIsShowOtp, onSubmit }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [activeInput, setActiveInput] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          setIsResendDisabled(false);
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
    } else {
      onSubmit(otpString);
      setIsShowOtp(false);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setCountdown(30);
    setIsResendDisabled(true);
    console.log('Resending OTP...');
  };

  useEffect(() => {
    inputRefs.current[activeInput]?.focus();
  }, [activeInput]);

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <div
        className="fixed bottom-0 left-0 right-0 top-0 bg-black opacity-50"
        onClick={() => {
          setIsShowOtp(false);
        }}
      ></div>
      <div className="z-50 w-96 max-w-full rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-2 text-center text-2xl font-bold">Enter OTP</h2>
        <p className="mb-6 text-center text-sm text-gray-600">An OTP has been sent to your email</p>
        <div className="mb-6 flex justify-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className={`h-12 w-12 rounded-md border-2 text-center text-xl ${
                error ? 'border-red-500' : 'border-gray-300'
              } ${
                index === activeInput ? 'border-blue-500 ring-2 ring-blue-300' : ''
              } transition-all duration-200 focus:border-blue-500 focus:outline-none`}
              type="text"
              maxLength={1}
              placeholder={index === activeInput ? '' : '-'}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setActiveInput(index)}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>
        {error && (
          <div className="mb-4 flex items-center text-red-500">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        <button
          className={`w-full rounded-md bg-blue-500 py-2 text-white ${
            otp.join('').length !== 6 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'
          }`}
          onClick={handleSubmit}
          disabled={otp.join('').length !== 6}
        >
          Submit
        </button>
        <div className="mt-4 flex items-center justify-between">
          <button
            className={`text-blue-500 ${isResendDisabled ? 'cursor-not-allowed opacity-50' : 'hover:text-blue-600'}`}
            onClick={handleResend}
            disabled={isResendDisabled}
          >
            Resend OTP
          </button>
          <span className="text-gray-500">{countdown > 0 ? `Resend in ${countdown}s` : 'You can resend now'}</span>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
