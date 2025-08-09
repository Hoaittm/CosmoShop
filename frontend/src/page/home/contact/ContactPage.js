import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Badge,
  Breadcrumb,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [userContacts, setUserContacts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAlert, setShowAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8900/api/contact/feedback', formData);
      setShowAlert({ variant: 'success', message: 'Phản ánh đã được gửi!' });
      setFormData({ fullName: '', email: '', subject: '', message: '' });
      loadUserContacts();
    } catch (err) {
      setShowAlert({ variant: 'danger', message: 'Lỗi khi gửi phản ánh.' });
    }
  };

  const loadUserContacts = async () => {
    if (formData.email) {
      try {
        const res = await axios.get(
          `http://localhost:8900/api/contact/user?email=${formData.email}`
        );
        setUserContacts(res.data);
        setCurrentSlide(0);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (formData.email) loadUserContacts();
  }, [formData.email]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentSlide((prev) =>
      prev < userContacts.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <Container className="py-5 text-orange">
       <Container className="my-3">
        <Row>
          <Col md={12}>
            <Breadcrumb>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Trang chủ
              </Breadcrumb.Item>
             
               <Breadcrumb.Item active>
       Liên hệ
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
      </Container>
      <h2 className="text-center text-warning mb-4 fw-bold">Gửi phản ánh</h2>

      {showAlert && (
        <Alert variant={showAlert.variant} onClose={() => setShowAlert(null)} dismissible>
          {showAlert.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="mb-5">
        <Form.Group className="mb-3" controlId="formFullName">
          <Form.Control
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSubject">
          <Form.Control
            type="text"
            name="subject"
            placeholder="Chủ đề"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Control
            as="textarea"
            rows={4}
            name="message"
            placeholder="Nội dung phản ánh"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="warning" type="submit">
          Gửi
        </Button>
      </Form>

      {userContacts.length > 0 && (
        <>
          <h4 className="text-warning fw-semibold mb-3">
            Lịch sử phản ánh và phản hồi
          </h4>

          <Card border="warning" className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>
                <strong>Chủ đề:</strong> {userContacts[currentSlide].subject}
              </Card.Title>
              <Card.Text>
                <strong>Nội dung:</strong> {userContacts[currentSlide].message}
              </Card.Text>
              <Card.Text>
                <strong>Thời gian:</strong>{' '}
                {new Date(
                  userContacts[currentSlide].submittedAt
                ).toLocaleString()}
              </Card.Text>

              {userContacts[currentSlide].responses?.length > 0 && (
                <div className="mt-3 border-top pt-2">
                  <p className="fw-bold text-warning">Phản hồi từ admin:</p>
                  {userContacts[currentSlide].responses.map((res) => (
                    <div key={res.id}>
                      <p>
                        <strong>{res.adminName}:</strong> {res.reply}
                      </p>
                      <p className="fst-italic">
                        {new Date(res.repliedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          <Row className="mb-5">
            <Col className="text-start">
              <Button
                variant="outline-warning"
                onClick={handlePrev}
                disabled={currentSlide === 0}
              >
                ⬅ Trước
              </Button>
            </Col>
            <Col className="text-center">
              <span>
                {currentSlide + 1} / {userContacts.length}
              </span>
            </Col>
            <Col className="text-end">
              <Button
                variant="outline-warning"
                onClick={handleNext}
                disabled={currentSlide === userContacts.length - 1}
              >
                Tiếp ➡
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
