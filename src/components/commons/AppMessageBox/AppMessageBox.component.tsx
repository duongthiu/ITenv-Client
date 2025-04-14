import React from 'react';
import './AppMessageBox.style.scss';
type AppMessageBoxProps = {
  content: string;
  position: 'left' | 'right';
};
const AppMessageBox: React.FC<AppMessageBoxProps> = ({ content, position }) => {
  return (
    <div>
      {position === 'left' ? (
        <div className="bubble right">{content}</div>
      ) : (
        <div className="bubble left"> {content} </div>
      )}
    </div>
  );
};

export default AppMessageBox;
