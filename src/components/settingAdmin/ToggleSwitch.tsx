interface ToggleSwitchProps {
  label: string;
  isOn: boolean;
  onToggle: () => void; // Function that takes no arguments and returns nothing
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isOn, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-300">{label}</span>
      <button
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isOn ? 'bg-indigo-600' : 'bg-gray-600'} `}
        onClick={onToggle}
      >
        <span
          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'} `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
