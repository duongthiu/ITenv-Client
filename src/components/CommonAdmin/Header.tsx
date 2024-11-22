import DarkMode from '../commons/header/components/Settings/DarkmodeToggle/DarkMode';

const Header = ({ title }: any) => {
  return (
    <header className="box py-[10px] shadow-md">
      <div className="sm:px-6 lg:px-8 mx-auto flex justify-between px-4 py-4">
        <h1 className="text-[1.6rem] font-semibold">{title}</h1>
        <div className="flex items-center gap-5 px-2 py-3">
          <DarkMode />
        </div>
      </div>
    </header>
  );
};
export default Header;
