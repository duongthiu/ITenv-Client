import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../../../components/CodeEditor/CodeEditor';
import { paths } from '../../../routes/paths';
import { cn } from '../../../utils/helpers/cn';
import HeaderComponent from './components/Header.component';

const EditorPage = () => {
  return (
    <div className={cn('')}>
      <HeaderComponent />
      <div className="h-full w-full p-3">
        <CodeEditor />
      </div>
    </div>
  );
};

export default EditorPage;
