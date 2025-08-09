import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8900/api/catalog/products", {
          params: { name: searchQuery },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim()) {
      fetchSearchResults();
    }
  }, [searchQuery]); 

  const handleProductClick = (id) => {
    console.log("ProductID: ", id);
    navigate(`/product-detail/${id}`);
  };

  return (
    <section className="section-content padding-y">
       <Container className="my-3"> {/* my-3 để tạo margin trên và dưới */}
      <Row>
        <Col md={12}>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Trang chủ
            </Breadcrumb.Item>
         
            <Breadcrumb.Item active>
              <b>{searchQuery}</b>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
    </Container>
      <div className="container">
        <h2>Kết quả tìm kiếm cho: "{searchQuery}"</h2>
        {loading && <p>Loading...</p>}
        {!loading && products.length === 0 && <p>Không có sản phẩm tên "{searchQuery}".</p>}

        <div className="row">
          {!loading &&
            products.length > 0 &&
            products.map((row) => (
              <div
                className="col-md-3 col-sm-6 mb-4"
                key={row.id}
                onClick={() => handleProductClick(row.id)}
                style={{ cursor: "pointer" }}
              >
                <figure className="card card-product-grid">
                  <div className="img-wrap position-relative">
                    <span className="badge badge-danger position-absolute top-0 start-0 m-2">MỚI</span>
                    <img
                      src={require(`/public/images/products/${row.imageUrl}`)}
                      alt={row.imageUrl}
                      className="img-fluid"
                    />
                  </div>
                  <figcaption className="info-wrap p-3">
                    <a href="#" className="title mb-2 d-block text-truncate">
                      {row.productName}
                    </a>
                    <div className="price-wrap d-flex align-items-center justify-content-between">
       {row.priceSale == null ?
                            <div class="price-wrap">
                                <span class="price">{Number(row.price).toLocaleString()} VNĐ</span>
                                {/* <small class="text-muted">/sản phẩm</small> */}
                            </div>
                            : <div class="price-wrap d-flex  justify-content-center">
                                <small class="price"> <del>{Number(row.price).toLocaleString()} VNĐ</del></small> &nbsp; - &nbsp;<h6 class="price">  { (row.price * (1 - (row.priceSale / 100))).toLocaleString() }   VNĐ</h6>
                                {/* <small class="text-muted">/sản phẩm</small> */}
                            </div>
                        }
                      {/* <span className="price text-primary">{row.price.toLocaleString()} VND</span> */}
                    </div>
                    <hr />
                    <p className="mb-3">
                      <span className="tag">
                        <i className="fa fa-check text-success"></i> Còn hàng {row.availability}
                      </span>
                    </p>
                    <Link to={`product-detail/${row.id}`} className="btn btn-outline-primary btn-block">
                      Xem chi tiết
                    </Link>
                  </figcaption>
                </figure>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
