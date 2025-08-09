import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { GET_ID } from "../../api/apiService";

// Import style
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import { useSearchParams } from "react-router-dom";
import Rating from "../../layouts/Rating";

const STATUSES = [
  {
    key: "Đang xử lý",
    label: "Đang xử lý",
    color: "warning",
    icon: "bi-credit-card",
  },
  {
    key: "Chờ lấy hàng",
    label: "Chờ lấy hàng",
    color: "primary",
    icon: "bi-gear-fill",
  },
  {
    key: "Đang giao hàng",
    label: "Đang giao hàng",
    color: "info",
    icon: "bi-truck",
  },
  {
    key: "Hoàn thành",
    label: "Hoàn thành",
    color: "success",
    icon: "bi-check-circle-fill",
  },
];

const Order = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
const [searchParams] = useSearchParams();
const statusFromQuery = searchParams.get("status");
const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

useEffect(() => {
  const status = searchParams.get("status");
  if (status) {
    setSelectedStatus(status);
  }
}, [searchParams]);
  useEffect(() => {
    console.log("useEffect chạy với user.username:", user.username);
    const fetchUserData = async () => {
      if (!user.username) return;

      try {
const identifier = user.email || user.username;
const response = await GET_ID(`/shop/order/${identifier}`);

        console.log("response: ", response);
        if (Array.isArray(response)) {
          setOrders(response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchUserData();
  }, [user.username]);


  const countByStatus = (statusKey) =>
    orders.filter((order) => order.status === statusKey).length;

 const filteredOrders =
  selectedStatus !== null
    ? orders.filter((order) => order.status === selectedStatus)
    : [];

console.log("order items:", orders.item);

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4 text-center text-primary fw-bold">Đơn hàng của bạn</h1>

      {/* Trạng thái đơn hàng */}
      <div className="row text-center mb-5">
        {STATUSES.map(({ key, label, color, icon }) => (
          <div
            key={key}
            className="col-6 col-md-3 mb-3 animate__animated animate__fadeInUp"
            onClick={() => setSelectedStatus(key)}
            style={{ cursor: "pointer" }}
          >
            <div
              className={`status-card p-4 rounded-4 border border-2 shadow-sm transition-hover ${
                selectedStatus === key ? `border-${color} bg-${color} bg-opacity-10` : "border-light"
              }`}
            >
              <div className="icon-circle mb-2 mx-auto d-flex align-items-center justify-content-center">
                <i className={`bi ${icon} text-${color}`} style={{ fontSize: "1.8rem" }}></i>
              </div>
              <div className={`fw-semibold text-${color}`}>{label}</div>
              <div
                className={`badge bg-${color} text-white rounded-pill px-3 py-1 mt-2 animate__animated animate__fadeIn`}
              >
                {countByStatus(key)} đơn
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
     {filteredOrders.length > 0 ? (
  filteredOrders.map((order) => (
    <div key={order.id} className="card mb-4 shadow-sm border-0 rounded-3">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 className="mb-0 text-danger fw-semibold">Mã đơn hàng: #{order.id}</h5>
        <span
          className={`badge bg-${
            STATUSES.find((s) => s.key === order.status)?.color || "secondary"
          } fs-6 py-2 px-3 rounded-pill d-flex align-items-center`}
        >
          <i
            className={`bi me-2 ${
              STATUSES.find((s) => s.key === order.status)?.icon || ""
            }`}
          ></i>
          {STATUSES.find((s) => s.key === order.status)?.label || order.status}
        </span>
      </div>

      <div className="card-body">
        <p className="mb-2">
          <strong>Ngày đặt:</strong>{" "}
          {new Date(order.orderedDate).toLocaleDateString("vi-VN")}
        </p>
   <p className="mb-3">
  <strong>Tổng tiền:</strong>{" "}
  {VND.format(order.total * (1 - order.priceSale / 100) + 30000)}
  
</p>


     <h6 className="mb-3">Danh sách sản phẩm</h6>
<table className="table table-hover align-middle">
  <thead className="table-light">
    <tr>
      <th scope="col">Mã sp</th>
      <th scope="col">Tên sản phẩm</th>
      <th scope="col" style={{ width: "100px" }}>Số lượng</th>
      <th scope="col" style={{ width: "150px" }}>Giá</th>
      <th scope="col" style={{ width: "150px" }}>Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    {order.items.map((item, idx) => (
      <tr key={idx}>
        <td>{item.product.id}</td>
        <td>{item.product.productName}</td>
        <td>{item.quantity}</td>
        <td>{VND.format(item.product.price)}</td>
        <td>{VND.format(item.product.price * item.quantity)}</td>
      </tr>
    ))}
  </tbody>
</table>

{/* Phần tổng kết đơn hàng */}
<div className="mt-4">
  <p><strong>Giảm giá:</strong> {order.priceSale ? `${order.priceSale}%` : '0%'}</p>

  {/* Tính tổng tiền trước khi giảm */}
  <p>
    <strong>Tạm tính:</strong> {VND.format(
      order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    )}
  </p>

  {/* Tính tiền sau khi giảm */}
  <p>
    <strong>Tiền sau giảm:</strong> {VND.format(
      order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * (1 - (order.priceSale || 0) / 100)
    )}
  </p>

  <p><strong>Phí vận chuyển:</strong> {VND.format(30000)}</p>

  <p>
  <strong>Tổng cộng:</strong>{" "}
  {VND.format(
    order.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) * (1 - (order.priceSale || 0) / 100) + 30000
  )}
</p>
</div>


        {/* Hiển thị RatingItem nếu đơn hàng đã hoàn thành */}
       {order.status === "Hoàn thành" && (
  <div className="mt-3">
 <Rating
  orderId={order.id}  // Thêm dòng này để truyền mã đơn hàng
  products={order.items.map(item => ({
    id: item.product.id,
    productName: item.product.productName,
    quantity: item.quantity,
  }))}
/>

  </div>
)}

      </div>
    </div>
  ))
) 
 : (
        <p className="text-center text-muted fs-5">
          {selectedStatus
            ? "Không có đơn hàng ở trạng thái này."
            : ""}
        </p>
      )}

      {/* CSS Inline */}
      <style>{`
        .transition-hover {
          transition: all 0.3s ease-in-out;
        }
        .transition-hover:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
        }
        .status-card {
          background: #fff;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.05);
          transition: background-color 0.3s ease;
        }
        .status-card:hover .icon-circle {
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Order;
