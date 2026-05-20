// نقطة الدخول — يلف التطبيق بالراوتر فقط (الحالة في Zustand)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SalafaProvider } from './contexts/SalafaContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SalafaProvider>
          <App />
        </SalafaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
