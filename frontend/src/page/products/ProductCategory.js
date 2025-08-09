import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios"; 
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";

const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8900/api/catalog/products", {
          params: { category: category },
        });
        setCategories(response.data);
        console.log("dsfsd:", response.data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

   
      fetchSearchResults();
  
  }, [category]); 

  const handleProductClick = (id) => {
    console.log("ProductID: ", id);
    navigate(`/product-detail/${id}`);
  };

  return (
    <section className="section-content padding-y">
      <div className="container">
                  <Container className="my-3"> {/* my-3 để tạo margin trên và dưới */}
      <Row>
        <Col md={12}>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Trang chủ
            </Breadcrumb.Item>
         
            <Breadcrumb.Item active>
              <b>{category}</b>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
    </Container>
        <h1 style={{ textAlign:'center' }}>{category}</h1>
        {loading && <p>Loading...</p>}
        {!loading && categories.length === 0 && <p>No categories found for "{category}".</p>}

        <div className="row">
          {!loading &&
            categories.length > 0 &&
            categories.map((row) => (
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
                      {/* <del className="price text-muted text-decoration-line-through mr-2">
                        {row.product.price} VND
                      </del> */}
                      {row.priceSale == null ?
                            <div class="price-wrap">
                                <span class="price">{Number(row.price).toLocaleString()} VNĐ</span>
                                {/* <small class="text-muted">/sản phẩm</small> */}
                            </div>
                            : <div class="price-wrap d-flex  justify-content-center">
                                <small class="price"> <del>{Number(row.price).toLocaleString()} VNĐ</del></small> &nbsp; - &nbsp;<h6 class="price">  { (row.price * (1 - (row.priceSale / 100))).toLocaleString() }  VNĐ</h6>
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
                    <a href="#" className="btn btn-outline-primary btn-block">
                      Xem chi tiết
                    </a>
                  </figcaption>
                </figure>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategory;
