import React, { useState, useEffect } from 'react';
import { Spin, Splitter, Result } from 'antd';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getCodeSandbox } from '../../../services/codesanbox/codesandbox.service';
import { compileCode } from '../../../services/codesanbox/codesandbox.service';
import FolderTree from './components/FolderTree';
import Editor from './components/Editor';
import PreviewPanel from './components/PreviewPanel';
import RequestAccessModal from './components/RequestAccessModal';
import { FolderIcon, getFileIcon } from '../../../utils/icons/fileIcons';
import { getErrorMessage } from '../../../types/common/error.type';
import { useAppDispatch } from '../../../redux/app/hook';
import { setTheme, THEME } from '../../../redux/app/app.slice';
import SandboxResult from './components/SandboxResult';
import { RunCodeResultType } from '../../../types/ProblemType';

const CodeSandboxDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading, mutate } = useSWR(id ? ['codeSandbox', id] : null, () =>
    id ? getCodeSandbox(id) : null
  );
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [hasHtmlFiles, setHasHtmlFiles] = useState(false);
  const [fileMap, setFileMap] = useState<Record<string, any>>({});
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [compileResult, setCompileResult] = useState<RunCodeResultType | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<{ message?: string } | null>(null);

  useEffect(() => {
    dispatch(setTheme(THEME.DARK));
  });

  const handleCompile = async (code: string, lang: string) => {
    if (!code || !lang) return;

    setIsCompiling(true);
    setCompileError(null);
    try {
      const response = await compileCode({
        lang,
        typed_code: code
      });
      setCompileResult(response.data);
    } catch (error: any) {
      console.error('Compilation error:', error);
      setCompileError({
        message: error.response?.data?.message || error.message || 'An error occurred while compiling the code'
      });
    } finally {
      setIsCompiling(false);
    }
  };

  // Check if project has HTML files
  useEffect(() => {
    if (data?.data) {
      const checkForHtmlFiles = (folders: any[]): boolean => {
        for (const folder of folders) {
          // Check files in current folder
          if (folder.files?.some((file: any) => file.name.toLowerCase().endsWith('.html'))) {
            return true;
          }
          // Check subfolders
          if (folder.folders && checkForHtmlFiles(folder.folders)) {
            return true;
          }
        }
        return false;
      };

      // Check root files
      const hasRootHtml = data.data.files?.some((file: any) => file.name.toLowerCase().endsWith('.html'));
      // Check folders
      const hasFolderHtml = checkForHtmlFiles(data.data.folders || []);

      setHasHtmlFiles(hasRootHtml || hasFolderHtml);

      // Initialize fileMap
      const initialFileMap = flattenFilesAndFolders(data.data.files, data.data.folders);
      setFileMap(initialFileMap);
    }
  }, [data]);

  // Update preview files when selected file changes
  useEffect(() => {
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (extension === 'html') {
        // setPreviewFiles({ html: selectedFile.code });
      }
    }
  }, [selectedFile]);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  if (error || !data || !data.data) {
    const handleRequestAccess = () => {
      setIsRequestModalVisible(true);
    };

    return (
      <div>
        <Result
          status={error.response.status}
          title={getErrorMessage(error.response.status)}
          subTitle={error.response.data.message || 'Could not load the sandbox. Please try again later.'}
          extra={[
            <div className="flex items-center justify-center gap-2">
              <button
                key="retry"
                onClick={() => mutate()}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Try Again
              </button>
              {error.response.status === 403 && (
                <button
                  key="request"
                  onClick={handleRequestAccess}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Request Access
                </button>
              )}
            </div>
          ]}
        />
        <RequestAccessModal
          sandboxId={id!}
          open={isRequestModalVisible}
          onClose={() => setIsRequestModalVisible(false)}
        />
      </div>
    );
  }

  const sandbox = data.data;

  // Utility to flatten files/folders into a path-to-content map
  function flattenFilesAndFolders(files: any[] = [], folders: any[] = [], parentPath = ''): Record<string, any> {
    const map: Record<string, any> = {};

    // Add files at this level
    for (const file of files) {
      const filePath = parentPath ? `${parentPath}/${file.name}` : `./${file.name}`;

      // Handle image files
      if (file.isImage) {
        map[filePath] = {
          type: 'image',
          url: file.imageUrl,
          mimeType: file.imageMimeType,
          size: file.imageSize
        };
      } else {
        // Handle regular files
        map[filePath] = {
          type: 'text',
          content: file.code
        };
      }
    }

    // Recurse into folders
    for (const folder of folders) {
      const folderPath = parentPath ? `${parentPath}/${folder.name}` : `./${folder.name}`;
      Object.assign(map, flattenFilesAndFolders(folder.files, folder.folders, folderPath));
    }

    return map;
  }

  // Find the main HTML file path (from selectedFile or first .html file)
  let mainHtmlPath = null;
  if (selectedFile && selectedFile.name && selectedFile.name.toLowerCase().endsWith('.html')) {
    // Find the path for the selected file
    const findPath = (files: any[] = [], folders: any[] = [], parentPath = ''): string | null => {
      for (const file of files) {
        if (file._id === selectedFile._id) {
          return parentPath ? `${parentPath}/${file.name}` : `./${file.name}`;
        }
      }
      for (const folder of folders) {
        const folderPath = parentPath ? `${parentPath}/${folder.name}` : `./${folder.name}`;
        const found = findPath(folder.files, folder.folders, folderPath);
        if (found) return found;
      }
      return null;
    };
    mainHtmlPath = findPath(sandbox.files, sandbox.folders);
  } else {
    // Fallback: first .html file in the project
    mainHtmlPath = Object.keys(fileMap).find((path) => path.toLowerCase().endsWith('.html')) || null;
  }

  // Recursively convert folders/files to AntD Tree format
  function convertFolderToTreeNode(folder: any): any {
    return {
      title: folder.name,
      key: folder._id,
      icon: <FolderIcon size={24} />,
      children: [
        // Nested folders first
        ...(folder.folders ? folder.folders.map(convertFolderToTreeNode) : []),
        // Then files
        ...(folder.files
          ? folder.files.map((file: any) => ({
              title: file.name,
              key: file._id,
              isLeaf: true,
              icon: getFileIcon(file.name),
              file
            }))
          : [])
      ]
    };
  }

  // Create tree data including root files
  const treeData = [
    // Root files first
    ...(sandbox.files
      ? sandbox.files.map((file: any) => ({
          title: file.name,
          key: file._id,
          isLeaf: true,
          icon: getFileIcon(file.name),
          file
        }))
      : []),
    // Then folders
    ...(sandbox.folders || []).map(convertFolderToTreeNode)
  ];
  const onRequestAccess = () => {
    setIsRequestModalVisible(true);
  };
  return (
    <div className="flex h-[calc(100vh-60px)] flex-col overflow-hidden rounded-none p-0">
      {/* <Header name={sandbox.name} /> */}
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel className="min-w-[250px]" defaultSize={250} min="250px">
          <FolderTree
            onRequestAccess={onRequestAccess}
            treeData={treeData}
            onSelect={setSelectedFile}
            mutate={mutate}
            sandboxName={sandbox.name}
          />
        </Splitter.Panel>
        <Splitter.Panel className="flex flex-auto">
          <Splitter style={{ height: '100%' }}>
            <Splitter.Panel defaultSize="50%">
              <div className="card h-full flex-auto overflow-auto rounded-none border-none p-0 shadow-none">
                <Editor
                  onRequestAccess={onRequestAccess}
                  file={selectedFile}
                  onSave={(content) => {
                    if (selectedFile) {
                      const filePath = Object.keys(fileMap).find((path) => path.endsWith(selectedFile.name));
                      if (filePath) {
                        setFileMap((prev) => ({
                          ...prev,
                          [filePath]: {
                            ...prev[filePath],
                            content
                          }
                        }));
                      }
                    }
                  }}
                  onCompile={handleCompile}
                />
              </div>
            </Splitter.Panel>
            <Splitter.Panel style={{ height: '100%' }}>
              {hasHtmlFiles ? (
                <PreviewPanel
                  hasHtmlFiles={hasHtmlFiles}
                  fileMap={fileMap}
                  mainHtmlPath={mainHtmlPath}
                  sandboxId={id!}
                />
              ) : (
                <SandboxResult compileResult={compileResult} isCompiling={isCompiling} error={compileError} />
              )}
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
      <RequestAccessModal
        sandboxId={id!}
        open={isRequestModalVisible}
        onClose={() => setIsRequestModalVisible(false)}
      />
    </div>
  );
};

export default CodeSandboxDetailPage;
