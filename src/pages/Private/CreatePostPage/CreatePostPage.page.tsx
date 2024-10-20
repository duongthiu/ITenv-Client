import { CheckOutlined, CloseOutlined, TagOutlined } from '@ant-design/icons';
import { Badge, Button, Input, Popover, Switch, Tooltip, Typography } from 'antd';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { LuSplitSquareHorizontal } from 'react-icons/lu';
import useSWR from 'swr';
import PreviewTextEditorComponent from '../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import TextEditorComponent from '../../../components/TextEditor/TextEditor.component';
import { useAppDispatch } from '../../../redux/app/hook';
import { createPost, deleteImages } from '../../../services/post/post.service';
import { getTags } from '../../../services/tags/tag.service';
import { ImageType } from '../../../types/common';
import { TagType } from '../../../types/TagType';
import { cn } from '../../../utils/helpers/cn';
import { notifyError, notifySuccess } from '../../../utils/helpers/notify';
import { useDebounce } from '../../../utils/hooks/useDebounce.hook';
import LoadingPage from '../../commons/LoadingPage';
import './CreatePostPage.style.scss';
import { Tab } from './Tabs';
export interface Ingredient {
  label: string;
}

const initialTabs: Ingredient[] = [{ label: 'Text Editor' }, { label: 'Preview Text Editor' }];
const CreatePostPage = () => {
  const { data: tags, isLoading } = useSWR('/api/tag', () => getTags());
  const [loading, setLoading] = useState(isLoading);
  const [searchTags, setSearchTags] = useState('');
  const debounceSearchVariable = useDebounce(searchTags, 500);
  const [content, setContent] = useState('Write something');
  const [isAnonymous, setIsAnonymous] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditorChange = useCallback((content: any, editor: any) => {
    setContent(content);
  }, []);
  const contentDebounce = useDebounce(content, 300);
  const [title, setTitle] = useState('');
  const [tabs, setTabs] = useState(initialTabs);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [isSplit, setIsSplit] = useState(false);
  const [postImages, setPostImages] = useState<ImageType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prevTags: any) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t: any) => t !== tag);
      }
      return [...prevTags, tag];
    });
  };
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const TagMenu = () => (
    <div className="mb-4 flex max-w-[450px] flex-col">
      <Input
        placeholder="Search tags... "
        className="mb-4"
        value={searchTags}
        onChange={(e) => setSearchTags(e.target.value)}
      />
      <div className="flex max-h-[300px] flex-wrap gap-2 overflow-y-auto">
        {tags?.data
          ?.filter((tag) => tag.name.toLowerCase().includes(debounceSearchVariable.toLowerCase()))
          .map((tag: TagType) => (
            <button
              key={tag._id}
              onClick={() => handleTagToggle(tag._id)}
              className={`rounded-full px-3 py-1 font-medium ${
                selectedTags.includes(tag._id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200`}
              aria-pressed={selectedTags.includes(tag._id)}
            >
              {tag.name}
            </button>
          ))}
      </div>
    </div>
  );

  const handleCreatePost = async () => {
    // post to the server
    try {
      setLoading(true);

      const deleteImage: { images: string[] } = { images: [] };
      for (const image of postImages) {
        if (content.indexOf(image.url) === -1) {
          deleteImage.images.push(image.filename);
        }
      }
      if (deleteImage.images.length > 0) {
        const deleteImageResponse = await deleteImages(deleteImage);
        if (!deleteImageResponse.success) {
          notifyError('Failed to create post, please try again!!!');
        }
      }
      const result = await createPost({
        title,
        content,
        isAnonymous,
        tags: selectedTags,
        categoryId: '670b6a1062937ef087fd23ba'
      });
      if (result.success) {
        setLoading(false);
        notifySuccess('Post created successfully!!!');
        // clear the form
        setContent('');
        setIsAnonymous(false);
        setSelectedTags([]);
        setPostImages([]);
        setTitle('');
      } else notifyError('Failed to create post, please try again!!!');
    } catch (error) {
      notifyError('Failed to create post, please try again!!!');
      setLoading(false);
    }
  };
  return (
    <div className="flex h-full w-full flex-col gap-5 p-[20px]">
      <div className="card rounded-lg p-5 shadow-lg">
        <Typography.Title level={3} className="font-mono">
          Create Post
        </Typography.Title>
        {loading && <LoadingPage />}
        <div className="flex items-center justify-between">
          <div className="flex min-w-[500px] gap-5">
            <Input
              size="middle"
              className="max-w-[500px]"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Popover trigger={'click'} content={TagMenu} placement="bottom">
              <Badge count={selectedTags.length}>
                <Button type="dashed" icon={<TagOutlined />}>
                  Tags
                </Button>
              </Badge>
            </Popover>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <Typography.Text>Anonymous</Typography.Text>
                <Tooltip title="Anonymous posts will not include your name or profile picture.">
                  <div className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-full border">
                    <Typography.Text>?</Typography.Text>
                  </div>
                </Tooltip>
              </div>
              <Switch
                defaultValue={false}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                value={isAnonymous}
                onChange={(checked) => setIsAnonymous(checked)}
              />
            </div>
            <Button iconPosition="end" type="primary" icon={<FiSend size={20} />} onClick={handleCreatePost}>
              Post
            </Button>
          </div>
        </div>
      </div>
      <div className="window card border p-0 shadow-lg">
        <nav>
          <Reorder.Group as="ul" axis="x" onReorder={setTabs} className="tabs" values={tabs}>
            <AnimatePresence initial={false}>
              {tabs.map((item) => (
                <Tab
                  key={item.label}
                  item={item}
                  isSelected={selectedTab === item}
                  onClick={() => !isSplit && setSelectedTab(item)}
                  // onRemove={() => remove(item)}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
          <motion.button
            className="flex items-center justify-center"
            onClick={() => setIsSplit(!isSplit)}
            // disabled={tabs.length === allIngredients.length}

            whileTap={{ scale: 0.9 }}
          >
            <div>
              <LuSplitSquareHorizontal className={cn(isSplit ? 'opacity-100' : 'opacity-60')} size={25} />
            </div>
          </motion.button>
        </nav>
        <main className="h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              className="h-full w-full"
              key={selectedTab ? selectedTab.label : 'empty'}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.15 }}
            >
              <div className={cn('flex h-full', isSplit && 'gap-2')}>
                <div
                  className={cn(
                    'text-editor-wraper h-full rounded-sm shadow-lg',
                    isSplit
                      ? tabs[0].label === 'Text Editor'
                        ? 'order-1 flex-1'
                        : 'order-2 flex-1'
                      : selectedTab.label === 'Text Editor'
                        ? 'block w-full'
                        : 'hidden w-0'
                  )}
                >
                  <TextEditorComponent
                    content={content}
                    setContent={handleEditorChange}
                    postImages={postImages}
                    setPostImages={setPostImages}
                  />
                </div>
                <div
                  className={cn(
                    'card min-h-full w-0 rounded-lg border p-4 shadow-lg',
                    isSplit
                      ? tabs[0].label !== 'Text Editor'
                        ? 'order-1 flex-1'
                        : 'order-2 flex-1'
                      : selectedTab.label !== 'Text Editor'
                        ? 'block w-full'
                        : 'hidden w-0 p-0'
                  )}
                >
                  <PreviewTextEditorComponent content={contentDebounce} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default CreatePostPage;
