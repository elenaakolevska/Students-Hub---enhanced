import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './providers/authProvider';
import { BrowserRouter } from 'react-router-dom';

// Create a theme instance
const theme = createTheme();

// Create root for React 19
const root = ReactDOM.createRoot(document.getElementById('root'));

// Define the App with all providers
const AppWithProviders = () => (
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Render the app
root.render(<AppWithProviders />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
