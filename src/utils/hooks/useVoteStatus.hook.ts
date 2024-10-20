import { useMemo } from 'react';
import { useAppSelector } from '../../redux/app/hook';

interface VoteData {
  vote: string[];
  downVote: string[];
}
const useVoteStatus = (data: VoteData) => {
  const { user } = useAppSelector((state) => state.user);

  const isVoted = useMemo(() => {
    if (user?._id) {
      return data?.vote.includes(user._id);
    }
    return false;
  }, [data?.vote, user?._id]);

  const isDownvoted = useMemo(() => {
    if (user?._id) {
      return data?.downVote.includes(user?._id);
    }
    return false;
  }, [data?.downVote, user?._id]);

  return { isVoted, isDownvoted };
};
export default useVoteStatus;
