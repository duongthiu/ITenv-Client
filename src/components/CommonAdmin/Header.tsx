const Header = ({ title }: any) => {
  return (
    <header className="box py-[10px] shadow-md">
      <div className="sm:px-6 lg:px-8 mx-auto px-4 py-4">
        <h1 className="text-[1.6rem] font-semibold">{title}</h1>
      </div>
    </header>
  );
};
export default Header;
