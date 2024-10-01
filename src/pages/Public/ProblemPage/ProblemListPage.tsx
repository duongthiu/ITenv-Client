import { Input, Pagination, PaginationProps, Skeleton, Typography } from 'antd';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import useSWR from 'swr';
import { getProblems } from '../../../services/problem/problem.service';
import { ProblemType } from '../../../types/ProblemType';
import { ResponsePagination } from '../../../types/common/response.type';
import ContentCard from './components/ProblemCard';

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

  if (error) {
    return (
      <div className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="sm:inline block"> {error.message}</span>
      </div>
    );
  }

  const allTags = Array.from(new Set(problemList?.data?.flatMap((item: any) => item.tags) || []));

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prevTags: any) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t: any) => t !== tag);
      }
      return [...prevTags, tag];
    });
  };

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
  const filteredContent = (problemList?.data || []).filter((item) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => item.tags.includes(tag));
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTags && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
  };
  return (
    <div className="flex h-full gap-5">
      <div className="mx-auto flex h-full flex-1 flex-col px-4 py-5 pb-0">
        <div className="card mb-8">
          <Typography.Title level={3} className="font-mono">
            Problem List
          </Typography.Title>
          <div className="">
            <h2 className="mb-4 font-semibold">Filter by Tags</h2>
            {isLoading ? (
              <Skeleton className="mb-4" active />
            ) : (
              <div className="mb-4 flex flex-wrap gap-2">
                {allTags.map((tag: string) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`rounded-full px-3 py-1 font-medium ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors duration-200`}
                    aria-pressed={selectedTags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={handleSearch}
                className="input flex-grow rounded-l-md border px-4 py-2 focus:outline-none focus:ring-2"
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
        </div>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <div className="overflow-y-auto">
            <div className="flex flex-col gap-4">
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
        <div className="card mt-5 flex h-[50px] w-full items-center justify-center">
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
      <div className="w-[200px]">123</div>
    </div>
  );
};

export default ProblemListPage;
