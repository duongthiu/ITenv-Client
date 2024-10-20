import { post } from "../apis";
import { ResponseAxios } from "../types/common";
import { TypeVoteEnum } from "../types/enum/typeVote.enum";

export const voteService = async (id: string, typeVote: TypeVoteEnum): Promise<ResponseAxios> => {
  const data = await post(import.meta.env.VITE_APP_API + 'post/vote/' + id, { typeVote: typeVote });
  return data;
};
