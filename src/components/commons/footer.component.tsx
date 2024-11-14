import { FaCode, FaFacebook, FaGithub, FaGoogle, FaQuestionCircle, FaShare } from 'react-icons/fa';

const FooterComponent = () => {
  return (
    <footer className="z-10 flex w-full justify-center bg-gray-800 py-8 text-white">
      <div className="flex w-full max-w-[1440px] flex-col items-center px-5">
        <div className="grid w-full grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="mb-4 text-[2rem] font-bold">ITenv</h3>
            <p className="text-[1.4rem] text-gray-400">
              Your one-stop platform for IT learning and community interaction.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-[1.6rem] font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-[1.4rem] text-gray-400">
              <li>
                <button className="hover:text-white">About Us</button>
              </li>
              <li>
                <button className="hover:text-white">Contact</button>
              </li>
              <li>
                <button className="hover:text-white">Privacy Policy</button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[1.6rem] font-semibold">Connect With Us</h4>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white">
                <FaFacebook size={24} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <FaGithub size={24} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <FaGoogle size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
