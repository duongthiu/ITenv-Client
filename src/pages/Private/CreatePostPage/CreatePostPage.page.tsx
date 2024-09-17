import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { useCallback, useState } from 'react';
import { LuSplitSquareHorizontal } from 'react-icons/lu';
import PreviewTextEditorComponent from '../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import TextEditorComponent from '../../../components/TextEditor/TextEditor.component';
import { cn } from '../../../utils/helpers/cn';
import { useDebounce } from '../../../utils/hooks/useDebounce.hook';
import './CreatePostPage.style.scss';
import { Tab } from './Tabs';
import { Button, Input, Switch, Tooltip, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FiSend } from 'react-icons/fi';
export interface Ingredient {
  label: string;
}
const initialTabs: Ingredient[] = [{ label: 'Text Editor' }, { label: 'Preview Text Editor' }];

const CreatePostPage = () => {
  const [content, setContent] = useState('Write something');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditorChange = useCallback((content: any, editor: any) => {
    setContent(content);
  }, []);
  const contentDebounce = useDebounce(content, 300);

  const [tabs, setTabs] = useState(initialTabs);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [isSplit, setIsSplit] = useState(false);
  console.log(tabs);
  return (
    <div className="flex h-full w-full flex-col gap-5 p-[20px]">
      <div className="card rounded-lg p-5 shadow-lg">
        <Typography.Title level={3} className="font-mono">
          Create Post
        </Typography.Title>
        <div className="flex items-center justify-between">
          <Input size="middle" className="max-w-[500px]" placeholder="Enter post title..." />
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
              <Switch defaultValue={false} checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
            </div>
            <Button iconPosition="end" type="primary" icon={<FiSend size={20} />}>
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
                  <TextEditorComponent content={content} setContent={handleEditorChange} />
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
