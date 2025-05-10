import React, { useState } from 'react';
import { Spin, Splitter } from 'antd';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getCodeSandbox } from '../../../services/codesanbox/codesandbox.service';
import FolderTree from './components/FolderTree';
import Editor from './components/Editor';
import { File, Folder } from 'lucide-react';

const CodeSandboxDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading, mutate } = useSWR(id ? ['codeSandbox', id] : null, () =>
    id ? getCodeSandbox(id) : null
  );
  const [selectedFile, setSelectedFile] = useState<any>(null);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  if (error || !data || !data.data) return <div className="mt-10 text-center text-red-500">Error loading sandbox</div>;

  const sandbox = data.data;

  // Recursively convert folders/files to AntD Tree format
  function convertFolderToTreeNode(folder: any): any {
    return {
      title: folder.name,
      key: folder._id,
      icon: <Folder size={24} />,
      children: [
        // Nested folders first
        ...(folder.folders ? folder.folders.map(convertFolderToTreeNode) : []),
        // Then files
        ...(folder.files
          ? folder.files.map((file: any) => ({
              title: file.name,
              key: file._id,
              isLeaf: true,
              icon: <File />,
              file
            }))
          : [])
      ]
    };
  }

  const treeData = (sandbox.folders || []).map(convertFolderToTreeNode);

  return (
    <div className="flex h-[calc(100vh-60px)] flex-col overflow-hidden rounded-none p-0">
      {/* <Header name={sandbox.name} /> */}
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="256px" min="160px" max="500px">
          <FolderTree treeData={treeData} onSelect={setSelectedFile} mutate={mutate} sandboxName={sandbox.name} />
        </Splitter.Panel>
        <Splitter.Panel className="flex flex-auto">
          <div className="card flex-auto overflow-auto rounded-none border-none p-0 shadow-none">
            <Editor file={selectedFile} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default CodeSandboxDetailPage;
