import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Spinner,
  Card,
  Row,
  Col,
  Image,
  Alert,
  ListGroup,
  Breadcrumb,
} from "react-bootstrap";

function PostDetail() {
  const { title } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8900/api/deepseek/import")
      .then((res) => {
        setPosts(res.data);
        const foundPost = res.data.find((p) => p.title === title);
        setPost(foundPost);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải bài viết chi tiết:", err);
        setLoading(false);
      });
  }, [title]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <div>Đang tải chi tiết bài viết...</div>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <h4>Không tìm thấy bài viết.</h4>
        </Alert>
      </Container>
    );
  }

  const getThumbnail = (url) => {
    const imageId = url?.split("/d/")[1]?.split("/")[0];
    return imageId
      ? `https://drive.google.com/thumbnail?id=${imageId}`
      : "https://via.placeholder.com/150";
  };
const renderContentWithFormatting = (content) => {
    if (!content) return null;

    // Tách nội dung thành các đoạn dựa trên 2 hoặc nhiều dấu xuống dòng (paragraph breaks)
    const paragraphs = content.split(/\n{2,}/);

    return paragraphs.map((paragraph, index) => {
        let trimmedParagraph = paragraph.trim();

        // 1. Xử lý các tiêu đề cấp 2 (##) - ẩn chúng đi
        if (trimmedParagraph.startsWith('## ')) {
            return null; // Trả về null để ẩn tiêu đề cấp 2
        }

        // 2. Xử lý các mục danh sách có dấu gạch đầu dòng (*) và thụt lề
  if (trimmedParagraph.startsWith('* ')) {
            // Loại bỏ dấu '*' và giữ nguyên nội dung (không in đậm)
            let listItemContent = trimmedParagraph.substring(2); 
            return (
                <p
                    key={index}
                    style={{
                        lineHeight: 1.8,
                        fontSize: "1.1rem",
                        marginBottom: "0.5rem",
                        marginLeft: "2rem", // Chỉ thụt lề vào
                        // Bỏ textIndent và position relative vì không dùng bullet point
                    }}
                    // Chỉ hiển thị nội dung, không có dấu chấm tròn
                    dangerouslySetInnerHTML={{ __html: listItemContent }} 
                />
            );
        }
        // 3. Các đoạn văn bản còn lại: chỉ xử lý **in đậm**
        // Không kiểm tra startsWithManualNumber nữa vì không đánh số tự động.
        // Chỉ cần áp dụng định dạng in đậm.
        let finalParagraphContent = trimmedParagraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Trả về một <p> với nội dung đã xử lý
        return (
            <p
                key={index}
                style={{
                    lineHeight: 1.8,
                    fontSize: "1.1rem",
                    marginBottom: "1rem",
                }}
                dangerouslySetInnerHTML={{ __html: finalParagraphContent }}
            />
        );
    });
};
  return (
    <Container className="my-5">
      <Container className="my-3">
        <Row>
          <Col md={12}>
            <Breadcrumb>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Trang chủ
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/blogs" }}>
                Tất cả bài viết
              </Breadcrumb.Item>
               <Breadcrumb.Item active>
               {post.title}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
      </Container>

      <Row>
        {/* Cột trái: nội dung bài viết */}
        <Col md={8}>
          <Card className="shadow mb-4">
            <Card.Body>
              {/* Tiêu đề */}
       <Row className="justify-content-center mb-4">
  <Col md={10} className="text-center">
    <h1 className="text" style={{ color:'black' }}>
      {post.title}
    </h1>
  </Col>
</Row>


              {/* Hình ảnh */}
              <Row className="justify-content-center mb-4">
                <Col md={10} className="text-center">
                  <Image
                    src={getThumbnail(post.imageUrl)}
                    fluid
                    rounded
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                </Col>
              </Row>

              <hr />

              {/* Nội dung */}
              <Row>
                <Col>
                  {renderContentWithFormatting(post.content)} {/* GỌI HÀM MỚI Ở ĐÂY */}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Cột phải: danh sách các bài viết khác */}
        <Col md={4}>
          <h4 className="mb-3">Bài viết khác</h4>
          <ListGroup variant="flush">
            {posts
             .slice(0, 9) 
              .filter((p) => p.title !== post.title)
              .map((p, idx) => (
                <ListGroup.Item
                  key={idx}
                  className="d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/blogs/${p.title}`)}
                >
                  <Image
                    src={getThumbnail(p.imageUrl)}
                    rounded
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                  <span>{p.title}</span>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default PostDetail;
