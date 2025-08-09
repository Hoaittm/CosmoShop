// AllCoupon.js
import React, { useContext, useEffect, useState } from "react";
// Không cần import Modal và Button từ react-bootstrap nữa
import { GET_ID } from "../../../api/apiService";
import UserContext from "../../../context/UserContext";

// Nhận `onSelect` làm một prop
const AllCoupon = ({ onSelect }) => {
  const { user } = useContext(UserContext); // Lấy user từ UserContext
  const [userCoupons, setUserCoupons] = useState([]);
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải
  const [error, setError] = useState(null); // State để quản lý lỗi
console.log('df',user);
  useEffect(() => {
    const fetchUserCoupons = async () => {
      // Đảm bảo có userId trước khi gọi API
      if (!user || !user.userID) {
        setLoading(false);
        setError("Không tìm thấy thông tin người dùng.");
        return;
      }

      setLoading(true); // Bắt đầu tải dữ liệu
      setError(null);   // Xóa lỗi cũ (nếu có)
      try {
        const res = await GET_ID(`discount/user-coupons/${user.userID}`);
        const today = new Date();
        // Đặt giờ, phút, giây, mili giây về 0 để so sánh chính xác theo ngày
        today.setHours(0, 0, 0, 0);

        const validCoupons = res.filter((coupon) => {
          const expiryDate = new Date(coupon.endDate || coupon.validUntil);
          // Đặt giờ, phút, giây, mili giây của ngày hết hạn về 0 để so sánh chính xác
          expiryDate.setHours(0, 0, 0, 0);
          return !isNaN(expiryDate) && expiryDate >= today;
        });

        setUserCoupons(validCoupons);
      } catch (err) {
        console.error("Lỗi khi lấy coupon:", err);
        setError("Không thể tải mã giảm giá. Vui lòng thử lại sau."); // Đặt thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
    };

    // Gọi fetchUserCoupons khi component mount hoặc user.userId thay đổi
    fetchUserCoupons();
  }, [user?.userID]); // Dependency array: chỉ re-run khi user.userId thay đổi. Dùng optional chaining để tránh lỗi nếu user là null/undefined.

  return (
    <div className="all-coupons-container p-3 border rounded shadow-sm bg-white">
      <h2 className="mb-3 text-center text">Mã Giảm Giá Của Bạn</h2>
      <hr className="mb-4" />

      {loading ? (
        <div className="text-center text-info fst-italic">Đang tải mã giảm giá...</div>
      ) : error ? (
        <div className="text-center text-danger fst-italic">{error}</div>
      ) : userCoupons.length === 0 ? (
        <div className="text-center text-muted fst-italic">
          Không có mã giảm giá khả dụng.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {userCoupons.map((coupon) => (
            <div
              key={coupon.id}
              // Chỉ kích hoạt onClick nếu onSelect được cung cấp
              onClick={() => {
                if (onSelect) {
                  onSelect(coupon);
                }
              }}
              className="coupon-item border border-info rounded p-3 bg-light hover-shadow"
              // Chỉ có cursor pointer nếu có onSelect
              style={{ cursor: onSelect ? "pointer" : "default" }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-bold text-success mb-1">{coupon.code}</div>
                  <div className="text-muted small">
                    Giảm <span className="fw-bold">{coupon.discountValue}%</span> – Đơn tối thiểu <span className="fw-bold">{coupon.minOrderValue.toLocaleString('vi-VN')} VND</span>
                  </div>
                  {(coupon.endDate || coupon.validUntil) && (
                    <div className="text-danger small mt-1">
                      Hết hạn: {new Date(coupon.endDate || coupon.validUntil).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                  {coupon.description && (
                    <div className="text-secondary small mt-1">
                      {coupon.description}
                    </div>
                  )}
                </div>
         
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCoupon;