import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GET_ALL } from '../api/apiService';
// Make sure the path is correct

const Footer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    GET_ALL('catalog/products')
      .then(response => {
        setProducts(response);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category?query=${category}`);
  };

  return (
    <footer className="section-footer bg-secondary mt-4">
      <div className="container">
        <section className="footer-top padding-y-lg text-white">
          <div className="row">
            <aside className="col-md col-6">
              <h6 className="title">Danh mục</h6>
              <ul className="menu-category" style={{ listStyleType:'none' }}>
                {!loading &&
                  [...new Set(products.map(item => item.category))].map((category, index) => (
                    <li key={index}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="#"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                {loading && <p>Loading...</p>}
              </ul>
            </aside>

           <aside className="col-md col-6">
  <h6 className="title">Công ty</h6>
  <ul className="list-unstyled">
    <li><a href="#">Về chúng tôi</a></li>
    <li><a href="#">Tuyển dụng</a></li>
    <li><a href="#">Tìm cửa hàng</a></li>
    <li><a href="#">Quy định và điều khoản</a></li>
    <li><a href="#">Sơ đồ trang</a></li>
  </ul>
</aside>

<aside className="col-md col-6">
  <h6 className="title">Hỗ trợ</h6>
  <ul className="list-unstyled">
    <li><a href="#">Liên hệ</a></li>
    <li><a href="#">Hoàn tiền</a></li>
    <li><a href="#">Tình trạng đơn hàng</a></li>
    <li><a href="#">Thông tin vận chuyển</a></li>
    <li><a href="#">Khiếu nại</a></li>
  </ul>
</aside>

<aside className="col-md col-6">
  <h6 className="title">Tài khoản</h6>
  <ul className="list-unstyled">
    <li><a href="#">Đăng nhập</a></li>
    <li><a href="#">Đăng ký</a></li>
    <li><a href="#">Cài đặt tài khoản</a></li>
    <li><a href="#">Đơn hàng của tôi</a></li>
  </ul>
</aside>

<aside className="col-md">
  <h6 className="title">Mạng xã hội</h6>
  <ul className="list-unstyled">
    <li><a href="#"><i className="fab fa-facebook"></i> Facebook</a></li>
    <li><a href="#"><i className="fab fa-twitter"></i> Twitter</a></li>
    <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
    <li><a href="#"><i className="fab fa-youtube"></i> Youtube</a></li>
  </ul>
</aside>

          </div>
        </section>

        <section className="footer-bottom text-center">
  <p className="text-white">Chính sách bảo mật - Điều khoản sử dụng - Hướng dẫn pháp lý về thông tin người dùng</p>
  <p className="text-muted"> &copy; 2019 Tên công ty, Bảo lưu mọi quyền </p>
  <br />
</section>

      </div>
    </footer>
  );
};

export default Footer;
