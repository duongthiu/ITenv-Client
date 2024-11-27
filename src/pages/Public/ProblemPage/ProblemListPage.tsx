import { Divider, Empty, Input, Pagination, PaginationProps, Select, Skeleton, Typography } from 'antd';
import { SearchProps } from 'antd/es/input';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import TagMenu from '../../../components/post/TagMenu/TagMenu.component';
import { getProblems } from '../../../services/problem/problem.service';
import { ProblemType } from '../../../types/ProblemType';
import { ResponsePagination } from '../../../types/common/response.type';
import ContentCard from './components/ProblemCard';
import { motion } from 'framer-motion';
import banner1 from '../../../assets/problem_banner/banner1.jpg';
import banner2 from '../../../assets/problem_banner/banner2.jpg';
import banner3 from '../../../assets/problem_banner/banner3.jpg';
import { QueryOptions } from '../../../types/common';
const ProblemListPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  console.log(selectedTags);
  const [difficulty, setDifficulty] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [queryOption, setQueryOption] = useState<QueryOptions>({ page: 1, pageSize: 10, search: '' });
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
  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  const clearFilters = () => {
    setSelectedTags([]);
  };
  const onSearch: SearchProps['onSearch'] = (value) => setQueryOption({ ...queryOption, search: value });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setQueryOption({ ...queryOption, tags: [...selectedTags] });
  }, [selectedTags]);

  return (
    <div className="flex h-full gap-5 py-5">
      <div className="flex h-full flex-1 flex-col px-4 pb-0">
        {/* <div className="card mb-8">
         
        </div> */}

        <div>
          <div className="card flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-10">
              <div className="group relative h-full cursor-pointer">
                <img src={banner1} className="h-full rounded-xl object-cover" />
                <div className="absolute left-0 top-0 rounded-xl bg-black bg-opacity-50 opacity-0 duration-500 group-hover:bottom-0 group-hover:right-0 group-hover:opacity-100"></div>
              </div>
              <div className="group relative h-full cursor-pointer">
                <img src={banner2} className="h-full rounded-xl object-cover" />
                <div className="absolute left-0 top-0 rounded-xl bg-black bg-opacity-50 opacity-0 duration-500 group-hover:bottom-0 group-hover:right-0 group-hover:opacity-100"></div>
              </div>
              <div className="group relative h-full cursor-pointer">
                <div className="absolute left-0 top-0 rounded-xl bg-black bg-opacity-50 opacity-0 duration-500 group-hover:bottom-0 group-hover:right-0 group-hover:opacity-100"></div>
                <img src={banner3} className="h-full rounded-xl object-cover" />
              </div>
            </div>
            <Divider />

            <div className="mb-5">
              {/* <h2 className="mb-4 text-[1.4rem] font-semibold">Solve problems here</h2> */}

              <div className="flex items-center gap-10">
                {/* <div className="flex items-center gap-3">
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
                </div> */}

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
            {problemList?.data?.length === 0 ? (
              <Empty />
            ) : (
              <motion.div
                className="flex-1"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={animationVariants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {isLoading ? (
                  <Skeleton active />
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
              </motion.div>
            )}
          </div>
        </div>

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
