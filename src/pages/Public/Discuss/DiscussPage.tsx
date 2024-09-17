import { Typography } from 'antd';
// import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routes/paths';
import { PostType } from '../../../types/PostType';
import TextEditorComponent from '../../../components/TextEditor/TextEditor.component';
import PostComponent from './components/Post.component';
const DiscussPage = () => {
  const navigate = useNavigate();
  const posts: PostType[] = [
    {
      id: 1,
      title: 'Post 1',
      content: 'Content of Post 1',
      created_at: '2024-07-24',
      updated_at: '2024-07-24',
      user_id: '1',
      image_url: 'https://via.placeholder.com/150',
      vote: 10,
      comments: [
        {
          id: '1',
          content: 'Comment 1 on Post 1',
          created_at: '2024-07-24',
          updated_at: '2024-07-24',
          vote: 2,
          user: {
            name: 'User 1'
          }
        }
      ],
      user: {
        name: 'User 1'
      }
    },
    {
      id: 2,
      title: 'Post 2',
      content: 'Content of Post 2',
      created_at: '2024-07-24',
      updated_at: '2024-07-24',
      user_id: '2',
      image_url: 'https://via.placeholder.com/150',
      vote: 5,
      comments: [],
      user: {
        name: 'User 2'
      }
    }
  ];

  return (
    <div className="h-full ">
      {/* <Typography.Text onClick={() => navigate(paths.editor)}>DiscussPage</Typography.Text> */}

      {/* <Link onClick={() => navigate(paths.editor)}> Code Editor</Link> */}
      {posts.length > 0 && posts.map((post) => <PostComponent key={post.id} post={post} />)}
      {/* <TextEditorComponent /> */}
      <Typography.Link href={paths.createPost}>Create Post</Typography.Link>
    </div>
  );
};

export default DiscussPage;
