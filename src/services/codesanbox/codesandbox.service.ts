import { get, post, put, remove } from '../../apis';
import { CodeSandboxType, CodeSandboxFile } from '../../types/codesandbox.type';
import { QueryOptions, ResponsePagination } from '../../types/common';

export const getCodeSandboxes = async (queryOptions: QueryOptions): Promise<ResponsePagination<CodeSandboxType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'codesandbox', { params: queryOptions });
  return data as unknown as ResponsePagination<CodeSandboxType[]>;
};

export const getCodeSandbox = async (id: string): Promise<ResponsePagination<CodeSandboxType>> => {
  const data = await get<ResponsePagination<CodeSandboxType>>(import.meta.env.VITE_APP_API + 'codesandbox/' + id);
  return data as unknown as ResponsePagination<CodeSandboxType>;
};

export const createCodeSandbox = async (
  data: Partial<CodeSandboxType>
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await post(import.meta.env.VITE_APP_API + 'codesandbox', data);
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const updateCodeSandbox = async (
  id: string,
  data: Partial<CodeSandboxType>
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await put(import.meta.env.VITE_APP_API + 'codesandbox/' + id, data);
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const deleteCodeSandbox = async (id: string): Promise<ResponsePagination<void>> => {
  const response = await remove(import.meta.env.VITE_APP_API + 'codesandbox/' + id);
  return response as unknown as ResponsePagination<void>;
};

export const addFileToSandbox = async (
  sandboxId: string,
  file: Partial<CodeSandboxFile>,
  folderId?: string
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await post(
    `${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/files${folderId ? `?folderId=${folderId}` : ''}`,
    file
  );
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const addFolderToSandbox = async (
  sandboxId: string,
  folderName: string,
  parentFolderId?: string
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await post(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/folders`, {
    folderName,
    parentFolderId
  });
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const updateFileInSandbox = async (
  sandboxId: string,
  fileId: string,
  file: Partial<CodeSandboxFile> & { parentFolder?: string }
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await put(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/files/${fileId}`, file);
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const deleteFileFromSandbox = async (
  sandboxId: string,
  fileId: string
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await remove(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/files/${fileId}`);
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const updateFolderInSandbox = async (
  sandboxId: string,
  folderId: string,
  data: { folderName?: string; parentFolder?: string }
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await put(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/folders/${folderId}`, data);
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const deleteFolderFromSandbox = async (
  sandboxId: string,
  folderId: string
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await remove(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/folders/${folderId}`);
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const addImageToSandbox = async (
  sandboxId: string,
  imageFile: File,
  folderId?: string
): Promise<ResponsePagination<CodeSandboxType>> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await post(
    `${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/images${folderId ? `?folderId=${folderId}` : ''}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const requestAccess = async (
  sandboxId: string,
  data: { role: 'owner' | 'editor' | 'viewer'; message?: string }
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await post(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/request-access`, data);
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const getAccessRequests = async (
  sandboxId: string,
  options?: {
    status?: 'pending' | 'approved' | 'rejected';
    page?: number;
    pageSize?: number;
  }
): Promise<ResponsePagination<any>> => {
  const response = await get(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/access-requests`, {
    params: options
  });
  return response as unknown as ResponsePagination<any>;
};

export const handleAccessRequest = async (
  sandboxId: string,
  requestId: string,
  action: 'approve' | 'reject'
): Promise<ResponsePagination<any>> => {
  const response = await put(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/access-requests/${requestId}`, {
    action
  });
  return response as unknown as ResponsePagination<any>;
};

export const deleteAccessRequest = async (sandboxId: string, requestId: string): Promise<ResponsePagination<void>> => {
  const response = await remove(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/access-requests/${requestId}`);
  return response as unknown as ResponsePagination<void>;
};

export const updateMemberRole = async (
  sandboxId: string,
  userId: string,
  role: 'owner' | 'editor' | 'viewer'
): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await put(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/members/${userId}/role`, {
    role
  });
  return response as unknown as ResponsePagination<CodeSandboxType>;
};

export const removeMember = async (sandboxId: string, userId: string): Promise<ResponsePagination<CodeSandboxType>> => {
  const response = await remove(`${import.meta.env.VITE_APP_API}codesandbox/${sandboxId}/members/${userId}`);
  return response as unknown as ResponsePagination<CodeSandboxType>;
};
