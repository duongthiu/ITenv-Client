import { Skeleton } from 'antd';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import CodeEditor from '../../../components/CodeEditor/CodeEditor';
import { getSingleProblem } from '../../../services/problem/problem.service';
import { cn } from '../../../utils/helpers/cn';
import HeaderComponent from './components/Header.component';
const EditorPage = () => {
  const { slug } = useParams();
  const { data: singleProblem, isLoading } = useSWR('/api/problem/', () => getSingleProblem(slug || ''));

  return (
    <div className={cn('')}>
      <HeaderComponent />
      <div className="h-full w-full p-3">
        {isLoading ? <Skeleton active /> : singleProblem?.data ? <CodeEditor problem={singleProblem?.data} /> : null}
      </div>
    </div>
  );
};

export default EditorPage;
