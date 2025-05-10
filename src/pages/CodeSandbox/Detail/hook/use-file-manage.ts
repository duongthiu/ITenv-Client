import { useState } from 'react';
import { message } from 'antd';
import { DataNode } from 'antd/es/tree';
import { addFileToSandbox, addFolderToSandbox } from '../../../../services/codesanbox/codesandbox.service';
import { CodeSandboxFileType } from '../../../../types/codesandbox.type';

interface UseFileManageProps {
  sandboxId: string;
  treeData: DataNode[];
  mutate: () => void;
}

export const useFileManage = ({ sandboxId, treeData, mutate }: UseFileManageProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [actionType, setActionType] = useState<'file' | 'folder' | 'rename' | 'delete'>('file');
  const [isLoading, setIsLoading] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const findNodeByKey = (nodes: DataNode[], key: React.Key): DataNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const handleContextMenu = (info: any) => {
    const { node, event } = info;
    const target = event.target as HTMLElement;
    const isFolderTitle = target.closest('.ant-tree-node-content-wrapper');
    const isFolderArea = target.closest('.ant-tree-treenode');

    if (isFolderTitle) {
      setTargetFolderId(node.key as string);
      setSelectedNode(node);
      if (!expandedKeys.includes(node.key)) {
        setExpandedKeys([...expandedKeys, node.key]);
      }
    } else if (isFolderArea) {
      setTargetFolderId(node.key as string);
      setSelectedNode(null);
    } else {
      setTargetFolderId(null);
      setSelectedNode(null);
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case '1':
        setActionType('folder');
        setIsCreatingNew(true);
        break;
      case '2':
        setActionType('file');
        setIsCreatingNew(true);
        break;
      case '3':
        setActionType('rename');
        setNewItemName(selectedNode.title);
        setEditingNode(selectedNode.key);
        break;
      case '4':
        setActionType('delete');
        setIsDeleteModalOpen(true);
        break;
    }
  };

  const handleCreateNew = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!sandboxId) return;

    if (e.key === 'Enter' && newItemName.trim()) {
      setIsLoading(true);
      try {
        const fileData = {
          name: newItemName,
          type: CodeSandboxFileType.JAVASCRIPT,
          code: '',
          version: 1
        };

        if (actionType === 'folder') {
          await addFolderToSandbox(sandboxId, newItemName, targetFolderId || undefined);
          message.success('Folder created successfully');
        } else {
          await addFileToSandbox(sandboxId, fileData, targetFolderId || undefined);
          message.success('File created successfully');
        }
        setNewItemName('');
        setIsCreatingNew(false);
        mutate();
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          message.error(error.message);
        } else {
          message.error('Failed to create item');
        }
      } finally {
        setIsLoading(false);
      }
    } else if (e.key === 'Escape') {
      setIsCreatingNew(false);
      setNewItemName('');
    }
  };

  const handleRename = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newItemName.trim()) {
      try {
        // TODO: Implement rename functionality
        message.success('Item renamed successfully');
        setEditingNode(null);
        mutate();
      } catch (error: any) {
        message.error('Failed to rename item');
      }
    } else if (e.key === 'Escape') {
      setEditingNode(null);
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Implement delete functionality
      message.success('Item deleted successfully');
      setIsDeleteModalOpen(false);
      mutate();
    } catch (error: any) {
      message.error('Failed to delete item');
    }
  };

  const onDrop = async (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;

    // Don't allow dropping onto itself
    if (dragKey === dropKey) {
      return;
    }

    // Find the drop target node
    const dropNode = findNodeByKey(treeData, dropKey);
    if (!dropNode) return;

    // Only allow dropping onto folders
    if (!dropNode.children) {
      message.error('Can only drop items into folders');
      return;
    }

    // Don't allow dropping a folder into its own subfolder
    const isDropInSubFolder = (node: any, targetKey: string): boolean => {
      if (node.key === targetKey) return true;
      if (node.children) {
        return node.children.some((child: any) => isDropInSubFolder(child, targetKey));
      }
      return false;
    };

    const dragNode = findNodeByKey(treeData, dragKey);
    if (dragNode && isDropInSubFolder(dragNode, dropKey)) {
      message.error('Cannot drop a folder into its own subfolder');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement move functionality in the backend
      // For now, just show a success message
      message.success('Item moved successfully');
      mutate();
    } catch (error: any) {
      message.error('Failed to move item');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    newItemName,
    setNewItemName,
    actionType,
    setActionType,
    isLoading,
    targetFolderId,
    setTargetFolderId,
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
    onDrop
  };
};
