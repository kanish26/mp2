/* Entry file: wires up React Router and your App. */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    {/* Use your GH repo name here if deploying to GH Pages */}
    <BrowserRouter basename="/mp2">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);