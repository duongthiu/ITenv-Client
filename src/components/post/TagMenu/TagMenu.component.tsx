import { Divider, Empty, Input, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { TagType } from '../../../types/TagType';
import { useDebounce } from '../../../utils/hooks/useDebounce.hook';
import useSWR from 'swr';
import { getTags } from '../../../services/tags/tag.service';
import { notifyWarning } from '../../../utils/helpers/notify';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook';
import { setTags } from '../../../redux/tag/tag.slice';
type TagMenuProps = {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};
const TagMenu: React.FC<TagMenuProps> = ({ selectedTags = [], setSelectedTags }) => {
  const dispatch = useAppDispatch();
  const { tags: tagsSelector } = useAppSelector((state) => state.tag);
  const { data: tags, isLoading } = useSWR('/api/tag', () => {
    if (!tagsSelector) return getTags();
  });

  const [searchTags, setSearchTags] = useState('');
  // const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debounceSearchVariable = useDebounce(searchTags, 500);
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prevTags: string[]) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t: string) => t !== tag);
      } else if (prevTags.length === 10) {
        notifyWarning('You can only select 10 tags');
        return prevTags;
      }
      return [...prevTags, tag];
    });
  };
  useEffect(() => {
    if (tags) {
      dispatch(setTags(tags?.data || []));
    }
  });
  return (
    <div className={`mb-4 flex h-full w-full max-w-[400px] flex-col`}>
      <h2 className="text-[1.6rem] font-semibold">Tags</h2>
      <Divider className="my-3" />
      <Input
        placeholder="Search tags... "
        className="mb-8"
        value={searchTags}
        onChange={(e) => setSearchTags(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 overflow-y-auto">
        {isLoading && <Skeleton />}
        {tagsSelector?.length === 0 && <Empty />}
        {tagsSelector
          ?.filter((tag) => tag.name.toLowerCase().includes(debounceSearchVariable.toLowerCase()))
          .map((tag: TagType) => (
            <button
              key={tag._id}
              onClick={() => handleTagToggle(tag._id)}
              className={`rounded-full px-3 py-1 text-[1.2rem] font-medium ${
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
};

export default TagMenu;
