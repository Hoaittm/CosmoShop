import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';

const Header = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const { user } = useContext(UserContext);

    const toggleDropdown = (menu) => {
        setOpenDropdown((prev) => (prev === menu ? null : menu));
    };

    return (
        <div className="content">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" role="button">
                            <i className="fas fa-bars"></i>
                        </a>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <Link to="/admin/dashboard/page" className="nav-link">Trang chủ</Link>
                    </li>
                    {/* <li className="nav-item d-none d-sm-inline-block">
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </li> */}
                </ul>

                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="navbar-search" role="button">
                            <i className="fas fa-search"></i>
                        </a>
                        <div className="navbar-search-block">
                            <form className="form-inline">
                                <div className="input-group input-group-sm">
                                    <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
                                    <div className="input-group-append">
                                        <button className="btn btn-navbar" type="submit">
                                            <i className="fas fa-search"></i>
                                        </button>
                                        <button className="btn btn-navbar" type="button" data-widget="navbar-search">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>
                </ul>
            </nav>

            {/* Sidebar */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4 fixed-left">
                <Link to="/" className="brand-link">
                    <img src={require("../../assets/images/logo3.jpg")} alt="Logo" className="brand-image img-circle elevation-3" style={{ opacity: 0.8 }} />
                    <span className="brand-text font-weight-light">Veya Shop</span>
                </Link>

                <div className="sidebar h-200">
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
         <li className={`nav-item ${openDropdown === "product" ? "menu-open" : ""}`}>
                              <Link to="page" className="nav-link">
                                    <i className="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                       Trang chủ
                                        {/* <i className="right fas fa-angle-left"></i> */}
                                    </p>
                             </Link>
                                
                            </li>
                            {/* Quản lý sản phẩm */}
                            <li className={`nav-item ${openDropdown === "product" ? "menu-open" : ""}`}>
                              <Link to="all-product" className="nav-link">
                                    <i className="nav-icon fas fa-box"></i>
                                    <p>
                                        Quản lý sản phẩm
                                        {/* <i className="right fas fa-angle-left"></i> */}
                                    </p>
                             </Link>
                                
                            </li>

                            {/* Quản lý người dùng */}
                            <li className="nav-item">
                                <Link to="all-user" className="nav-link">
                                    <i className="nav-icon fas fa-user"></i>
                                    <p>Quản lý người dùng</p>
                                </Link>
                            </li>

                            {/* Quản lý đơn hàng */}
                            <li className="nav-item">
                                <Link to="order" className="nav-link">
                                    <i className="nav-icon fas fa-shopping-cart"></i>
                                    <p>Quản lý đơn hàng</p>
                                </Link>
                            </li>

                            {/* Quản lý mã khuyến mãi */}
                            <li className="nav-item">
                                <Link to="coupon" className="nav-link">
                                    <i className="nav-icon fas fa-tags"></i>
                                    <p>Quản lý mã khuyến mãi</p>
                                </Link>
                            </li>
                             <li className="nav-item">
                                <Link to="contact" className="nav-link">
                                    <i className="nav-icon fas fa-tags"></i>
                                    <p>Phản hồi người dùng</p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            <aside className="control-sidebar control-sidebar-dark" ></aside>
        </div>
    );
};

export default Header;
