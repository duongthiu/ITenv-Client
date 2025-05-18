import React, { useState } from 'react';
import { Row, Col, Typography, Button, Pagination, Empty, Input, Select, Space, Card, Skeleton } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { BsSortDown, BsSortUp } from 'react-icons/bs';
import useSWR from 'swr';
import { getCodeSandboxes } from '../../services/codesanbox/codesandbox.service';
import CodeSandboxCard from './components/CodeSandboxCard';
import CreateSandboxModal from './components/CreateSandboxModal';
import { CodeSandboxType, CodeSandboxLanguage } from '../../types/codesandbox.type';
import { QueryOptions } from '../../types/common';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../utils/hooks/useDebounce.hook';
import { useAppSelector } from '../../redux/app/hook';

const { Title } = Typography;

const CodeSandboxPage = () => {
  const { user: userSelector } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);
  const [queryOption, setQueryOption] = useState<QueryOptions>({
    page: 1,
    pageSize: 12,
    search: '',
    sortField: 'createdAt',
    sortOrder: 'DESC',
    language: ''
  });

  const { data, error, isLoading, mutate } = useSWR(`/api/codesandbox?${JSON.stringify(queryOption)}`, () =>
    getCodeSandboxes(queryOption)
  );

  React.useEffect(() => {
    setQueryOption((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleLanguageChange = (value: string) => {
    setQueryOption({ ...queryOption, language: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setQueryOption({ ...queryOption, sortOrder: value.toUpperCase() as 'DESC' | 'ASC', page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryOption({ ...queryOption, page, pageSize });
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Typography.Text type="danger">Error loading code sandboxes. Please try again later.</Typography.Text>
      </div>
    );
  }

  const sandboxes = data?.data || [];
  const total = data?.total || 0;

  const renderSkeletonCards = () => (
    <Row gutter={[24, 24]} className="mb-6">
      {[...Array(6)].map((_, index) => (
        <Col xs={24} sm={12} md={8} key={index}>
          <Card>
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div className="py-5">
      <Card className="card flex flex-col p-0">
        <div className="mb-6 flex items-center justify-between">
          <Title level={2} className="m-0">
            Code Sandboxes
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClick} className="flex items-center">
            Create New Project
          </Button>
        </div>

        <div className="mb-6">
          <Space direction="vertical" className="w-full" size="middle">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} lg={8}>
                <Input.Search
                  placeholder="Search sandboxes..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </Col>
              <Col xs={24} lg={16}>
                <Space wrap>
                  <Select
                    placeholder="Language"
                    allowClear
                    className="w-[200px]"
                    onChange={handleLanguageChange}
                    value={queryOption.language}
                  >
                    {Object.values(CodeSandboxLanguage).map((lang) => (
                      <Select.Option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()}
                      </Select.Option>
                    ))}
                  </Select>

                  <Button
                    icon={queryOption.sortOrder === 'ASC' ? <BsSortUp size={20} /> : <BsSortDown size={20} />}
                    onClick={() => handleSortChange(queryOption.sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                    title={queryOption.sortOrder === 'ASC' ? 'Oldest First' : 'Newest First'}
                  ></Button>
                </Space>
              </Col>
            </Row>
          </Space>
        </div>

        {isLoading ? (
          renderSkeletonCards()
        ) : sandboxes.length === 0 ? (
          <Empty
            description={
              <span className="text-gray-500">
                {queryOption.search ? 'No sandboxes match your search' : 'No code sandboxes found'}
              </span>
            }
            className="mt-8"
          />
        ) : (
          <>
            <Row gutter={[24, 24]} className="mb-6">
              {sandboxes.map((sandbox: CodeSandboxType) => (
                <Col xs={24} sm={12} md={8} key={sandbox._id}>
                  <CodeSandboxCard
                    isOwnProfile={userSelector?._id === sandbox?.createdBy?._id}
                    sandbox={sandbox}
                    onClick={() => navigate(`/code-sandbox/${sandbox._id}`)}
                  />
                </Col>
              ))}
            </Row>

            {total > (queryOption.pageSize || 12) && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  current={queryOption.page}
                  total={total}
                  pageSize={queryOption.pageSize || 12}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}

        <CreateSandboxModal open={isCreateModalOpen} onClose={handleCreateModalClose} mutate={mutate} />
      </Card>
    </div>
  );
};

export default CodeSandboxPage;
