import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Provider } from 'react-redux';
import store from './redux/store';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import ChatBot from './layouts/Chatbot';
import { GoogleOAuthProvider } from '@react-oauth/google';

const client_id= '1061989329768-4p1iqm0bsukk85s09tfogo6nmbtvnjrj.apps.googleusercontent.com'
console.log("Google Client ID: ",client_id)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <GoogleOAuthProvider clientId={client_id}>
   <Provider store={store}>

    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <ProductProvider>
            {/* <ChatBot /> */}
            <App />
          </ProductProvider>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
   
  </Provider>
   </GoogleOAuthProvider>
);