import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form, Card, Spinner } from "react-bootstrap";
import { DELETE } from "../../../api/apiService";
import { toast } from "react-toastify";

const CreateCouSection = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENT",
    discountValue: 0,
    minOrderValue: 0,
    startDate: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8900/api/discount/coupons`)
      .then((res) => {
        setCoupons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải mã khuyến mãi:", err);
        setLoading(false);
      });
  }, []);

  const handleCreateCoupon = () => {
    axios
      .post(`http://localhost:8900/api/discount/template`, formData)
      .then(() => {
        toast.success("Đã thêm mã khuyến mãi thành công!");
        setFormData({
          code: "",
          discountType: "PERCENT",
          discountValue: 0,
          minOrderValue: 0,
          startDate: "",
          endDate: "",
          isActive: true,
        });
        setShowForm(false);
        return axios.get(`http://localhost:8900/api/discount/coupons`);
      })
      .then((res) => setCoupons(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Tạo mã thất bại!");
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;
    try {
      await DELETE(`/discount/coupons/${selectedCoupon.id}`);
      setCoupons(prev => prev.filter(c => c.id !== selectedCoupon.id));
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setSelectedCoupon(null);
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  return (
    <Container className="mt-5 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🧾 Danh sách mã khuyến mãi</h2>
        <Button
          variant={showForm ? "danger" : "success"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✖ Hủy" : "+ Thêm mã"}
        </Button>
      </div>

      {/* FORM NHẬP */}
      {showForm && (
        <Card className="mb-4 p-3 bg-light">
          <h3 className="mb-3">Tạo mã giảm giá mới</h3>
          <Form>
            <Form.Group className="mb-3" controlId="formCode">
              <Form.Control
                type="text"
                placeholder="Mã giảm giá"
                name="code"
                value={formData.code}
                onChange={handleChange}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                >
                  <option value="PERCENT">Phần trăm</option>
                  <option value="FIXED">Giảm cố định</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Control
                  type="number"
                  name="discountValue"
                  placeholder="Giá trị giảm"
                  value={formData.discountValue}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formMinOrderValue">
               <Form.Label>Giá trị tối thiểu</Form.Label>
              <Form.Control
                type="number"
                name="minOrderValue"
                placeholder="Giá trị tối thiểu"
                value={formData.minOrderValue}
                onChange={handleChange}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Ngày bắt đầu</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Ngày kết thúc</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formIsActive">
              <Form.Check
                type="checkbox"
                label="Kích hoạt"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleCreateCoupon}>
              Tạo mã
            </Button>
          </Form>
        </Card>
      )}

      {/* DANH SÁCH MÃ */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : coupons.length === 0 ? (
        <p>Không có mã nào.</p>
      ) : (
        <Row xs={1} md={3} className="g-4">
          {coupons.map((coupon) => (
            <Col key={coupon.id}>
              <Card
                className={`h-100 shadow-sm ${
                  isExpired(coupon.endDate) ? "bg-light text-muted border-danger" : ""
                }`}
              >
                <Card.Body>
                  <Card.Title>
                    Mã: {coupon.code}{" "}
                    {isExpired(coupon.endDate) && (
                      <span className="badge bg-danger ms-2">Đã hết hạn</span>
                    )}
                  </Card.Title>
                  <Card.Text>
                    <strong>Loại:</strong> {coupon.discountType} <br />
                    <strong>Giá trị:</strong> {coupon.discountValue} <br />
                    <strong>Tối thiểu:</strong> {coupon.minOrderValue} <br />
                    <strong>Bắt đầu:</strong>{" "}
                    {new Date(coupon.startDate).toLocaleString()} <br />
                    <strong>Kết thúc:</strong>{" "}
                    {new Date(coupon.endDate).toLocaleString()} <br />
                    <strong>Hoạt động:</strong> {coupon.isActive ? "✔️" : "❌"}
                  </Card.Text>
                  <Button
                    className="btn me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteConfirmModal"
                    onClick={() => setSelectedCoupon(coupon)}
                  >
                    🗑 Xóa
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      <div
        className="modal fade"
        id="deleteConfirmModal"
        tabIndex="-1"
        aria-labelledby="deleteConfirmModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteConfirmModalLabel">Xác nhận xóa</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Bạn có chắc muốn xóa mã giảm <strong>{selectedCoupon?.code}</strong>?
            </div>
            <div className="modal-footer d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                data-bs-dismiss="modal"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateCouSection;
