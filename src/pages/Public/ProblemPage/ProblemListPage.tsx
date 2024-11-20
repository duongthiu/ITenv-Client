import { Divider, Input, Pagination, PaginationProps, Select, Skeleton, Typography } from 'antd';
import { SearchProps } from 'antd/es/input';
import { useState } from 'react';
import useSWR from 'swr';
import TagMenu from '../../../components/post/TagMenu/TagMenu.component';
import { getProblems } from '../../../services/problem/problem.service';
import { ProblemType } from '../../../types/ProblemType';
import { ResponsePagination } from '../../../types/common/response.type';
import ContentCard from './components/ProblemCard';

const ProblemListPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [difficulty, setDifficulty] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [queryOption, setQueryOption] = useState({ page: 1, pageSize: 10, search: '' });
  const {
    data: problemList,
    error,
    isLoading
  } = useSWR<ResponsePagination<ProblemType[]>>(`/api/problem?${JSON.stringify(queryOption)}`, () =>
    getProblems(queryOption)
  );
  if (error) {
    return (
      <div className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="sm:inline block"> {error.message}</span>
      </div>
    );
  }

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setQueryOption({ ...queryOption, pageSize });
  };
  const onPaginationChange = (page: number, pageSize: number) => {
    setQueryOption({ ...queryOption, page, pageSize });
  };

  // const filteredContent = (problemList?.data || []).filter((item) => {
  //   const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => item.tags.includes(tag));
  //   const matchesSearch =
  //     item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.content.toLowerCase().includes(searchTerm.toLowerCase());
  //   return matchesTags && matchesSearch;
  // });

  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' }
  ];

  const statusOptions = [
    { label: 'Solved', value: 'solved' },
    { label: 'Unsolved', value: 'unsolved' },
    { label: 'Attempted', value: 'attempted' }
  ];

  const clearFilters = () => {
    setSelectedTags([]);
  };
  const onSearch: SearchProps['onSearch'] = (value) => setQueryOption({ ...queryOption, search: value });
  return (
    <div className="flex h-full gap-5 py-5">
      <div className="flex h-full flex-1 flex-col px-4 pb-0">
        {/* <div className="card mb-8">
         
        </div> */}
        {isLoading ? (
          <Skeleton active />
        ) : (
          <div>
            <div className="card flex flex-col gap-4">
              <Typography.Title level={3} className="font-mono">
                Problem List
              </Typography.Title>
              <div className="">
                {/* <h2 className="mb-4 text-[1.4rem] font-semibold">Solve problems here</h2> */}

                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-3">
                    <Select
                      placeholder="Select Difficulty"
                      className="w-[150px]"
                      options={difficultyOptions}
                      value={difficulty}
                      onChange={(value) => setDifficulty(value)}
                      allowClear
                    />
                    <Select
                      placeholder="Select Status"
                      className="w-[150px]"
                      options={statusOptions}
                      value={status}
                      onChange={(value) => setStatus(value)}
                      allowClear
                    />
                  </div>

                  <Input.Search
                    placeholder="Search problems"
                    allowClear
                    onSearch={onSearch}
                    className="input max-w-[300px] rounded-xl px-4 py-2 focus:outline-none focus:ring-2"
                  />

                  {/* {(selectedTags.length > 0 || searchTerm) && (
                    <button
                      onClick={clearFilters}
                      className="rounded-r-md bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Clear filters"
                    >
                      <FaTimes />
                    </button>
                  )} */}
                </div>
              </div>
              <Divider />
              {problemList?.data?.length === 0 ? (
                <p className="sub-title text-[1.4rem]">
                  No content matches your current filters. Try adjusting your search or selected tags.
                </p>
              ) : (
                problemList?.data?.map((problem: ProblemType) => (
                  <ContentCard
                    key={problem.slug}
                    title={problem.title}
                    content={problem.content}
                    tags={problem.tags}
                    votes={problem?.vote ?? 0}
                    slug={problem?.slug}
                    // saved={problem?.saved ?? false}
                    difficulty={problem.level}
                    acceptance={problem.acceptance?.length || 0}
                  />
                ))
              )}
            </div>
          </div>
        )}
        <div className="card my-5 flex h-[50px] w-full items-center justify-center">
          <Pagination
            current={queryOption?.page}
            total={problemList?.total || 0}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            pageSize={queryOption?.pageSize}
            onChange={onPaginationChange}
          />
        </div>
      </div>
      <div className="card h-[500px] max-w-[300px] px-[10px]">
        <TagMenu selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      </div>
    </div>
  );
};

export default ProblemListPage;
