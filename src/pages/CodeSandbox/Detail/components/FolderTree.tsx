import React, { useEffect, useState } from 'react';
import { Dropdown, MenuProps, Tree, Input, Modal, Button } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useParams } from 'react-router-dom';
import { Folder, File, ChevronDown, ChevronRight, FolderPlus, FilePlus2 } from 'lucide-react';
import { useFileManage } from '../hook/use-file-manage';
import './DetailCodeSandBox.style.scss';

interface FolderTreeProps {
  treeData: DataNode[];
  onSelect: (file: any) => void;
  mutate: () => void;
  sandboxName: string;
}

const FolderTree: React.FC<FolderTreeProps> = ({ treeData, onSelect, mutate, sandboxName }) => {
  const { id: sandboxId } = useParams<{ id: string }>();
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
  } = useFileManage({ sandboxId: sandboxId || '', treeData, mutate });
  const [isCollapsed, setIsCollapsed] = useState(false);
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
          icon: actionType === 'folder' ? <Folder size={24} /> : <File size={24} />
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
              icon: actionType === 'folder' ? <Folder size={24} /> : <File size={24} />
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

  return (
    <div className="h-full w-full min-w-64 overflow-y-auto border-r p-0">
      <div className="w-full border-b border-gray-500 p-2">
        <div className="flex cursor-pointer items-center justify-between" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="flex items-center gap-2">
            <div>{isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}</div>
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
                treeData={addNewItemToTree(treeData)}
                onSelect={(_, { node }) => {
                  setSelectedNode(node);
                  (node as any)?.file && onSelect((node as any).file);
                }}
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys)}
                showIcon
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
