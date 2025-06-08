import { Empty, Skeleton } from 'antd';

import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { getSubmissionByUserId } from '../../../../../services/problem/problem.service';
import timeAgo from '../../../../../utils/helpers/timeAgo';
type ListSubmissionProps = {
  userId: string;
};

const ListSubmission: React.FC<ListSubmissionProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { data: listSubmissions, isLoading } = useSWR('listSubmission' + userId, () => getSubmissionByUserId(userId));
  return (
    <div>
      {isLoading && <Skeleton avatar paragraph={{ rows: 4 }} active className="py-5" />}
      {listSubmissions?.data?.length === 0 ? (
        <Empty />
      ) : (
        <div>
          <div className="flex-1">
            {listSubmissions?.data?.map((submission: any) => {
              return (
                <div
                  className="group grid cursor-pointer grid-cols-12 gap-2 border-b-[1px]"
                  onClick={() => navigate(`/problems/${submission?.problem?.slug}`)}
                >
                  <div className="col-span-2 flex flex-col gap-1 p-5">
                    <span className={`text-sm text-${submission?.isAccepted ? 'green-600' : 'red-600'}`}>
                      {submission?.isAccepted ? 'Accepted' : 'Rejected'}
                    </span>
                    <span className="sub-title">{timeAgo(submission?.createdAt)}</span>
                  </div>
                  <span className="col-span-10 flex items-center text-base font-semibold duration-200 group-hover:text-primary-color">
                    {submission?.problem?.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSubmission;
