import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Breadcrumb, Card, Pagination } from "react-bootstrap"; // Import Pagination
import { Link, useNavigate } from "react-router-dom";

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Tính toán các mục hiện tại và tổng số trang dựa trên 'posts'
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  useEffect(() => {
    axios
      .get("http://localhost:8900/api/deepseek/import")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải bài viết:", err);
        setLoading(false);
      });
  }, []);

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Có thể cuộn lên đầu trang sau khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <div>Đang tải bài viết...</div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Breadcrumb Section */}
      <Container className="my-3">
        <Row>
          <Col md={12}>
            <Breadcrumb>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Trang chủ
              </Breadcrumb.Item>
              <Breadcrumb.Item active>
                Tất cả bài viết
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
      </Container>

      <h2 className="mb-4 text-center">Danh sách bài viết</h2> {/* Căn giữa tiêu đề */}

      {/* Posts Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {currentItems.map((post, idx) => { // Dùng currentItems để hiển thị bài viết của trang hiện tại
          const imageId = post.imageUrl?.split("/d/")[1]?.split("/")[0];
          const thumbnailUrl = imageId
            ? `https://drive.google.com/thumbnail?id=${imageId}`
            : "https://via.placeholder.com/400x250";

          return (
            <Col key={idx}>
              <Card
                className="h-100 shadow-sm"
                style={{ cursor: "pointer" }}
                // Bỏ onClick trên Card để tránh xung đột với Link trên Title
                // onClick={() => navigate(`/blogs/${encodeURIComponent(post.title)}`)}
              >
                <Card.Img
                  variant="top"
                  src={thumbnailUrl}
                  alt={post.title}
                  style={{ height: '280px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title
                    className="text-dark fw-bold mb-2"
                    style={{ fontSize: '1.25rem', lineHeight: '1.4' }}
                  >
                    <Link
                      to={`/blogs/${encodeURIComponent(post.title)}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {post.title}
                    </Link>
                  </Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    {post.content
                      ? post.content.substring(0, 100) + '...'
                      : 'Không có mô tả.'
                    }
                  </Card.Text>
                  {/* Bỏ nút "Đọc thêm" nếu Card.Title đã là link */}
                  {/* <div className="mt-auto">
                    <Link to={`/blogs/${encodeURIComponent(post.title)}`} className="btn btn-outline-primary btn-sm">
                      Đọc thêm
                    </Link>
                  </div> */}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Pagination Section */}
      {totalPages > 1 && ( // Chỉ hiển thị phân trang nếu có nhiều hơn 1 trang
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}
    </Container>
  );
}

export default Post;