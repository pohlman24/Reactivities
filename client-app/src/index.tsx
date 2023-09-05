import ReactDOM from 'react-dom/client';
import App from './app/layout/App';
import 'semantic-ui-css/semantic.min.css';
import './app/layout/styles.css';
import React from 'react';
import { StoreContext, store } from './app/stores/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>
);
