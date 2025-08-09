import React, { useEffect, useState } from 'react';
import { GET_ALL } from '../../api/apiService';
import { Link } from 'react-router-dom';

const DashboardContent = () => {
      const [totalOrders, setTotalOrders] = useState(0); 
            const [totalProducts, setTotalProducts] = useState(0);
               const [totalUsers, setTotalUsers] = useState(0);
  const [totalCoupons   , setTotalCoupons] = useState(0);// State để lưu tổng số đơn hàng
        const [loading, setLoading] = useState(true);
       useEffect(() => {
        const fetchAndCountOrders = async () => {
            setLoading(true);
            try {
                // Gọi API để lấy tất cả đơn hàng
                const response = await GET_ALL(`/shop/order`); // Sử dụng hàm GET_ALL của bạn
                console.log("Dữ liệu đơn hàng:", response);

                // Kiểm tra nếu response là một mảng và tính tổng số đơn hàng
                if (Array.isArray(response)) {
                    setTotalOrders(response.length); // TỔNG số đơn hàng
                } else {
                    console.error("API /shop/order không trả về một mảng đơn hàng.", response);
                    setTotalOrders('Lỗi'); // Hiển thị lỗi nếu không phải mảng
                }
            } catch (error) {
                console.error('Lỗi khi lấy và tổng hợp đơn hàng:', error);
                setTotalOrders('Lỗi'); // Hiển thị lỗi khi có lỗi network/server
            } finally {
                setLoading(false); // Dù thành công hay thất bại, đặt loading về false
            }
        };

        fetchAndCountOrders();
    }, []); 
      useEffect(() => {
        const fetchAndCountProduct = async () => {
            setLoading(true);
            try {
                // Gọi API để lấy tất cả đơn hàng
                const response = await GET_ALL(`/catalog/products`); // Sử dụng hàm GET_ALL của bạn
                console.log("Dữ liệu sản phẩm:", response);

                // Kiểm tra nếu response là một mảng và tính tổng số đơn hàng
                if (Array.isArray(response)) {
                    setTotalProducts(response.length); // TỔNG số đơn hàng
                } else {
                    console.error("API /shop/order không trả về một mảng đơn hàng.", response);
                    setTotalProducts('Lỗi'); // Hiển thị lỗi nếu không phải mảng
                }
            } catch (error) {
                console.error('Lỗi khi lấy và tổng hợp đơn hàng:', error);
                setTotalProducts('Lỗi'); // Hiển thị lỗi khi có lỗi network/server
            } finally {
                setLoading(false); // Dù thành công hay thất bại, đặt loading về false
            }
        };

        fetchAndCountProduct();
    }, []); 
      useEffect(() => {
        const fetchAndCountUser = async () => {
            setLoading(true);
            try {
                // Gọi API để lấy tất cả đơn hàng
                const response = await GET_ALL(`/accounts/users`); // Sử dụng hàm GET_ALL của bạn
                console.log("Dữ liệu người dùng:", response);

                // Kiểm tra nếu response là một mảng và tính tổng số đơn hàng
                if (Array.isArray(response)) {
                    setTotalUsers(response.length); // TỔNG số đơn hàng
                } else {
                    console.error("API /shop/order không trả về một mảng đơn hàng.", response);
                    setTotalUsers('Lỗi'); // Hiển thị lỗi nếu không phải mảng
                }
            } catch (error) {
                console.error('Lỗi khi lấy và tổng hợp đơn hàng:', error);
                setTotalUsers('Lỗi'); // Hiển thị lỗi khi có lỗi network/server
            } finally {
                setLoading(false); // Dù thành công hay thất bại, đặt loading về false
            }
        };

        fetchAndCountUser();
    }, []); 
      useEffect(() => {
        const fetchAndCountCoupon = async () => {
            setLoading(true);
            try {
                // Gọi API để lấy tất cả đơn hàng
                const response = await GET_ALL(`/discount/coupons`); // Sử dụng hàm GET_ALL của bạn
                console.log("Dữ liệu người dùng:", response);

                // Kiểm tra nếu response là một mảng và tính tổng số đơn hàng
                if (Array.isArray(response)) {
                    setTotalCoupons(response.length); // TỔNG số đơn hàng
                } else {
                    console.error("API /shop/order không trả về một mảng đơn hàng.", response);
                    setTotalCoupons('Lỗi'); // Hiển thị lỗi nếu không phải mảng
                }
            } catch (error) {
                console.error('Lỗi khi lấy và tổng hợp đơn hàng:', error);
                setTotalCoupons('Lỗi'); // Hiển thị lỗi khi có lỗi network/server
            } finally {
                setLoading(false); // Dù thành công hay thất bại, đặt loading về false
            }
        };

        fetchAndCountCoupon();
    }, []); 
    
    return (
        <>
            <div className="row mb-2">
                <div className="col-sm-6">
                    <h1 className="m-0">Trang quản lý</h1>
                </div>
              
            </div>

            {/* Small boxes (Stat box) */}
            <div className="row">
               <div className="col-lg-3 col-6">
                            <div className="small-box bg-info">
                                <div className="inner">
                                    <h3>{loading ? 'Đang tải...' : totalOrders}</h3> {/* Hiển thị TỔNG số đơn hàng */}
                                    <p>Tổng số đơn hàng</p> {/* Đổi text cho phù hợp */}
                                </div>
                                <div className="icon">
                                    <i className="ion ion-bag"></i>
                                </div>
                                <Link to="/admin/dashboard/order" className="small-box-footer">
                                    Xem thêm <i className="fas fa-arrow-circle-right"></i>
                                </Link>
                            </div>
                        </div>
                <div className="col-lg-3 col-6">
                    <div className="small-box bg-success">
                        <div className="inner">
                                    <h3>{loading ? 'Đang tải...' : totalProducts}</h3> {/* Hiển thị TỔNG số đơn hàng */}
                                    <p>Tổng số sản phẩm</p> {/* Đổi text cho phù hợp */}
                                </div>
                        <div className="icon">
                            <i className="ion ion-stats-bars"></i>
                        </div>
                       <Link to="/admin/dashboard/all-product" className="small-box-footer">
                                    Xem thêm <i className="fas fa-arrow-circle-right"></i>
                                </Link>
                    </div>
                </div>
                <div className="col-lg-3 col-6">
                    <div className="small-box bg-warning">
                        <div className="inner">
                          <h3>{loading ? 'Đang tải...' : totalUsers}</h3>
                            <p>Người dùng đăng ký</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-person-add"></i>
                        </div>
                       <Link to="/admin/dashboard/all-user" className="small-box-footer">
                                    Xem thêm <i className="fas fa-arrow-circle-right"></i>
                                </Link>
                    </div>
                </div>
                <div className="col-lg-3 col-6">
                    <div className="small-box bg-danger">
                        <div className="inner">
                           <h3>{loading ? 'Đang tải...' : totalCoupons}</h3>
                            <p>Mã khuyến mãi</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-pie-graph"></i>
                        </div>
                       <Link to="/admin/dashboard/coupon" className="small-box-footer">
                                    Xem thêm <i className="fas fa-arrow-circle-right"></i>
                                </Link>
                    </div>
                </div>
            </div>
            {/* /.row */}

            {/* Main row */}
         
            {/* /.row (main row) */}
        </>
    );
};

export default DashboardContent;