/**
 * src/main.jsx
 * 
 * Application mounting entry point.
 * Wraps <App /> with <ProfileProvider> to grant all subtrees access to the global profile state.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import './styles/App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </React.StrictMode>
);
