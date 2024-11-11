import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { SocketProvider } from './context/SocketContext.tsx';
import './index.css';
import store from './redux/store.ts';
import './scss/index.scss';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </GoogleOAuthProvider>
  </Provider>
);
