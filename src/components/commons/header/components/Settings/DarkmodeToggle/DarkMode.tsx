import { setTheme, THEME } from '../../../../../../redux/app/app.slice';
import { useAppDispatch, useAppSelector } from '../../../../../../redux/app/hook';
import './DarkMode.css';
import Moon from './Moon';
import Sun from './Sun';

const DarkMode = () => {
  const { theme } = useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();
  const toggleTheme = () => {
    dispatch(setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };
  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        checked={theme === THEME.DARK}
        onChange={toggleTheme}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <Sun />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
