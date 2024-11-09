import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
import store from './redux/store.ts';
import './scss/index.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './context/SocketContext.tsx';
import React from 'react';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID}>
      <SocketProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </SocketProvider>
    </GoogleOAuthProvider>
  </Provider>
);
