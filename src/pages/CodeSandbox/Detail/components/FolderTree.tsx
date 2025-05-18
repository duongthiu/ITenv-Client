import React, { useEffect, useState } from 'react';
import { Dropdown, MenuProps, Tree, Input, Modal, Button, Upload, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Folder, ChevronDown, ChevronRight, FolderPlus, FilePlus2, Upload as UploadIcon } from 'lucide-react';
import { useFileManage } from '../hook/use-file-manage';
import { addImageToSandbox } from '../../../../services/codesanbox/codesandbox.service';
import './DetailCodeSandBox.style.scss';
import { getFileIcon } from '../../../../utils/icons/fileIcons';

interface FolderTreeProps {
  treeData: DataNode[];
  onSelect: (file: any) => void;
  mutate: () => void;
  sandboxName: string;
  onRequestAccess?: () => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({ treeData, onSelect, mutate, sandboxName, onRequestAccess }) => {
  const { id: sandboxId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    newItemName,
    setNewItemName,
    actionType,
    isLoading,
    targetFolderId,
    selectedNode,
    setSelectedNode,
    editingNode,
    setEditingNode,
    isCreatingNew,
    setIsCreatingNew,
    expandedKeys,
    setExpandedKeys,
    handleContextMenu,
    handleMenuClick,
    handleCreateNew,
    handleRename,
    handleDelete,
    onDrop,
    setTargetFolderId,
    setActionType
  } = useFileManage({
    sandboxId: sandboxId || '',
    treeData,
    mutate,
    onRequestAccess: onRequestAccess
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  // Handle file selection from URL
  useEffect(() => {
    const fileId = searchParams.get('file');
    if (fileId) {
      const findFileInTree = (nodes: DataNode[]): any => {
        for (const node of nodes) {
          if (node.key === fileId) {
            return node;
          }
          if (node.children) {
            const found = findFileInTree(node.children);
            if (found) return found;
          }
        }
        return null;
      };

      const fileNode = findFileInTree(treeData);
      if (fileNode) {
        setSelectedNode(fileNode);
        onSelect(fileNode.file);
      }
    }
  }, [searchParams, treeData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedNode) return;

      if (e.key === 'F2') {
        handleMenuClick({ key: '3' });
      } else if (e.key === 'Delete') {
        handleMenuClick({ key: '4' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  const items: MenuProps['items'] = [
    {
      label: 'New File...',
      key: '2',
      onClick: handleMenuClick,
      disabled: !targetFolderId
    },
    {
      label: 'New Folder...',
      key: '1',
      onClick: handleMenuClick,
      disabled: !targetFolderId
    },
    {
      type: 'divider'
    },
    {
      label: 'Rename (F2)',
      key: '3',
      onClick: handleMenuClick,
      disabled: !selectedNode
    },
    {
      label: 'Delete (Del)',
      key: '4',
      onClick: handleMenuClick,
      disabled: !selectedNode
    }
  ];

  const handleUpload = async (file: File, folderId?: string) => {
    try {
      await addImageToSandbox(sandboxId || '', file, folderId);
      message.success('Image uploaded successfully');
      mutate(); // Refresh the tree
    } catch (error: any) {
      if (error.response?.status === 403) {
        onRequestAccess?.();
        message.error('Permission denied. Request access to upload image.');
      } else {
        message.error('Failed to upload image');
        console.error('Upload error:', error);
      }
    }
  };

  const renderTitle = (node: any) => {
    if (editingNode === node.key) {
      return (
        <Input
          size="small"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={handleRename}
          autoFocus
          onBlur={() => setEditingNode(null)}
        />
      );
    }

    // Add upload button for folders
    if (!node.isLeaf) {
      return (
        <div className="flex items-center justify-between gap-2">
          <span>{node.title}</span>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error('Only image files are supported');
                return false;
              }
              handleUpload(file, node.key);
              return false; // Prevent default upload behavior
            }}
          >
            <Button type="text" size="small" icon={<UploadIcon size={14} />} />
          </Upload>
        </div>
      );
    }

    return node.title;
  };

  const addNewItemToTree = (nodes: DataNode[]): DataNode[] => {
    if (isCreatingNew && targetFolderId === null) {
      return [
        ...nodes,
        {
          title: (
            <Input
              size="small"
              placeholder={`Enter ${actionType === 'folder' ? 'folder' : 'file'} name`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={handleCreateNew}
              autoFocus
              onBlur={() => {
                setIsCreatingNew(false);
                setNewItemName('');
              }}
            />
          ),
          key: 'new-item',
          icon: actionType === 'folder' ? <Folder size={24} /> : getFileIcon(newItemName)
        }
      ];
    }
    return nodes.map((node) => {
      if (node.key === targetFolderId && isCreatingNew) {
        return {
          ...node,
          title: renderTitle(node),
          children: [
            ...(node.children || []),
            {
              title: (
                <Input
                  size="small"
                  placeholder={`Enter ${actionType === 'folder' ? 'folder' : 'file'} name`}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={handleCreateNew}
                  autoFocus
                  onBlur={() => {
                    setIsCreatingNew(false);
                    setNewItemName('');
                  }}
                />
              ),
              key: 'new-item',
              icon: actionType === 'folder' ? <Folder size={24} /> : getFileIcon(newItemName)
            }
          ]
        };
      }
      if (node.children) {
        return {
          ...node,
          title: renderTitle(node),
          children: addNewItemToTree(node.children)
        };
      }
      return {
        ...node,
        title: renderTitle(node)
      };
    });
  };

  const handleFileSelect = (node: any) => {
    setSelectedNode(node);
    if (!node.isLeaf) {
      const newExpandedKeys = expandedKeys.includes(node.key)
        ? expandedKeys.filter((key) => key !== node.key)
        : [...expandedKeys, node.key];
      setExpandedKeys(newExpandedKeys);
    } else {
      (node as any)?.file && onSelect((node as any).file);
      // Update URL with selected file
      navigate(`?file=${node.key}`, { replace: true });
    }
  };

  return (
    <div className="h-full w-full min-w-64 overflow-y-auto border-r p-0">
      <div className="w-full border-b border-gray-500 p-2">
        <div className="flex cursor-pointer items-center justify-between" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="flex items-center gap-2">
            <div>{isCollapsed ? <ChevronRight size={24} /> : <ChevronDown size={24} />}</div>
            <span className="text-base font-medium">{sandboxName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              className="size-5 border-none"
              icon={<FilePlus2 size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(false);
                setTargetFolderId(null);
                setActionType('file');
                setIsCreatingNew(true);
              }}
            />
            <Button
              className="size-5 border-none"
              icon={<FolderPlus size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(false);
                setTargetFolderId(null);
                setActionType('folder');
                setIsCreatingNew(true);
              }}
            />
          </div>
        </div>

        {!isCollapsed && (
          <Dropdown rootClassName="menu-wrapper" menu={{ items }} trigger={['contextMenu']}>
            <div className="h-full w-full">
              <Tree
                showLine
                defaultExpandAll
                treeData={addNewItemToTree(treeData)}
                onSelect={(_, { node }) => handleFileSelect(node)}
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys)}
                showIcon
                switcherIcon={<ChevronDown />}
                className="folder-tree mt-2 h-full"
                onRightClick={handleContextMenu}
                draggable
                onDrop={onDrop}
              />
            </div>
          </Dropdown>
        )}
      </div>

      <Modal
        title="Delete Item"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
        }}
        confirmLoading={isLoading}
      >
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </div>
  );
};

export default FolderTree;
