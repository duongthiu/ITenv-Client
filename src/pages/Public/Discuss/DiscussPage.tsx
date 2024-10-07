import { ChangeEvent, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { PostType } from '../../../types/PostType';
import PostComponent from './components/Post.component';

const DiscussPage = () => {
  const [threads, setThreads] = useState<PostType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popularity' | 'recent'>('popularity');
  const [notifications, setNotifications] = useState<string[]>([]); // Assuming notifications are strings for now

  useEffect(() => {
    const fetchedThreads: PostType[] = [
      {
        _id: '1',
        title: 'How to optimize React performance?',
        content: 'Discussion about React performance optimization techniques',
        createdAt: '2023-06-15T10:30:00Z',
        updatedAt: '2023-06-15T10:30:00Z',
        postBy: {
          _id: '1',
          username: 'reactdev',
          avatar:
            'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        },
        vote: [], // Array of user IDs for vote
        view: [], // Array of user IDs for views
        comments: [
          {
            _id: '101',
            commentBy: {
              _id: '2',
              username: 'perfexpert',
              avatar:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
            },
            content: 'Use React.memo and useMemo for expensive computations.',
            createdAt: '2023-06-15T11:15:00Z',
            isAccepted: false,
            vote: [] // Array of user IDs for votes
          }
        ]
      },
      {
        _id: '2',
        title: 'Best practices for state management in large React applications',
        content: 'Discussion about state management in large-scale React apps',
        createdAt: '2023-06-14T14:45:00Z',
        updatedAt: '2023-06-14T14:45:00Z',
        postBy: {
          _id: '3',
          username: 'statemanager',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        },
        vote: [], // Array of user IDs for vote
        view: [], // Array of user IDs for views
        comments: [] // No comments yet
      }
    ];

    setThreads(fetchedThreads);
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (criteria: 'popularity' | 'recent') => {
    setSortBy(criteria);
  };

  // const handleUpvote = (threadId: number) => {
  //   setThreads((prevThreads) =>
  //     prevThreads.map((post) => (post.id === threadId ? { ...post, vote: post.vote + 1 } : post))
  //   );
  // };

  // const handleDownvote = (threadId: number) => {
  //   setThreads((prevThreads) =>
  //     prevThreads.map((post) => (post.id === threadId ? { ...post, downvotes: post.downvotes + 1 } : post))
  //   );
  // };

  // const sortedThreads = [...threads].sort((a, b) => {
  //   if (sortBy === 'popularity') {
  //     return b.vote - a.vote;
  //   } else {
  //     return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  //   }
  // });

  // const filteredThreads = sortedThreads.filter((post) =>
  //   post.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="mx-auto p-4">
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Discussion Forum</h1>
        <div className="flex items-center justify-between">
          <div className="relative mr-4 flex-grow">
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={`rounded-lg px-4 py-2 ${
                sortBy === 'popularity' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleSort('popularity')}
            >
              Popular
            </button>
            <button
              className={`rounded-lg px-4 py-2 ${
                sortBy === 'recent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleSort('recent')}
            >
              Recent
            </button>
          </div>
        </div>
      </header>

      <main>
        {threads.map((post) => (
          <PostComponent key={post._id} post={post} />
        ))}
      </main>

      {/* <aside className="fixed right-4 top-4 w-80">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No new notifications</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <li key={index} className="rounded-lg bg-gray-50 p-4">
                  {notification}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside> */}
    </div>
  );
};

export default DiscussPage;
