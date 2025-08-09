import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import ProductCard from '../../components/products/productCard'; // Giữ nguyên nếu bạn đã có component
import { Link } from 'react-router-dom';

const SectionProducts = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'asc',
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProducts = async () => {
    setLoading(true);
    const params = {
      keyword: filters.keyword,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy: 'price',
      direction: filters.sort,
    };

    try {
      const res = await axios.get('http://localhost:8900/api/catalog/filter', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi khi gọi API lọc sản phẩm:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    setCurrentPage(1);
  }, [filters]);

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
  
    <Container className="my-4">
          <Container className="my-3"> {/* my-3 để tạo margin trên và dưới */}
      <Row>
        <Col md={12}>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Trang chủ
            </Breadcrumb.Item>
         
            <Breadcrumb.Item active>
            Tất cả sản phẩm
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      </Container>
      <Row>
        {/* Cột lọc sản phẩm bên trái */}
        <Col md={3}>
          <h4>Lọc sản phẩm</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Từ khóa..."
                name="keyword"
                value={filters.keyword}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Danh mục..."
                name="category"
                value={filters.category}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="Giá từ..."
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="Giá đến..."
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select name="sort" value={filters.sort} onChange={handleChange}>
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" onClick={fetchProducts}>
              Lọc
            </Button>
          </Form>
        </Col>

        {/* Cột danh sách sản phẩm bên phải */}
        <Col md={9}>
          <h4>Tất cả sản phẩm</h4>
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : currentItems.length === 0 ? (
            <p>Không có sản phẩm phù hợp</p>
          ) : (
            <Row>
              {currentItems.map((product) => (
                <Col key={product.id} md={4} className="mb-4">
                   <div style={{ width: '100%' }}>
                      <ProductCard product={product} />
                   </div>
                
                </Col>
              ))}
            </Row>
          )}

          {/* Phân trang */}
          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="me-2"
            >
              &laquo;
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={index + 1 === currentPage ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </Button>
          </div>

          <div className="text-center mt-4">
            <p>Bạn đã tìm thấy điều bạn cần tìm？</p>
            <Link to="#" className="btn btn-outline-success me-2">
              Có
            </Link>
            <Link to="#" className="btn btn-outline-danger">
              Không
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
   
  );
};

export default SectionProducts;
