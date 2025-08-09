// CouponModal.js
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { GET_ID } from "../../api/apiService";


const CouponModal = ({ userId, show, onClose, onSelect }) => {
  const [userCoupons, setUserCoupons] = useState([]);

  useEffect(() => {
    const fetchUserCoupons = async () => {
      try {
        const res = await GET_ID(`discount/user-coupons/${userId}`);
        const today = new Date();

        const validCoupons = res.filter((coupon) => {
          const expiryDate = new Date(coupon.endDate || coupon.validUntil);
          return !isNaN(expiryDate) && expiryDate >= today;
        });

        setUserCoupons(validCoupons);
      } catch (err) {
        console.error("Lỗi khi lấy coupon:", err);
      }
    };

    if (show) fetchUserCoupons();
  }, [show, userId]);

  return (
    <Modal show={show} onHide={onClose} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>🎁 Mã Giảm Giá Của Bạn</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {userCoupons.length === 0 ? (
          <div className="text-center text-muted fst-italic small">
            Không có mã giảm giá khả dụng.
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {userCoupons.map((coupon) => (
              <div
                key={coupon.id}
                onClick={() => {
                  onSelect(coupon); // ✅ Gửi mã được chọn ra ngoài
                  onClose();
                }}
                className="border border-primary rounded p-2 bg-light hover-shadow cursor-pointer"
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold text-primary">{coupon.code}</div>
                    <div className="text-muted small">
                      Giảm {coupon.discountValue}% – Tối thiểu {coupon.minOrderValue} VND
                    </div>
                  </div>
                  <div className="text-primary fs-4">💸</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CouponModal;
