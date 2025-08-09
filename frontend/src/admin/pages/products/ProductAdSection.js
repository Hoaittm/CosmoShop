import React, { useEffect, useState } from "react";
import { DELETE, GET_ALL } from "../../../api/apiService";
import { Link, useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootstrap/dist/js/bootstrap.bundle.min";
import { toast } from "react-toastify";

const ProductAdSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await GET_ALL("/catalog/products");
                setProducts(response || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, []);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
        await DELETE(`/catalog/admin/products/${selectedProduct.id}`);
        setProducts(prev => prev.filter(pro => pro.id !== selectedProduct.id));
        // Thêm toast thông báo thành công
        toast.success(`Đã xóa sản phẩm: ${selectedProduct.productName}`);
    } catch (error) {
        console.error("Delete failed:", error);
        // Thêm toast thông báo lỗi
        toast.error(`Lỗi khi xóa sản phẩm: ${selectedProduct.productName}`);
    } finally {
        setSelectedProduct(null);
        // Đóng modal thủ công nếu không sử dụng data-bs-dismiss="modal" trên nút delete
        // Hoặc đảm bảo nút delete có data-bs-dismiss="modal" như bạn đã làm.
        // Nếu muốn đóng modal bằng JS:
        // const modalElement = document.getElementById('deleteConfirmModal');
        // const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        // modal.hide();
    }
};

    const handleEdit = (id, item) => {
        if (id && item) {
            navigate(`/admin/dashboard/edit-product/${id}`, { state: item });
        } else {
            console.error("Missing item or ID");
        }
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <div className="text-center mt-5">Đang tải sản phẩm...</div>;
    }

    return (
        <section className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary">Quản lý sản phẩm</h1>
                <Link to="/admin/dashboard/create-product" className="btn btn-success">
                    <i className="fas fa-plus me-2"></i> Thêm sản phẩm
                </Link>
            </div>

            <div className="table-responsive" style={{ maxHeight: "700px", overflowY: "auto" }}>
                <table className="table table-bordered align-middle text-center">
                    <thead className="table-primary sticky-top">
                        <tr>
                            <th>#</th>
                            <th>Hình</th>
                            <th>Tên sản phẩm</th>
                            <th>Chi tiết</th>
                            <th>Danh mục</th>
                            <th>Giá bán</th>
                            <th>Khuyến mãi</th>
                            <th>Tồn kho</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>{indexOfFirstProduct + index + 1}</td>
                                <td>
                                    <img
                                        src={`/images/products/${item.imageUrl}`}
                                        alt={item.productName}
                                        className="img-thumbnail"
                                        style={{ width: "120px", height: "auto", objectFit: "cover" }}
                                        onError={(e) => (e.target.src = "/images/no-image.png")}
                                    />
                                </td>
                                <td>{item.productName}</td>
                                <td>{item.discription}</td>
                                <td>{typeof item.category === 'string' ? item.category : item.category?.name || "Không rõ"}</td>
                                <td>{item.price?.toLocaleString()} VND</td>
                                <td>{item.priceSale ? `${item.priceSale}%` : "0%"}</td>
                                <td>{item.availability}</td>
                      <td>
    <div className="d-flex justify-content-center gap-2"> {/* Thêm div bọc và các class Bootstrap */}
        <button
            className="btn btn-danger" /* Bỏ me-2 ở đây vì gap-2 đã lo khoảng cách */
            data-bs-toggle="modal"
            data-bs-target="#deleteConfirmModal"
            onClick={() => setSelectedProduct(item)}
        >
            <i className="fa fa-trash"></i>
        </button>
        <button
            className="btn btn-primary"
            onClick={() => handleEdit(item.id, item)}
        >
            <i className="fa fa-edit"></i>
        </button>
    </div>
</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <nav className="mt-3 d-flex justify-content-center">
                    <ul className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                            <li
                                key={index}
                                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                            >
                                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* Modal xác nhận xóa */}
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
                            Bạn có chắc muốn xóa sản phẩm <strong>{selectedProduct?.productName}</strong>?
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
    );
};

export default ProductAdSection;
