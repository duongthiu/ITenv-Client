import './HomePage.style.scss';
import background from '../../../assets/background/backgroundblur.jpg';
import HeaderComponent from '../../../components/commons/header/header.component';
import media from '../../../assets/homepage/media.jpg';
import logo from '../../../assets/logo/logo.png';
import { Button, Divider } from 'antd';
import MacBrowser from './components/MacBrowser/MacBroser.component';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';
import FooterComponent from '../../../components/commons/footer.component';
const HomePage = () => {
  // const { data } = useSWR('friendRequest', getFriendRequests);
  // console.log(data);
  const navigate = useNavigate();
  return (
    <div className="homepage-wrapper flex min-h-screen flex-col text-black">
      <img src={background} className="min-screen fixed w-full" alt="" />
      <HeaderComponent />
      <div className="relative flex w-full items-center justify-center">
        <div className="z-10 flex w-[1280px] flex-col items-center justify-center gap-20 px-5 py-[120px]">
          <div className="relative flex aspect-square h-[350px] w-[350px] items-start justify-center rounded-full border-[1px] border-[#5960dc] bg-transparent pt-10">
            <div className="flex aspect-square h-[300px] w-[300px] items-center justify-center rounded-full border-[2px] border-[#5960dc] border-white bg-transparent">
              <img src={media} alt="" className="w-[250px]" />
            </div>
            <div className="absolute bottom-[70px] left-[-20px] h-[60px] w-[60px] rounded-full bg-gradient-to-r from-[#5960dc] to-[#ff99ff]"></div>
          </div>
          <div className="">
            <div className="flex items-center justify-center gap-5">
              <img src={logo} className="h-[48px] w-[48px]" alt="Logo" />
              <h1 className="text-[5rem] font-extrabold text-primary-color">ITenv</h1>
            </div>
            <p className="max-w-[800px] text-center text-base">
              Welcome to ITenv — the ultimate platform for developers to learn, connect, and collaborate! ITenv is
              designed to bring together the best features of problem-solving platforms, social networking, and
              collaborative coding all in one place. Whether you're here to tackle coding challenges similar to
              LeetCode, engage in discussions with like-minded peers, or save and share code snippets like on
              CodeSandbox, ITenv has you covered.
            </p>
            <div className="mt-10 flex items-center justify-center gap-5">
              <Button size="large" onClick={() => navigate('/discuss')}>
                Start Discuss
              </Button>
              <Button type="primary" size="large" onClick={() => navigate('/problems')}>
                Start Coding
              </Button>
            </div>
          </div>
          <Divider className="h-[5px] w-full" />
          <div className="flex flex-col items-center justify-center gap-0">
            <p className="text-3xl font-extrabold">
              <Typewriter
                words={['The space for you to explore']}
                loop={false}
                cursor
                cursorStyle="|"
                cursorColor="grey"
                typeSpeed={200}
                deleteSpeed={60}
              />
            </p>
            <p className="text-base">One place to learn, code, and connect with others, solve coding problems</p>
            <p className="mb-32 text-base"> Share your ideas, ask questions, and get help.</p>
            <div className="flex h-[500px] w-[900px] flex-col rounded-2xl bg-white bg-opacity-50 backdrop-blur-md">
              <MacBrowser />
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default HomePage;
