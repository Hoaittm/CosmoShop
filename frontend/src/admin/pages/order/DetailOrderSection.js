import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DetailOrderSection = () => {
  const location = useLocation();
  const { userName, id } = useParams();
  const [order, setOrder] = useState(location.state || null);
  const [status, setStatus] = useState("");
const navigate=useNavigate();
  useEffect(() => {
    if (!order) {
      axios
        .get(`http://localhost:8900/api/shop/order/${userName}/${id}`)
        .then((res) => {
          setOrder(res.data);
          setStatus(res.data.status);
        })
        .catch((err) => console.error("Lỗi khi tải đơn hàng:", err));
    } else {
      setStatus(order.status);
    }
  }, [order, id, userName]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

 const handleUpdateStatus = () => {
    axios
      .put(`http://localhost:8900/api/shop/order/${id}/status`, { status })
      .then(() => {
        toast.success("Đã cập nhật trạng thái!");
    navigate("/admin/dashboard/order");
// hoặc ở lại nếu muốn
      })
      .catch((err) => {
        console.error(err);
        toast.error("Cập nhật thất bại!");
      });
  };

  if (!order) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container mt-5 p-4 ">
      <h2 className="mb-4">🧾 Chi tiết đơn hàng #{order.id}</h2>
      <div className="mb-3">
        <strong>Ngày đặt:</strong> {order.orderedDate}
      </div>
      <div className="mb-3">
        <strong>Khách hàng:</strong> {order.user.userName}
      </div>
      <div className="mb-3">
        <label className="form-label"><strong>Trạng thái:</strong></label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
    
          <option value="Đang xử lý">Đang xử lý</option>
                <option value="Chờ lấy hàng">Chờ lấy hàng</option>
          <option value="Đang giao hàng">Đang giao hàng</option>
          <option value="Hoàn thành">Hoàn thành</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleUpdateStatus}>
        Cập nhật trạng thái
      </button>
    
     
 <div className="mb-3">
        <strong>Giảm giá:</strong> {order.priceSale>0?`${order.priceSale}%`:'0%'} 
      </div>
      
       <div className="mb-3">
        <strong>Tổng cộng:</strong>  {order.priceSale > 0  ?
        // Nếu có giá sale (lớn hơn 0), tính giá sau sale
        `${Number(order.total *(1-order.priceSale/100)+30000).toLocaleString()} VNĐ`
        :
        // Nếu không có giá sale, hiển thị tổng tiền ban đầu
        `${Number(order.total).toLocaleString()} VNĐ`
    }
      </div>
      
      <h4 className="mt-4">🛍️ Sản phẩm trong đơn hàng</h4>
<div className="row mt-3">
  {order.items.map((item, index) => (
    <div className="col-md-6 mb-3" key={index}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{item.product.productName}</h5>
          <p className="card-text">
            <strong>Số lượng:</strong> {item.quantity}<br />
            <strong>Giá:</strong> {item.product.price.toLocaleString()} VND<br />
            <strong>Thành tiền:</strong> {item.subTotal.toLocaleString()} VND
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default DetailOrderSection;
