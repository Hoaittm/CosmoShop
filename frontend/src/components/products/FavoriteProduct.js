import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/products/productCard';
import { useSelector } from 'react-redux';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';

const FavoriteProduct = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const favoriteProducts = useSelector(state => state.product.favoriteProducts);
    useEffect(() => {
        const storedProducts = localStorage.getItem("product");
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        }
        setLoading(false);
    }, []);

    console.log("Product in list: ", products)
    return (
        <section className="section-content padding-y">
            <div className="container">
            <Container className="my-3">
        <Row>
          <Col md={12}>
            <Breadcrumb>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Trang chủ
              </Breadcrumb.Item>
             
               <Breadcrumb.Item active>
     Sản phẩm yêu thích
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
      </Container>


              <div
  className="favorite-products"
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",  // khoảng cách giữa các phần tử
  }}
>
  {loading ? (
    <p>Loading...</p>
  ) : (
    favoriteProducts.length > 0 ? (
      favoriteProducts.map((product, idx) => (
        <div
          key={idx}
          style={{
            flex: "0 0 25%",  // 25% width = 4 sp / hàng
            boxSizing: "border-box",
          }}
        >
          <ProductCard product={product} />
        </div>
      ))
    ) : (
      <p>Không có sản phẩm yêu thích nào.</p>
    )
  )}
</div>

            </div>

            <div className="box text-center">
                <p>Bạn đã tìm thấy điều bạn cần tìm？</p>
                <Link to="#" className="btn btn-light">Có</Link>
                <Link to="#" className="btn btn-light">Không</Link>
            </div>
        </section>
    );
};

export default FavoriteProduct;
