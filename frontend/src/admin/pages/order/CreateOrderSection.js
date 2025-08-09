import React, { useEffect, useState } from "react";
import { DELETE, GET_ALL } from "../../../api/apiService";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import axios from "axios";

const CreateOrderSection = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
      const [selectedOrder, setSelectedOrder] = useState(null);
const navigate = useNavigate();


    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const response = await GET_ALL(`/shop/order`);
            console.log("dsfjsdf:",response)
            setOrders(response);
            setLoading(false);
        };
        fetchOrders();
    }, []);
    console.log("product select: ", selectedProduct)
   // const selectID = selectedProduct.id;
    //console.log("product select:đ ", selectID)

    console.log("product select: ", selectedProduct)
  

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }
const handleEdit = (id, userName, item) => {
  if (id && item) {
    navigate(`/admin/dashboard/order/${userName}/${id}`, { state: item });
  } else {
    console.error("Item or ID is missing!");
  }
};
const handleDelete = async () => {
    if (!selectedOrder) return;
    console.log("Deleting user:", selectedOrder);
        console.log("Deleting user:", selectedOrder.id);
    try {
        await DELETE(`/shop/order/${selectedOrder.id}`);
        setOrders(prev => prev.filter(use => use.id !== selectedOrder.id));
    
    } catch (error) {
        console.error("Delete failed:", error);
    } finally {
        setSelectedOrder(null);
    }
};

    return (
        <section className="container mt-4" >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary">Quản lý đơn hàng</h1>
                <Link to="/admin/create-product" className="btn btn-success">
                    <i className="fas fa-plus me-2"></i> Thêm sản phẩm
                </Link>
            </div>

            <div className="table-responsive" style={{overflow: "auto", height: '600px'}}>
                <table className="table table-bordered text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Mã đơn hàng</th>
                            <th>Ngày đặt</th>
                            <th>Người đặt</th>
                              <th>Giảm giá</th>
                            <th>Tổng tiền</th>
                              <th>Trạng thái đơn hàng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((item, index) => (
                            <tr key={item.orders_id}>
                                <td>{index + 1}</td>
                                <td>{item.id}</td>
                                <td>{item.orderedDate}</td>
                              <td>{item.user?.userName || item.user?.email}</td>
<td>
    {item.priceSale ? `${item.priceSale}%` : '0%'}
</td>
                               
                              <td>
    {item.priceSale > 0  ?
        // Nếu có giá sale (lớn hơn 0), tính giá sau sale
        `${Number(item.total *(1-item.priceSale/100)+30000).toLocaleString()} VNĐ`
        :
        // Nếu không có giá sale, hiển thị tổng tiền ban đầu
        `${Number(item.total).toLocaleString()} VNĐ`
    }
</td>
                                <td>{item.status} </td>
                                <td >
                                   
                                    <button
                                        className="btn btn-primary mr-3"
                                      onClick={() => handleEdit(item.id,item.user.userName,item)}

                                        >
                                        <i className="fa fa-edit"></i> xem chi tiết
                                        </button>
<button
                                        className="btn btn-danger me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteConfirmModal"
                                        onClick={() => setSelectedOrder(item)}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
                {/* Bootstrap Modal Xác nhận Xóa */}
            {/* <div
                className="modal fade"
                id="deleteConfirmModal"
                tabIndex="-1"
                aria-labelledby="deleteConfirmModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteConfirmModalLabel">
                                Xác nhận xóa
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            Bạn có chắc chắn muốn xóa sản phẩm{" "}
                            <strong>{selectedProduct?.productName}</strong>?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Hủy
                            </button>
                            
                        </div>
                    </div>
                    </div>
            
            </div> */}
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
                            Bạn có chắc muốn xóa đơn hàng  <strong></strong>?
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
        </section>
    )
}

export default CreateOrderSection;
