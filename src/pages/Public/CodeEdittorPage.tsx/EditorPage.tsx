import useSWR from 'swr';
import CodeEditor from '../../../components/CodeEditor/CodeEditor';
import { ProblemType } from '../../../types/ProblemType';
import { cn } from '../../../utils/helpers/cn';
import HeaderComponent from './components/Header.component';
import { getSingleProblem } from '../../../services/problem/problem.service';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
const EditorPage = () => {
  const { slug } = useParams();
  const { data: singleProblem, isLoading, error } = useSWR('/api/problem/', () => getSingleProblem(slug || ''));
  
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
