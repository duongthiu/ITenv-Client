import { Divider, Input, Pagination, PaginationProps, Select, Skeleton, Typography } from 'antd';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import useSWR from 'swr';
import { getProblems } from '../../../services/problem/problem.service';
import { ProblemType } from '../../../types/ProblemType';
import { ResponsePagination } from '../../../types/common/response.type';
import ContentCard from './components/ProblemCard';
import { TagType } from '../../../types/TagType';
import TagMenu from '../../../components/post/TagMenu/TagMenu.component';

const ProblemListPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    data: problemList,
    error,
    isLoading
  } = useSWR<ResponsePagination<ProblemType[]>>(`/api/problem?page=${currentPage}&limit=${pageSize}`, () =>
    getProblems(`page=${currentPage}&limit=${pageSize}`)
  );
  console.log(problemList);
  if (error) {
    return (
      <div className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="sm:inline block"> {error.message}</span>
      </div>
    );
  }

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    console.log(current, pageSize);
    setCurrentPage(current);
    setPageSize(pageSize);
  };
  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page); // Update current page
    setPageSize(pageSize); // Optionally update page size if needed
  };
  // const filteredContent = (problemList?.data || []).filter((item) => {
  //   const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => item.tags.includes(tag));
  //   const matchesSearch =
  //     item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.content.toLowerCase().includes(searchTerm.toLowerCase());
  //   return matchesTags && matchesSearch;
  // });

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
  };
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

                <div className="flex items-center gap-5">
                  <Select options={[{ value: 'sample', label: <span>sample</span> }]} />
                  <Input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="input rounded-l-md border px-4 py-2 focus:outline-none focus:ring-2"
                    aria-label="Search content"
                  />
                  {(selectedTags.length > 0 || searchTerm) && (
                    <button
                      onClick={clearFilters}
                      className="rounded-r-md bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Clear filters"
                    >
                      <FaTimes />
                    </button>
                  )}
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
            current={currentPage}
            total={problemList?.total || 0}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            pageSize={pageSize}
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
