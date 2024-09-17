import EmojiPicker, { Theme } from 'emoji-picker-react';
import React, { useRef, useState } from 'react';
import { BsFillEmojiSmileFill } from 'react-icons/bs';
import './InputWithEmoji.style.scss';
type InputWithEmojiProps = {
  onEmojiClick: (emoji: any) => void;
};
const InputWithEmoji: React.FC<InputWithEmojiProps> = ({ onEmojiClick }) => {
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div ref={emojiPickerRef} className="emoji-wraper absolute bottom-0 translate-x-[-100%]">
        <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.LIGHT} open={isOpenEmoji}  />
      </div>
      <BsFillEmojiSmileFill
        onClick={() => setIsOpenEmoji((prev) => !prev)}
        className="cursor-pointer duration-200 hover:text-primary-color-hover"
        color="#21a1d3"
        size={25}
      />
    </div>
  );
};

export default InputWithEmoji;
