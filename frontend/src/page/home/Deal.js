import React, { useEffect, useState, useRef } from 'react';
import { GET_ALL } from '../../api/apiService';
import { useLocation, useNavigate } from 'react-router-dom';

const Deal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;

  const numItems = 3; // số sản phẩm mỗi lần load từ API
  const visibleItems = 3; // số sản phẩm hiển thị trên 1 màn hình ngang

  const handleProductClick = (id) => {
    navigate(`/product-detail/${id}`);
  };

  useEffect(() => {
    setLoading(true);
    const params = {
      pageNumber: currentPage,
      pageSize: numItems,
      sortBy: "productId",
      sortOrder: "asc",
    };
    GET_ALL("catalog/products", params)
      .then((response) => {
        setProducts(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, [currentPage]);

  // Hàm cuộn container sang trái hoặc phải
  const scroll = (direction) => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const itemWidth = 220; // bao gồm padding/margin (bạn điều chỉnh theo thực tế)
    const scrollAmount = itemWidth * visibleItems;

    if (direction === "left") {
      container.scrollLeft = Math.max(container.scrollLeft - scrollAmount, 0);
    } else if (direction === "right") {
      // không vượt quá max scroll
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollLeft = Math.min(container.scrollLeft + scrollAmount, maxScrollLeft);
    }
  };
  const initialTime = 1 * 3600 + 30 * 60; // 5400 giây = 1 giờ 30 phút
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return initialTime; // Reset về 1 giờ 30 phút khi về 0 hoặc nhỏ hơn
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);
  return (
    <section className="padding-bottom">
      <div className="card card-deal">
<div className="content-body text-center bg-light py-4">
  <header className="section-heading mb-3">
    <h3 className="section-title">🔥 Khuyến mãi hot 🔥</h3>
  </header>

  <div className="timer d-flex justify-content-center gap-3">
    {[ 
      { label: "Ngày", value: days },
      { label: "Giờ", value: hours },
      { label: "Phút", value: minutes },
      { label: "Giây", value: seconds },
    ].map((item, index) => (
      <div
        key={index}
        className="bg-danger text-white rounded px-3 py-2 d-flex flex-column align-items-center shadow"
        style={{ minWidth: "60px" }}
      >
        <span className="num fw-bold fs-4">
          {item.value.toString().padStart(2, "0")}
        </span>
        <small className="fw-semibold">{item.label}</small>
      </div>
    ))}
  </div>
</div>

        <div style={{ position: "relative" }}>
          {/* Nút mũi tên trái */}
          <button
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              top: "40%",
              left: 0,
              zIndex: 10,
              background: "rgba(0,0,0,0.3)",
              border: "none",
              color: "white",
              fontSize: "2rem",
              cursor: "pointer",
              width: 40,
              height: 80,
              borderRadius: "0 8px 8px 0",
            }}
            aria-label="Scroll Left"
          >
            &#8592;
          </button>

          {/* Container sản phẩm */}
          <div
            ref={containerRef}
            style={{
              display: "flex",
              overflowX: "auto",
              scrollBehavior: "smooth",
              gap: "1rem",
              padding: "1rem 50px", // để nút không đè lên sản phẩm
              scrollbarWidth: "none",
            }}
            className="hide-scrollbar"
          >
            {!loading &&
              products.length > 0 &&
              products
               .filter(row => row.priceSale != null && row.priceSale > 0)
              .slice(0, 7).map((row) => (
                <div
                  key={row.id}
                  onClick={() => handleProductClick(row.id)}
                  style={{
                    flex: "0 0 auto",
                    width: 200,
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  <figure className="card card-product-grid" style={{ margin: 0 }}>
                    <div
                      className="img-wrap position-relative"
                      style={{ height: 150, overflow: "hidden" }}
                    >
                    
                      <span className="badge bg-danger position-absolute top-0 start-0 m-2 px-2 py-1">
                        {row.priceSale}%
                      </span>
                      <img
                        src={require(`/public/images/products/${row.imageUrl}`)}
                        alt={row.imageUrl}
                        className="img-fluid"
                        style={{ objectFit: "cover", height: "100%", width: "100%" }}
                      />
                    </div>
                    <figcaption className="info-wrap p-2">
                      <div className="title mb-2 text-truncate">{row.productName}</div>
                      <div className="price-wrap d-flex align-items-center justify-content-between">
                        {row.priceSale == null ? (
                          <div className="price-wrap">
                            <span className="price">{row.price} VNĐ</span>
                          </div>
                        ) : (
                          <div className="price-wrap d-flex justify-content-center">
                            <small className="price">
                              <del>{row.price} VNĐ</del>
                            </small>{" "}
                            &nbsp; - &nbsp;
                            <h6 className="price">
                              {(row.price * (1 - row.priceSale / 100)).toLocaleString()} VNĐ
                            </h6>
                          </div>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
          </div>

          {/* Nút mũi tên phải */}
          <button
            onClick={() => scroll("right")}
            style={{
              position: "absolute",
              top: "40%",
              right: 0,
              zIndex: 10,
              background: "rgba(0,0,0,0.3)",
              border: "none",
              color: "white",
              fontSize: "2rem",
              cursor: "pointer",
              width: 40,
              height: 80,
              borderRadius: "8px 0 0 8px",
            }}
            aria-label="Scroll Right"
          >
            &#8594;
          </button>
        </div>
      </div>

      {/* CSS ẩn scrollbar */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
    </section>
  );
};

export default Deal;
