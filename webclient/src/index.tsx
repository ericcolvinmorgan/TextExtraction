import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeIcons, mergeStyles } from '@fluentui/react';

initializeIcons();

// Inject some global styles
mergeStyles({
  selectors: {
    ':global(body), :global(html), :global(#app)': {
      margin: 0,
      padding: 0,
      height: '100%'
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
