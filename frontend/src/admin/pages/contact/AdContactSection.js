import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Badge,
  Stack,
} from "react-bootstrap";

const AdminContactPanel = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:8900/api/contact");
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi khi tải phản ánh:", err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleReply = async () => {
    if (!selectedContactId || !replyContent.trim()) return;
    try {
      await axios.post(
        `http://localhost:8900/api/contact/admin/${selectedContactId}/reply`,
        {
          reply: replyContent,
          adminName: "Admin001",
        }
      );
      setReplyContent("");
      setSelectedContactId(null);
      fetchContacts();
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
    }
  };

  // Tính tổng số trang dựa vào tổng contacts
  const totalPages = Math.ceil(contacts.length / pageSize);

  // Lấy mảng contacts của trang hiện tại
  const contactsInPage = contacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Xử lý xóa phản ánh trên client
  const handleDeleteContact = (id) => {
    setContacts((prev) => {
      const newContacts = prev.filter((contact) => contact.id !== id);

      // Nếu xóa contact đang soạn phản hồi thì reset
      if (selectedContactId === id) {
        setSelectedContactId(null);
        setReplyContent("");
      }

      // Tính lại tổng trang sau khi xóa
      const newTotalPages = Math.ceil(newContacts.length / pageSize);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }

      return newContacts;
    });
  };

  return (
    <Container className="py-2">
      <h2 className="mb-4">🛠️Phản hồi người dùng</h2>

      {contacts.length === 0 ? (
        <Alert variant="secondary">Hiện không có phản ánh nào.</Alert>
      ) : (
        <>
          <Row className="g-4">
            {contactsInPage.map((c) => {
              const hasResponse =
                Array.isArray(c.responses) && c.responses.length > 0;
              return (
                <Col md={12} key={c.id}>
                  <Card className="shadow-sm">
                    <Card.Body>
                    <Stack direction="horizontal" className="mb-2 justify-content-between">
  <div>
    <div className="mb-1">
      <strong>Họ tên:</strong> {c.fullName}
    </div>
    <div className="mb-1">
      <strong>Chủ đề:</strong> {c.subject}
    </div>
    <div>
      <strong>Email:</strong> {c.email}{" "}
      <small className="text-muted">
        (Gửi lúc: {new Date(c.submittedAt).toLocaleString()})
      </small>
    </div>
  </div>

  <div>
    <Badge bg={hasResponse ? "primary" : "warning"}>
      {hasResponse ? "✅ ĐÃ XỬ LÝ" : "🕒 CHƯA XỬ LÝ"}
    </Badge>
  </div>
</Stack>


                      <Card.Text>
                        <strong>Nội dung phản ánh:</strong>
                        <div className="border p-2 rounded mt-1">{c.message}</div>
                      </Card.Text>

                      {hasResponse ? (
                        <Alert
                          variant="light"
                          className="border-start border-4 border-primary mt-3"
                        >
                          <p className="mb-1">
                            <strong>Phản hồi từ admin:</strong> {c.responses[0].reply}
                          </p>
                          <div className="text-dark fw-semibold small">
                            👤 {c.responses[0].adminName} —{" "}
                            {new Date(c.responses[0].repliedAt).toLocaleString()}
                          </div>
                        </Alert>
                      ) : (
                        <Form className="mt-3">
                          <Form.Group className="mb-2">
                            <Form.Control
                              as="textarea"
                              rows={2}
                              placeholder="Nhập phản hồi..."
                              value={selectedContactId === c.id ? replyContent : ""}
                              onChange={(e) => {
                                setSelectedContactId(c.id);
                                setReplyContent(e.target.value);
                              }}
                            />
                          </Form.Group>
                          <div className="d-flex justify-content-end">
                            <Button variant="primary" size="sm" onClick={handleReply}>
                              Gửi phản hồi
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Card.Body>

                    {/* Nút xóa ở dưới cùng */}
                    <Card.Footer className="text-end">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteContact(c.id)}
                      >
                        Xóa
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="outline-primary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="me-2"
            >
              &laquo; Trước
            </Button>

            <span className="align-self-center">
              Trang {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline-primary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="ms-2"
            >
              Sau &raquo;
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default AdminContactPanel;
