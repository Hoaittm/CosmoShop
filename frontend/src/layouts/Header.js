import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { GET_ALL, GET_CART } from "../api/apiService";
import axios from "axios";
import Cookies from "js-cookie";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { useSelector } from "react-redux";
function Header() {
 
    const { user } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const carts = localStorage.getItem("cart");
    const parsedCart = JSON.parse(carts);
    const [cartLength, setCartLength] = useState(0);
    const { cart } = useContext(CartContext);

    const favoriteProducts = useSelector(state => state.product.favoriteProducts);

    useEffect(() => {
        setLoading(true);
        GET_ALL("catalog/products")
            .then(response => {
                console.log("Products:", response);
                setProducts(response);
            })
            .catch(error => {
                console.error("Failed to fetch products:", error);
            })
            .finally(() => setLoading(false));
    }, []);
   
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            const response = await axios.get(`http://localhost:8900/api/catalog/products`, {
                params: { name: searchQuery },
            });
            setResults(response.data);
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");

    console.log("Sau khi navigate:", window.location.pathname);

        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        }
    };
  
      const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
      };
    
      // Đóng dropdown khi click bên ngoài
      const handleOutsideClick = (event) => {
        if (!event.target.closest(".nav-item.dropdown")) {
          setDropdownOpen(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
      }, []);
      const handleCategoryClick = (category) => {
        navigate(`/category?query=${category}`);
      };

    return (
        <header className="section-header">
            <section className="header-main border-bottom">
                <div className="container">
                    <div className="row align-items-center">
                   <div className="col-xl-2 col-lg-3 col-md-12 d-flex justify-content-center align-items-center">
  <Link to="/" className="brand-wrap">
    <img
      className="logo"
      src={require("../assets/images/logo3.jpg")}
      alt="Logo"
       style={{
    height: "100px",     // Tăng chiều cao tùy ý
    width: "auto",       // Giữ tỷ lệ ảnh
    maxHeight: "none",   // Ghi đè mọi giới hạn
    maxWidth: "100%",    // Đảm bảo không tràn
    objectFit: "contain" // Giữ hình ảnh đẹp
  }}
    />
  </Link>
</div>

                        <div className="col-xl-6 col-lg-5 col-md-6">
                            <form onSubmit={handleSearchSubmit} className="search-header">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm"
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                    />
                                 

                                    <button type="submit" className="btn btn-primary">
                                        Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="widgets-wrap float-md-right">
                                 <div class="widget-header mr-3">
                                    <Link to="/favorite-list" class="widget-view">
                                        <div class="icon-area">
                                            <i class="fa fa-heart" aria-hidden="true"></i>
                                            <span class="notify">{favoriteProducts.length}</span>
                                        </div>
                                        <small class="text"> Yêu thích </small>
                                    </Link>
                                </div>
                                <div className="widget-header mr-3">
                                    <Link to="/profile" className="widget-view">
                                        <div className="icon-area">
                                            <i className="fa fa-user"></i>
                              
                                        </div>
                                        <small className="text">{user ? user.username : "Người dùng"}</small>
                                    </Link>
                                </div>
                                
                                <div className="widget-header mr-3">
                                    <Link to="/order" className="widget-view">
                                        <div className="icon-area">
                                            <i className="fa fa-store"></i>
                                        </div>
                                        <small className="text">Đơn hàng</small>
                                    </Link>
                                </div>
                                <div className="widget-header">
                                    <Link to="/cart" className="widget-view">
                                        <div className="icon-area">
                                            <i className="fa fa-shopping-cart"></i>
                                            <span className="notify">{cart.length}</span>
                                        </div>
                                        <small className="text">Giỏ hàng</small>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        <Navbar expand="lg" className="border-bottom" bg="light">
  <Container>
    <Navbar.Toggle aria-controls="main-navbar" />
    <Navbar.Collapse id="main-navbar" className="justify-content-center">
      <Nav className="mx-auto text-center" style={{ gap: '2rem' }}>
        {/* TRANG CHỦ như các mục khác */}
        <Nav.Link as={Link} to="/" className="d-flex align-items-center">
          <i className="fa fa-bars text-muted me-2"></i> TRANG CHỦ
        </Nav.Link>

       <NavDropdown
  title="DANH MỤC"
  id="category-dropdown"
  show={isDropdownOpen}
  onMouseEnter={() => setDropdownOpen(true)}
  onMouseLeave={() => setDropdownOpen(false)}
  className="text-center"
>
  {loading ? (
    <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
  ) : (
    [...new Set(products.map(item => item.category))].map((category, index) => (
      <NavDropdown.Item
        as={Link} // dùng Link trong NavDropdown.Item
        to={`/${category}`} // điều hướng
        key={index}
        onClick={() => handleCategoryClick(category)} // gọi hàm xử lý
        className="custom-hover"
        style={{ textDecoration: "none" }}
      >
        {category}
      </NavDropdown.Item>
    ))
  )}
</NavDropdown>
        <Nav.Link as={Link} to="/products">TẤT CẢ SẢN PHẨM</Nav.Link>
        <Nav.Link as={Link} to="/blogs">BÀI VIẾT</Nav.Link>
<Nav.Link as={Link} to="/contact">LIÊN HỆ</Nav.Link>
<Nav.Link as={Link} to="/coupon">MÃ GIẢM GIÁ</Nav.Link>
        {user ? (
          <Nav.Link as={Link} to="/logout">ĐĂNG XUẤT</Nav.Link>
        ) : (
          <>
            <Nav.Link as={Link} to="/signup">ĐĂNG KÝ</Nav.Link>
            <Nav.Link as={Link} to="/login">ĐĂNG NHẬP</Nav.Link>
          </>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

        </header>
    );
}

export default Header;
