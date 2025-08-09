import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProSection = () => {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    // originalProduct giữ dữ liệu ban đầu, không dùng để hiển thị ảnh động
    const [originalProduct, setOriginalProduct] = useState(null); 
    const [value, setValue] = useState({
        productName: "",
        price: 0,
        discription: "",
        category: "",
        availability: 0,
        imageUrl: "" // Giữ imageUrl trong state này để cập nhật và hiển thị
    });

    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Selected file:', selectedFile);
        setFile(selectedFile);
        // Khi chọn file mới, cập nhật ngay imageUrl trong state 'value'
        // để hiển thị preview ảnh mới
        if (selectedFile) {
            setValue(prev => ({
                ...prev,
                imageUrl: URL.createObjectURL(selectedFile) // Tạo URL tạm thời cho ảnh mới
            }));
        } else {
            // Nếu không có file nào được chọn, quay lại ảnh gốc hoặc set rỗng
            setValue(prev => ({
                ...prev,
                imageUrl: originalProduct ? originalProduct.imageUrl : ""
            }));
        }
    };

    const handleInput = (e) => {
        setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8900/api/catalog/products/${id}`);
                setValue(response.data); // Set the form values to the fetched product data
                setOriginalProduct(response.data); // Store the original product data
                console.log('Fetched data:', response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Không thể tải thông tin sản phẩm.");
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Chuẩn bị dữ liệu cho PUT request
            const productDataToUpdate = { ...value };
            // Đảm bảo không gửi imageUrl dạng blob URL nếu không phải là ảnh gốc
            if (file) {
                 // Nếu có file mới, imageUrl sẽ được xử lý trong handleUpload
                 // Không gửi imageUrl tạm thời lên PUT request
                 delete productDataToUpdate.imageUrl; 
            }
            // Nếu không có file mới, nhưng imageUrl đã bị thay đổi (không phải do chọn file)
            // thì cần đảm bảo imageUrl này là hợp lệ (ví dụ: là URL từ server)
            // hoặc gửi imageUrl gốc lên.
            
            const response = await fetch(`http://localhost:8900/api/catalog/admin/products/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productDataToUpdate),
            });

            const result = await response.json(); 
            if (response.ok) {
                // Chỉ gọi handleUpload nếu có file mới được chọn
                if (file) {
                    await handleUpload(id); // Truyền id của sản phẩm
                }
                toast.success("Cập nhật sản phẩm thành công");
                navigate("/admin/dashboard/all-product");
            } else {
                toast.error("Cập nhật sản phẩm thất bại!");
                console.error("Server error:", result);
            }
        } catch (error) {
            console.error("Error in update product: ", error);
            toast.error("Đã xảy ra lỗi khi cập nhật sản phẩm.");
        }
    };

    const handleUpload = async (productId) => {
        if (!file) {
            // Nếu không có file, không cần upload
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const res = await axios.post(
                `http://localhost:8900/api/catalog/admin/products/${productId}/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Quan trọng cho FormData
                    },
                }
            );
            
            console.log("Upload response:", res.data);
            
            // ***** Cập nhật state 'value' với imageUrl mới từ server *****
            // Giả định backend trả về đối tượng sản phẩm đã được cập nhật hoặc chỉ URL mới
            if (res.data && res.data.imageUrl) {
                setValue(prev => ({
                    ...prev,
                    imageUrl: res.data.imageUrl // Cập nhật imageUrl trong state
                }));
            } else if (typeof res.data === 'string' && res.data.startsWith('http')) {
                // Nếu backend chỉ trả về một chuỗi URL
                setValue(prev => ({
                    ...prev,
                    imageUrl: res.data
                }));
            } else {
                console.warn("API upload không trả về imageUrl mới rõ ràng.");
                // Có thể cần re-fetch toàn bộ sản phẩm nếu API không trả về URL mới
                // const updatedProductResponse = await axios.get(`http://localhost:8900/api/catalog/products/${productId}`);
                // setValue(updatedProductResponse.data);
            }
            
            // Sau khi upload xong, xóa file đã chọn để tránh upload lại không cần thiết
            setFile(null); 

        } catch (error) {
            console.error('Error updating image:', error);
            toast.error('Lỗi khi tải lên hình ảnh.');
        }
    };

    return (
        <div style={{ overflow: "auto", height: '500px' }}>
            <section className="content-header">
                <div className="container">
                    <div className="flex">
                        <h1 className="text-xl font-semibold">Cập nhật sản phẩm</h1>
                    </div>
                </div>
                <section className="content">
                    <div className="card">
                        <form encType="multipart/form-data" onSubmit={handleSubmit}>
                            <div className="card-body p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <div className="mb-3">
                                            <label htmlFor="productName" className="block text-sm font-medium text-gray">Tên sản phẩm</label>
                                            <input
                                                type="text"
                                                name="productName"
                                                id="productName"
                                                className="form-control mt-1 p-2 w-full border border-gray rounded"
                                                value={value.productName}
                                                onChange={handleInput}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="discription" className="block text-sm font-medium text-gray">Chi tiết</label>
                                            <textarea
                                                name="discription"
                                                id="discription"
                                                rows={8}
                                                className="form-control mt-1 p-2 w-full border border-gray rounded"
                                                value={value.discription}
                                                onChange={handleInput}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="category" className="block text-sm font-medium text-gray">Danh mục</label>
                                            <input
                                                type="text"
                                                name="category"
                                                id="category"
                                                className="form-control mt-1 p-2 w-full border border-gray rounded"
                                                value={value.category}
                                                onChange={handleInput}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="priceSale" className="block text-sm font-medium text-gray">Khuyến mãi</label>
                                            <input
                                                type="number"
                                                name="priceSale"
                                                id="priceSale"
                                                className="form-control mt-1 p-2 w-full border border-gray rounded"
                                                value={value.priceSale}
                                                onChange={handleInput}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="price" className="block text-sm font-medium text-gray">Giá</label>
                                            <input
                                                type="number"
                                                name="price"
                                                id="price"
                                                className="form-control mt-1 p-2 w-full border border-gray rounded"
                                                value={value.price}
                                                onChange={handleInput}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="availability" className="block text-sm font-medium text-gray">Số lượng kho</label>
                                            <input
                                                type="number"
                                                name="availability"
                                                id="availability"
                                                className="form-control mt-1 p-2 w-full border border-gray-300 rounded"
                                                value={value.availability}
                                                onChange={handleInput}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="image" className="block text-sm font-medium text-gray">Hình ảnh</label>
                                            <div className='w-full h-auto'> {/* Đổi w-1 h-1 thành w-full h-auto để ảnh hiển thị tốt hơn */}
                                                {/* Hiển thị ảnh: ưu tiên ảnh mới chọn, sau đó đến ảnh trong state 'value', cuối cùng là null */}
                                                {file ? (
                                                    // Nếu có file mới được chọn, hiển thị preview từ Blob URL
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="Ảnh mới"
                                                        className="rounded object-cover mb-3"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                ) : value.imageUrl ? (
                                                    // Nếu không có file mới nhưng có imageUrl trong state 'value', hiển thị ảnh đó
                                                    <img 
                                                        src={value.imageUrl.startsWith('http') ? value.imageUrl : `/images/products/${value.imageUrl}`}
                                                        alt="Ảnh sản phẩm hiện tại"
                                                        className="rounded mb-3"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    // Hoặc hiển thị placeholder nếu không có ảnh
                                                    <div style={{ width: '100px', height: '100px', border: '1px dashed gray', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'gray' }}>
                                                        Không có ảnh
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                name="image"
                                                id="image"
                                                className="form-control border border-gray rounded mt-2"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-header">
                                <div className="flex justify-center row">
                                    <div className="col-md-1">
                                        <button type="submit" name="create" className="btn btn-sm bg-green text-white p-2 rounded grid grid-rows-1 grid-flow-col flex justify-center">
                                            <i className="fa fa-save" aria-hidden="true"></i> Lưu
                                        </button>
                                    </div>
                                    <Link to="/admin/dashboard/all-product"> {/* Đổi đường dẫn về đúng trang sản phẩm */}
                                        <button
                                            type="button"
                                            className="btn btn-sm bg-blue text-white p-2 rounded grid grid-rows-1 grid-flow-col flex justify-center"
                                        >
                                            <i className="fa fa-arrow-left" aria-hidden="true"></i>  Về danh sách
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </section>
        </div>
    );
};

export default EditProSection;