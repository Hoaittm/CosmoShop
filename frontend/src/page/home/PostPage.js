import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Image, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PostPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  <h2 className="mb-4">Cẩm nang làm đẹp</h2>
  <Row>
    {posts.slice(0, 6).map((post, idx) => {
      const imageId = post.imageUrl?.split("/d/")[1]?.split("/")[0];
      const thumbnailUrl = imageId
        ? `https://drive.google.com/thumbnail?id=${imageId}`
        : "https://via.placeholder.com/150";

      return (
        <Col key={idx} xs={12} sm={6} md={4} lg={2} className="mb-4">
          <div
            style={{
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() =>
              navigate(`/blogs/${encodeURIComponent(post.title)}`)
            }
          >
            <Image
              src={thumbnailUrl}
              fluid
              rounded
              style={{
                height: "220px",           // 📌 To hơn
                objectFit: "cover",
                width: "100%",
              }}
            />
            <h6
              style={{
                marginTop: "12px",
                fontSize: "1rem",           // 📌 Cỡ chữ lớn hơn
                fontWeight: 700,            // 📌 In đậm hơn
                color: "#222",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,         // 📌 Cho phép hiển thị 2 dòng
                WebkitBoxOrient: "vertical",
              }}
              title={post.title}
            >
              {post.title}
            </h6>
          </div>
        </Col>
      );
    })}
  </Row>
</Container>

  );
}

export default PostPage;
