import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { POST_ADD } from '../../../api/apiService';
import axios from 'axios';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';

const CreateProSection = () => {
    const [file, setFile] = useState(null);


    const [value, setValue] = useState({
        productName: "",
        price: 0,
        priceSale:0,
        discription: "",
        category: "",
        availability: 0,
        // image: ""
    });

    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    // console.log("FIle: ", file)

    const handleInput = (e) => {
        setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    };

 const handleSubmit = async (e) => {
        e.preventDefault();

        // 🌟 KIỂM TRA ĐIỀU KIỆN ẢNH Ở ĐÂY
        if (!file) {
            toast.error('Vui lòng chọn ảnh cho sản phẩm.');
            return; // Dừng hàm nếu không có file
        }

        // Kiểm tra các trường bắt buộc khác nếu có
    
        
        console.log("Value submitted: ", value);
        const finalValue = { ...value};

        try {
            const response = await fetch('http://localhost:8900/api/catalog/admin/products', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalValue),
            });

            const result = await response.json();
            console.log("Product creation result:", result);

            if (response.ok && result.id) {
                toast.success("Thêm sản phẩm thành công");

                // Đợi (await) hàm handleUpload hoàn tất
                const imageUrl = await handleUpload(result.id);

                if (imageUrl) {
                    // Nếu upload ảnh thành công, có thể cập nhật thêm logic nếu cần
                } else {
                    toast.warn("Ảnh sản phẩm không được tải lên thành công.");
                }

                // Chuyển hướng sau khi cả tạo sản phẩm và upload ảnh đều hoàn tất
                navigate("/admin/dashboard/all-product");
            } else {
                let errorMessage = "Thêm sản phẩm thất bại.";
                if (result && result.message) {
                    errorMessage += " " + result.message;
                }
                toast.error(errorMessage);
            }
        } catch (error) {
            console.log("Error in add products: ", error);
            toast.error("Lỗi mạng hoặc server không phản hồi.");
        }
    };

   

    const handleUpload = async (productId) => {
        if (!file) {
            // Không toast.warn ở đây nữa, vì handleSubmit sẽ xử lý trước
            console.warn('Không có file để upload.');
            return; // Trả về null hoặc reject promise để báo hiệu không có file
        }

        const formData = new FormData();
        formData.append('image', file);
        console.log("Append formdata successful");

        try {
            const res = await axios.post(
                `http://localhost:8900/api/catalog/admin/products/${productId}/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data' // Nên tường minh
                    }
                }
            );
            console.log("Upload response:", res.data);
            if (res.data && res.data.imageUrl) {
                // toast.success('Upload ảnh thành công!');
                return res.data.imageUrl; // Trả về URL ảnh để có thể dùng nếu cần
            } else {
                // toast.error('Server không trả về URL ảnh sau khi upload.');
                return null;
            }
        } catch (error) {
            console.error('Error updating image:', error);
            toast.error('Lỗi khi upload ảnh.');
            return null; // Trả về null khi có lỗi
        }
    };


    return (
        <div style={{ overflow: "auto", height: '800px' }}>
            <section className="content-header ">
                <div className="container">
                    <div className="flex">
                        <h1 className="text-xl font-semibold">Thêm sản phẩm</h1>
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
                            
                                                onChange={handleInput}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="category" className="block text-sm font-medium text-gray">Danh mục</label>
                                            <input
                                                type='text'
                                                name="category"
                                                id="category"
                                                className="form-control mt-1 p-2 w-full border border-gray rounded"
                            
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
                                           
                                                onChange={handleInput}
                                            />
                                        </div>
                                         <div className="form-group">
                                <label htmlFor="image">Ảnh sản phẩm</label>
                                <input
                                    type="file"
                                    className="form-control-file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    // Không đặt required ở đây, vì chúng ta sẽ kiểm tra thủ công trong handleSubmit
                                />
                                {file && (
                                    <div className="mt-2">
                                        <img src={URL.createObjectURL(file)} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                    </div>
                                )}
                            </div>
                                    </div>
                                </div>
                            </div>
                              <div className="card-header">
                {/* Sử dụng row và col của Bootstrap để sắp xếp các button */}
                <div className="row justify-content-start"> {/* justify-content-end để đưa các button về bên phải */}
                    <div className="col-auto"> {/* col-auto sẽ tự động điều chỉnh chiều rộng theo nội dung */}
                        <button type="submit" name="create" className="btn btn-sm btn-success"> {/* Dùng btn-success của Bootstrap/AdminLTE */}
                            <i className="fa fa-save" aria-hidden="true"></i> Lưu
                        </button>
                    </div>
                    <div className="col-auto ml-2"> {/* ml-2 để tạo khoảng cách giữa các button */}
                        <Link to="/admin/dashboard/all-product"> {/* Dùng "to" thay vì "href" cho Link */}
                            <button
                                type="button"
                                className="btn btn-sm btn-info" // Dùng btn-info của Bootstrap/AdminLTE (thay cho bg-blue)
                            >
                                <i className="fa fa-arrow-left" aria-hidden="true"></i> Về danh sách
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
                        </form>
                    </div>
                </section>
            </section>
        </div>
    )
}

export default CreateProSection
