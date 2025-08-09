import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import "../assets/css/adminlte.min.css";
import "../assets/css/adminlte.css";
import "../../App.css";
import Footer from './Footer';
import Header from './Header';
import DashboardContent from './Admin';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userName = localStorage.getItem("userName");
        const userID = localStorage.getItem("userID");

        // Nếu chưa login thì điều hướng về trang login admin
        if (!userName || !userID) {
            alert("Vui lòng đăng nhập để truy cập trang Admin.");
            navigate("/admin/login");
        }
    }, [navigate]);

    return (
        <div className='text-black'>
            <Header />
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
