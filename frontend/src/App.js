import './App.css';
import Header from './layouts/Header';
import './assets/app.scss';
import Footer from './layouts/Footer';
import Main from './layouts/Main';
import { Route, Router, Routes } from 'react-router-dom';
import AdminRoutes from './routes/adminRoutes';
import ClientRoutes from './routes/clientRoutes';
import Dashboard from './admin/layouts/Dashboard';
// Cách import Bootstrap Icons trong React:
import 'bootstrap-icons/font/bootstrap-icons.css';
import "animate.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './admin/pages/Login';
import { ToastContainer } from 'react-toastify';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';


//  import 'bootstrap/dist/css/bootstrap.min.css';
//  import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const initialOptions = {
        "client-id": 'AY7GrfYH7z7Dai8jDZBIaJrDUzD0F_jpg_DbUUeN8Rz0Kal0ghHCpU3Fg5JOXg88Ui9d95ub9zGJg2OG',
        currency: "USD",
        intent: "capture",
        // Thêm các options khác nếu cần, ví dụ: "data-sdk-integration-source": "integrationbuilder"
        // "data-client-token": "abc12345...", // Nếu bạn dùng client token
    };
  return (
    <div>
      <ToastContainer
        position="top-right" // Vị trí hiển thị (có thể thay đổi)
        autoClose={1000} // Tự động đóng sau 5 giây
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // "light", "dark", "colored"
      />
      <PayPalScriptProvider options={initialOptions}>
      
      <Routes>
            <Route path='/' element={<Main />} >
              {
                ClientRoutes.map((router, index) => {
                  const Page = router.component;
                  return <Route key={index} path={router.path} element={<Page />} />;
                })
              }
            </Route>
           
    
            {/* -------------------------------------------------- */}
         <Route path="/admin" element={<Login />} />

            <Route path='/admin/dashboard' element={<Dashboard />} >
              {       
                AdminRoutes.map((router, index) => {
                  const Page = router.component;
                  return <Route key={index} path={router.path} element={<Page />} />;
                })
              }
            </Route>
          </Routes>
                  </PayPalScriptProvider>
    </div>
  );
}

export default App;
