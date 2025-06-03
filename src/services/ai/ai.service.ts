import { post } from '../../apis';
import { ResponsePagination } from '../../types/common';

export type RefactorCodeRequest = {
  problemId: string;
  code: string;
  lang: string;
};

export type RefactorCodeResponse = {
  refactoredCode: string;
};

export const refactorCode = async (
  requestOptions: RefactorCodeRequest
): Promise<ResponsePagination<RefactorCodeResponse>> => {
  const data = await post(import.meta.env.VITE_APP_API + 'ai/refactor', requestOptions);
  return data as unknown as ResponsePagination<RefactorCodeResponse>;
};

export const generateStreamingResponse = async (
  input: string,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
) => {
  try {
    const response = await fetch(import.meta.env.VITE_APP_API + 'ai/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              onError(data.error);
              return;
            }
            if (data.content) {
              onChunk(data.content);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error.message : 'An error occurred');
  }
};
