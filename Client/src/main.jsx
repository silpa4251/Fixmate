import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './app/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <GoogleOAuthProvider clientId={CLIENTID}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
          </GoogleOAuthProvider>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
