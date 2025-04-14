import { post } from '../../apis';
import { ResponsePagination } from '../../types/common';

interface ChatRequest {
  message: string;
}

export const chatWithClaude = async (message: string): Promise<ResponsePagination<ChatRequest>> => {
  const headers = {
    'X-API-Key': import.meta.env.VITE_APP_ANTHROPIC_API_KEY || '',
    'content-type': 'application/json',
    authorization: import.meta.env.VITE_APP_ANTHROPIC_API_KEY || ''
  };
  const data = await post('https://api.anthropic.com/v1/messages', { message }, { headers });
  return data as unknown as ResponsePagination<ChatRequest>;
};
