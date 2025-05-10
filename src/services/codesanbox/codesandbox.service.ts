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
