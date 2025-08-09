import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN } from '../../../api/apiService';
import UserContext from '../../../context/UserContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-toastify';
const LoginContent = () => {
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const body = { userName, userPassword };

        try {
            const response = await LOGIN('/accounts/login', body);

            if (response) {
                localStorage.setItem("username", response.userName);
                localStorage.setItem("userID", response.id);
                setUser({ username: response.userName, userID: response.id });
                toast.success("Đăng nhập thành công!");
                navigate("/");
            } else {
               toast.error("Không nhận được phản hồi từ server.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
               toast.warn("Sai tên đăng nhập hoặc mật khẩu.");
            } else {
                toast.error("Đăng nhập thất bại: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };
  const handleGoogleLogin = async (token) => {
        try {
            const response = await axios.post(
                "http://localhost:8900/api/accounts/google-login",
                { token },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Google login user: ", response.data);

            localStorage.setItem("username", response.data.name);
            localStorage.setItem("email", response.data.email);
            setUser({   userID: response.data.id,   username: response.data.email, email: response.data.email });

           toast.success("Đăng nhập thành công")

            navigate('/');
        } catch (error) {
            console.error("Google login failed: ", error);
          toast.error("Đăng nhập thất bại " )
        }
    };
           useEffect(() => {
        const handleCredentialResponse = (response) => {
            console.log("Encoded JWT ID token: " + response.credential);
            handleGoogleLogin(response.credential);
        };

        // Load Google Identity script
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: '1061989329768-4p1iqm0bsukk85s09tfogo6nmbtvnjrj.apps.googleusercontent.com', // 👉 Thay bằng Client ID thật
                    callback: handleCredentialResponse
                });
                window.google.accounts.id.prompt(); // Hiển thị popup nếu cần
            }
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup nếu cần (ví dụ remove script)
            document.body.removeChild(script);
        };
    }, []);


    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "84vh" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: '4rem', height: '4rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <section className="d-flex justify-content-center" style={{ minHeight: "84vh", paddingTop: "15vh" }}>
            <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "10px", backgroundColor: "#f8f9fa", height: '44vh' }}>
                <h3 className="text-center mb-4 fw-bold" style={{ color: '#ff6600' }}>ĐĂNG NHẬP</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 input-group">
                        <span className="input-group-text bg-white" style={{ color: '#ff6600' }}>
                            <i className="fa fa-user"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tên đăng nhập/email"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 input-group">
                        <span className="input-group-text bg-white" style={{ color: '#ff6600' }}>
                            <i className="fa fa-lock"></i>
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Mật khẩu"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            required
                        />
                    </div>
  <div className="text-center mt-3">
                    <p className="mb-2">Hoặc</p>
                      <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    handleGoogleLogin(credentialResponse.credential);
                                }}
                                onError={() => {
                                    console.log('Google Login Failed');
                                }}
                                size="large"
                                width="100%"
                            />
                </div>
                    <button type="submit" className="btn btn-warning w-100 py-2 fw-semibold">
                        Đăng nhập
                    </button>
                </form>

                <p className="text-center mt-3 mb-0">
                    Bạn chưa có tài khoản? <Link to="/signup" className="text-warning fw-semibold">Đăng ký</Link>
                </p>
            </div>
        </section>
    );
};

export default LoginContent;
