import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../../api/apiService';
import { toast } from 'react-toastify';

const Login = () => {
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const body = { userName, userPassword };

        try {
            const response = await LOGIN('/accounts/login', body);
            console.log("data: ", response);

            if (response) {
                if (response.role && response.role.roleName === "ADMIN") {
                    localStorage.setItem("userName", response.userName);
                    localStorage.setItem("userID", response.id);
                   toast.success("Đăng nhập thành công với quyền ADMIN!");
                    navigate("/admin/dashboard/page");
                } else {
                    toast.warn("Xin lỗi, bạn không phải là ADMIN nên không thể đăng nhập.");
                }
            } else {
                toast.error("Không nhận được phản hồi từ máy chủ.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
               toast.warn("Sai tài khoản hoặc mật khẩu.");
            } else {
               toast.error("Đăng nhập thất bại: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "420px", borderRadius: "15px" }}>
                <h2 className="text-center mb-4 text-primary fw-bold">Đăng Nhập Admin</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            id="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            id="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 btn-lg shadow-sm">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
