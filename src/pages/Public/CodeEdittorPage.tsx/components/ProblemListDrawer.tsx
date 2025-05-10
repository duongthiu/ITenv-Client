import { Input, List, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { getProblems } from '../../../../services/problem/problem.service';
import { ResponsePagination } from '../../../../types/common';
import { ProblemType } from '../../../../types/ProblemType';
import { useState } from 'react';
import { SearchProps } from 'antd/es/input';

const ProblemListDrawer = () => {
  const navigate = useNavigate();
  const [queryOptions, setQueryOptions] = useState({ page: 1, pageSize: 50, search: '' });

  const {
    data: problemList,
    error,
    isLoading
  } = useSWR<ResponsePagination<ProblemType[]>>(`/api/problem/?${JSON.stringify(queryOptions)}`, () =>
    getProblems(queryOptions)
  );
  const onSearch: SearchProps['onSearch'] = (value) => setQueryOptions({ ...queryOptions, search: value });
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  return (
    <div>
      {' '}
      {isLoading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div>Error loading problems.</div>
      ) : (
        <List
          header={
            <Input.Search
              placeholder="Search problems"
              allowClear
              onSearch={onSearch}
              className="input rounded-xl focus:outline-none focus:ring-2"
            />
          }
          itemLayout="horizontal"
          dataSource={problemList?.data || []}
          renderItem={(problem) => (
            <List.Item
              onClick={() => navigate(`/problems/${problem.slug}`)}
              className="group flex cursor-pointer items-center justify-between px-2 py-5 duration-500"
            >
              <div className="flex max-w-[70%] items-center gap-4 truncate">
                <span className="text-sm font-semibold group-hover:text-primary-color">{problem.title}</span>
                <div className="flex items-center gap-2">
                  {problem.tags?.slice(0, 3)?.map((tag, index) => (
                    <span key={index} className="tag rounded px-2.5 py-0.5 text-xs font-medium">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`text-xs ${getDifficultyColor(problem.level)}`}>{problem.level}</span>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ProblemListDrawer;
