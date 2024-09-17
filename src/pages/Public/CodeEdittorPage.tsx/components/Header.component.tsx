import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../assets/logo/logo.png';
import { paths } from '../../../../routes/paths';
const HeaderComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-[40px] items-center px-5">
      <div onClick={() => navigate(paths.home)} className="flex cursor-pointer items-center gap-2">
        <img src={logo} className="h-[24px] w-[24px]" style={{ userSelect: 'none' }} alt="Logo" />
        {/* <h6 className="font-mono text-[2.2rem] font-extrabold" style={{ userSelect: 'none' }}>
            ITenv
          </h6> */}
      </div>
    </div>
  );
};

export default HeaderComponent;
