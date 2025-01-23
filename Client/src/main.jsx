import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './app/store.jsx';

const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
        <GoogleOAuthProvider clientId={CLIENTID}>
          <App />
          <ToastContainer />
        </GoogleOAuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
