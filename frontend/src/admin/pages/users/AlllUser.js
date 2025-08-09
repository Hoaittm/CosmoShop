import { useEffect, useState } from "react";
import { Table, Container, Spinner, Pagination } from "react-bootstrap";
import { DELETE, GET_ALL } from "../../../api/apiService";

const AllUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        setLoading(true);
        GET_ALL("/accounts/users")
            .then(response => {
                setUsers(response);
            })
            .catch(error => {
                console.error("Failed to fetch users:", error);
            })
            .finally(() => setLoading(false));
    }, []);
const handleDelete = async () => {
    if (!selectedUser) return;
    console.log("Deleting user:", selectedUser);
        console.log("Deleting user:", selectedUser);
    try {
        await DELETE(`/accounts/users/${selectedUser.id}`);
        setUsers(prev => prev.filter(use => use.id !== selectedUser.id));
    
    } catch (error) {
        console.error("Delete failed:", error);
    } finally {
        setSelectedUser(null);
    }
};

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const paginationItems = [];

        for (let number = 1; number <= totalPages; number++) {
            paginationItems.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <Pagination className="justify-content-center mt-3">
                {paginationItems}
            </Pagination>
        );
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary fw-bold">Quản lý người dùng</h1>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <div style={{ overflowX: "auto" }}>
                        <Table bordered hover striped responsive className="text-center align-middle" style={{ minWidth: "900px" }}>
                            <thead className="table-primary">
                                <tr>
                                    <th>#</th>
                                    <th>Tên người dùng</th>
                                    <th>Họ và Tên</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Đường</th>
                                    <th>Thành phố</th>
                                    <th>Quốc gia</th>
                                     <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.userName}</td>
                                        <td>{item.userDetails?.firstName} {item.userDetails?.lastName}</td>
                                        <td>{item.userDetails?.email}</td>
                                        <td>{item.userDetails?.phoneNumber}</td>
                                        <td>{item.userDetails?.street}</td>
                                        <td>{item.userDetails?.locality}</td>
                                        <td>{item.userDetails?.country}</td>
                                        <td>
                                    <button
                                        className="btn btn-danger me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteConfirmModal"
                                        onClick={() => setSelectedUser(item)}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                    
                                </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {renderPagination()}
                </>
            )}
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
                            Bạn có chắc muốn xóa sản phẩm <strong>{selectedUser?.userName}</strong>?
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

export default AllUser;
