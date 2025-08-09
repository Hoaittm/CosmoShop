import { useContext, useState, useEffect } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Rating = ({ products, orderId }) => {
  const { user } = useContext(UserContext);

  // Lấy dữ liệu đã đánh giá từ localStorage, lưu theo key dạng "orderId-productId"
  const [submittedRatings, setSubmittedRatings] = useState(() => {
    const saved = localStorage.getItem('submittedRatings');
    return saved ? JSON.parse(saved) : {};
  });

  // Lưu rating đang chọn (chưa gửi) theo productId
  const [ratings, setRatings] = useState({});

  // Khi submittedRatings thay đổi thì cập nhật lại localStorage
  useEffect(() => {
    localStorage.setItem('submittedRatings', JSON.stringify(submittedRatings));
  }, [submittedRatings]);

  const handleRatingChange = (product_id, star) => {
    setRatings(prev => ({
      ...prev,
      [product_id]: star,
    }));
  };

  const handleSubmit = async (product_id) => {
    const rate = ratings[product_id] || 0;
    if (rate === 0) {
      toast.warn("Vui lòng chọn số sao!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8900/api/review/${user.userID}/recommendations/${product_id}?rating=${rate}`
      );

      toast.success("Đánh giá sản phẩm thành công!");

      // Tạo key lưu trạng thái đánh giá theo orderId và productId
      const key = `${orderId}-${product_id}`;

      // Cập nhật submittedRatings và localStorage
      setSubmittedRatings(prev => ({
        ...prev,
        [key]: rate,
      }));

      // Reset sao chọn tạm
      setRatings(prev => ({ ...prev, [product_id]: 0 }));
    } catch (error) {
      console.error("Error khi gửi đánh giá:", error);
      toast.error("Đã có lỗi xảy ra khi gửi đánh giá.");
    }
  };

  return (
    <div>
      {products.map(product => {
        const key = `${orderId}-${product.id}`;
        const submittedRating = submittedRatings[key];

        // Nếu đã đánh giá rồi thì ẩn phần đánh giá (không render)
        if (submittedRating) {
          return (
            <div key={product.id} className="card mb-3 p-3 shadow-sm">
              <h5>{product.productName}</h5>
              <p>Số lượng: {product.quantity}</p>
              <div className="text-center fs-5 text-success mb-3">
                <span>Đã đánh giá: </span>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`fs-3 mx-1 ${star <= submittedRating ? "text-warning" : "text-secondary"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          );
        }

        // Nếu chưa đánh giá, hiển thị UI đánh giá
        return (
          <div key={product.id} className="card mb-3 p-3 shadow-sm">
            <h5>{product.productName}</h5>
            <p>Số lượng: {product.quantity}</p>

            <div className="text-center mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`fs-3 mx-1 ${star <= (ratings[product.id] || 0) ? "text-warning" : "text-secondary"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRatingChange(product.id, star)}
                >
                  ★
                </span>
              ))}
            </div>

            <button
              className="btn btn-warning w-100"
              onClick={() => handleSubmit(product.id)}
            >
              Gửi đánh giá
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
