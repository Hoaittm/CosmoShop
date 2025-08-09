import { useEffect, useState, useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { toast } from "react-toastify";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
const [claimedCoupons, setClaimedCoupons] = useState([]);
useEffect(() => {
  if (!user?.userID) return;

  axios.get(`http://localhost:8900/api/discount/user-coupons/${user.userID}`)
    .then(res => {
      const data = res.data;
      // Kiểm tra nếu data là object (1 coupon), biến thành mảng chứa object đó
      const couponsArray = Array.isArray(data) ? data : [data];
      // Lấy ra mảng mã coupon của user
      const codes = couponsArray.map(coupon => coupon.code);
      console.log("Mã coupon đã nhận của user (mảng):", codes);
      setClaimedCoupons(codes);
    })
    .catch(err => console.error("Lỗi lấy mã đã nhận:", err));
}, [user]);


useEffect(() => {
  axios
    .get("http://localhost:8900/api/discount/coupons")
    .then((res) => {
      const now = new Date();

      // Lọc coupon còn hạn, active, và chưa nhận
      const validCoupons = res.data.filter((coupon) => {
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);
        return (
          coupon.isActive &&
          !isNaN(startDate) &&
          !isNaN(endDate) &&
          now >= startDate &&
          now <= endDate &&
          !claimedCoupons.includes(coupon.code)
        );
      });

      // Lọc trùng theo code (giữ coupon đầu tiên)
      const uniqueCouponsMap = new Map();
      validCoupons.forEach(coupon => {
        const normalizedCode = coupon.code.trim().toLowerCase();
        if (!uniqueCouponsMap.has(normalizedCode)) {
          uniqueCouponsMap.set(normalizedCode, coupon);
        }
      });

      const uniqueCoupons = Array.from(uniqueCouponsMap.values());

      setCoupons(uniqueCoupons);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Lỗi tải coupon:", err);
      setLoading(false);
    });
}, [claimedCoupons]);

 const handleClaim = (code) => {
  axios
    .post("http://localhost:8900/api/discount/distribute", {
      code: code,
      userId: user?.userID,
    })
    .then(() => {
      toast.success("🎉 Nhận mã thành công!");
      // thêm code mới vào claimedCoupons
      setClaimedCoupons((prev) => [...prev, code]);
      // xóa tất cả coupon trùng mã code khỏi danh sách hiển thị
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.code !== code)
      );
    })
    .catch(() => toast.error("❌ Nhận mã thất bại!"));
};


  const settings = {
    infinite: true,
    speed: 10000,              // tốc độ mượt
    autoplay: true,
    autoplaySpeed: 0,          // không delay giữa mỗi lần scroll
    cssEase: "linear",         // trượt liên tục
    slidesToShow: 1,           // mỗi lần scroll 1 item
    slidesToScroll: 1,
    arrows: false,
    variableWidth: true,       // cho phép chiều rộng item khác nhau
    pauseOnHover: true,
  };

  return (
    <div className="container mt-4">
      <h5 className="text-center mb-3">🔥 Mã Khuyến Mãi Hot</h5>
      {loading ? (
        <p className="text-center">Đang tải mã khuyến mãi...</p>
      ) : coupons.length === 0 ? (
        <p className="text-center">Không có mã nào.</p>
      ) : (
        <Slider {...settings}>
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              style={{ width: 240 }} // item chiều rộng cố định hoặc tùy chỉnh
              className="px-2"
            >
              <div
                className="border rounded text-center p-3"
                style={{
                  background: "#f1f1f1",
                  border: "1px dashed #999",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#333",
                  minHeight: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  🎁 <strong>{coupon.code}</strong>
                  <div>
                    {coupon.discountType === "PERCENT"
                      ? `Giảm ${coupon.discountValue}%`
                      : `Giảm ${coupon.discountValue.toLocaleString()}₫`}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-success mt-2"
                  onClick={() => handleClaim(coupon.code)}
                >
                  Nhận
                </button>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Coupons;
  