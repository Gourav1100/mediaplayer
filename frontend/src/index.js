// Import React Modules
import React from 'react';
import ReactDOM from 'react-dom';
// Bootstrap Imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Routing Modules
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// User Modules
import App from './App';
import Home from './pages/home';
import './index.css';
import Settings from './pages/settings';
import Player from './pages/player';
import reportWebVitals from './reportWebVitals';

// Render React DOM
ReactDOM.render(
  <div className='Body'>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={(<Home />)} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/player" element={<Player />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </div>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
