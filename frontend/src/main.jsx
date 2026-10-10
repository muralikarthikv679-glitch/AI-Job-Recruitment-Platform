import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Clean up any corrupted or legacy URLs in localStorage
try {
  const cachedUrl = localStorage.getItem('talentflow_api_url');
  if (cachedUrl && (cachedUrl.includes('https//') || cachedUrl.includes('http//') || cachedUrl.includes('undefined') || cachedUrl.includes('null'))) {
    localStorage.removeItem('talentflow_api_url');
  }
} catch (e) {
  // ignore
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
