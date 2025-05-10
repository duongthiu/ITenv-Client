import { useState } from 'react';
import { FaBookmark, FaCheck, FaStar, FaThumbsUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../routes/paths';
import { Tags } from '../../../../types/ProblemType';
type ContentCardProps = {
  title: string;
  slug: string;
  content?: string;
  tags: Tags[];
  votes: number;
  saved?: boolean;
  difficulty: string;
  acceptance: number;
};
const ContentCard: React.FC<ContentCardProps> = ({ title, slug, tags, votes, saved, difficulty, acceptance }) => {
  const [isVoted, setIsVoted] = useState(false);
  const [isSaved, setIsSaved] = useState(saved);
  const [voteCount, setVoteCount] = useState(votes);
  const navigate = useNavigate();

  const handleVote = () => {
    if (isVoted) {
      setVoteCount(voteCount - 1);
    } else {
      setVoteCount(voteCount + 1);
    }
    setIsVoted(!isVoted);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  return (
    <div className="flex flex-col gap-2 border-b-[1px] px-2 py-4">
      <h2
        className="cursor-pointer text-lg font-bold duration-200 hover:text-primary-color-hover"
        onClick={() => navigate(paths.singleProblem.replace(':slug', slug))}
      >
        {title}
      </h2>
      {/* <p className="sub-title mb-4 text-xs">{content}</p> */}
      <div className="flex flex-wrap">
        {tags?.map((tag, index) => (
          <span key={index} className="tag mr-2 rounded px-2.5 py-0.5 text-xs font-medium">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <FaCheck className="mr-2 text-green-500" />
          <span className="text-gray-600">{acceptance}% Acceptance</span>
        </div>
        <div className={`flex items-center ${getDifficultyColor(difficulty)}`}>
          <FaStar className="mr-2" />
          <span className="">{difficulty}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={handleVote}
          className={`flex items-center ${isVoted ? 'text-blue-600' : 'text-gray-500'} transition-colors duration-200 hover:text-blue-600 focus:outline-none`}
          aria-label={`Vote for ${title}`}
        >
          <FaThumbsUp className="mr-2" />
          <span>{voteCount}</span>
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center ${isSaved ? 'text-yellow-500' : 'text-gray-500'} transition-colors duration-200 hover:text-yellow-500 focus:outline-none`}
          aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
        >
          <FaBookmark className="mr-2" />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};
export default ContentCard;
