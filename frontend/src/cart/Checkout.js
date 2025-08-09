import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartContext } from "../context/CartContext";
import UserContext from "../context/UserContext";
import { DELETE, GET_CART, GET_ID, POST_ORDER } from "../api/apiService";
import axios from "axios";

import Slider from "react-slick";
import { toast } from "react-toastify";
import CouponModal from "../components/coupon/couponSection";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";

const Checkout = () => {
  const { user } = useContext(UserContext);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState([]);
  const [error, setError] = useState(null);
  const { cart, setCart } = useContext(CartContext);
  const carts = localStorage.getItem("cart");
  console.log("cart by local", carts)
  const cartItems = carts ? JSON.parse(carts) : [];
  const [images, setImages] = useState({});
  const [shipFree, setShipFree] = useState(30000);
  const [total, setTotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(total);
const [showCouponModal, setShowCouponModal] = useState(false);




  const [couponCode, setCouponCode] = useState("");

  // const [discountedTotal, setDiscountedTotal] = useState(0);

  console.log("cartItems:", cartItems);

  useEffect(() => {
    let existingCartId = Cookies.get("cartId");
    if (!existingCartId) {
      let newCartId = "cart1";
      Cookies.set("cartId", newCartId, { path: "/cart", expires: 7 });
    }
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.subTotal, 0);
    setTotal(newTotal);
  }, [cart]);

const handleCouponSelect = (coupon) => {
  if (!coupon) return;

  if (total <= 0) {
    toast.warn("Giỏ hàng trống.");
    return;
  }

  if (total < coupon.minOrderValue) {
    toast.info(`Đơn hàng phải trên ${VND.format(coupon.minOrderValue)} để áp dụng mã này.`);
    setSelectedCoupon(null);
    setDiscountedTotal(total + 30000);
    setShipFree(30000);
    return;
  }

  const now = new Date();
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);

  if (now < start || now > end) {
    toast.error("Mã giảm giá không còn hiệu lực.");
    return;
  }

  setSelectedCoupon(coupon);

  let ship = 30000;
  let discountAmount = 0;

  if (coupon.discountType === "Shipping") {
    ship = Math.max(0, 30000 - coupon.discountValue);
    discountAmount = 0;
  } else if (coupon.discountType === "PERCENT") {
    discountAmount = total * (coupon.discountValue / 100);
  }

  setDiscountedTotal(total - discountAmount + ship);
  setShipFree(ship);

  toast.info(`Áp dụng mã ${coupon.code} giảm ${coupon.discountValue}${coupon.discountType === "PERCENT" ? "%" : "₫ phí vận chuyển"}`);
};


 useEffect(() => {
  const shippingFee = 30000;

  if (!selectedCoupon) {
    setDiscountedTotal(total + shippingFee);
    setShipFree(shippingFee);
    return;
  }

  const now = new Date();
  const start = new Date(selectedCoupon.startDate);
  const end = new Date(selectedCoupon.endDate);

  if (now < start || now > end || total < selectedCoupon.minOrderValue) {
    setSelectedCoupon(null);
    setDiscountedTotal(total + shippingFee);
    setShipFree(shippingFee);
    return;
  }

  let ship = shippingFee;
  let discount = 0;

  if (selectedCoupon.discountType === "Shipping") {
    ship = Math.max(0, shippingFee - selectedCoupon.discountValue);
  } else if (selectedCoupon.discountType === "PERCENT") {
    discount = total * (selectedCoupon.discountValue / 100);
  }

  setShipFree(ship);
  setDiscountedTotal(total - discount + ship);
}, [selectedCoupon, total]);

useEffect(() => {
  if (!selectedCoupon) {
    setDiscountedTotal(total);
    setShipFree(30000);
    return;
  }

  // Kiểm tra thời hạn
  const now = new Date();
  const start = new Date(selectedCoupon.startDate);
  const end = new Date(selectedCoupon.endDate);

  if (now < start || now > end || total < selectedCoupon.minOrderValue) {
    setSelectedCoupon(null);
    setDiscountedTotal(total);
    setShipFree(30000);
    return;
  }

  // Áp dụng mã giảm giá
  if (selectedCoupon.discountType === "Shipping") {
    setShipFree(Math.max(0, 30000 - selectedCoupon.discountValue));
    setDiscountedTotal(total);
  } else if (selectedCoupon.discountType === "PERCENT") {
    const discount = total * (selectedCoupon.discountValue / 100);
    setDiscountedTotal(total - discount);
    setShipFree(30000);
  } else {
    setDiscountedTotal(total);
    setShipFree(30000);
  }
}, [selectedCoupon, total]);

 
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await GET_CART();
        setCart(data);
        localStorage.setItem("itemPayment", carts);
      } catch (err) {
        setError("Không thể lấy giỏ hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const item of cart) {
        try {
          const response = await GET_ID(`catalog/products/${item.product.id}`);
          newImages[item.product.id] = response.imageUrl;
        } catch (error) {
          console.error(`Failed to fetch image for product ${item.product.id}`, error);
        }
      }
      setImages(newImages);
    };

    if (cart.length > 0) {
      fetchImages();
    }
  }, [cart]);
  console.log(images);

  console.log("Cart 2:", cart)

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
  
    country: "",
  });
const [errors, setErrors] = useState({});

  const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user.userID) { // Add a check to ensure user.userID exists
                console.warn("User ID not available to fetch user data.");
                return;
            }
            try {
                // Assuming GET_ID returns a response object directly
                const response = await GET_ID(`/accounts/users/${user.userID}`);
                console.log("Full API Response:", response); // Log the full response to inspect structure

                if (response && response.userDetails) {
                    const fetchedDetails = response.userDetails;

                    // Normalize the fetched data: replace null/undefined with empty strings
                    setUserDetails(prevDetails => ({
                        ...prevDetails, // Keep existing payment method, etc.
                        firstName: fetchedDetails.firstName ?? '',
                        lastName: fetchedDetails.lastName ?? '',
                        email: fetchedDetails.email ?? '',
                        phoneNumber: fetchedDetails.phoneNumber ?? '',
                        street: fetchedDetails.street ?? '',
                            // Add for this field
                        locality: fetchedDetails.locality ?? '',         // Add for this field
                        country: fetchedDetails.country ?? ''
                    }));
                    console.log("data11: ", fetchedDetails); // This will show the raw fetched data
                    console.log("Normalized UserDetails State:", userDetails); // This will show the state after normalization
                } else {
                    console.log("No userDetails found in response or response is null.");
                    // Optional: Initialize userDetails to empty if no data found
                    setUserDetails(prevDetails => ({
                        ...prevDetails,
                        firstName: "", lastName: "", email: "", phoneNumber: "",
                        street: "", streetNumber: "", zipCode: "", locality: "", country: ""
                    }));
                }

            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, [user.userID]);
const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") {
        const parts = value.split(' ');
        const newFirstName = parts[0] || '';
        const newLastName = parts.slice(1).join(' ') || '';
        setUserDetails(prevDetails => ({
            ...prevDetails,
            firstName: newFirstName,
            lastName: newLastName
        }));
    } else if (name === "payment") {
        setUserDetails(prevDetails => ({
            ...prevDetails,
            payment: value
        }));
    } else {
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    }
    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
    }));
};

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  if (loading) return <p>Đang tải giỏ hàng...</p>;
  const clearCart = async () => {
    let cartId = Cookies.get("cartId");
    if (!cartId) {
      toast.error("Cart not initialized. Please refresh the page.");
      return;
    }

    try {
      await DELETE(`shop/cart/del`);
      console.log("Cart deleted successfully!");
      setCart([]); // Cập nhật giỏ hàng trong context
      // alert("Xác nhận xóa giỏ hàng!");
      //navigate("/");
    } catch (error) {
      console.error("Failed to delete cart:", error);
      setError(error.message || "Đã xảy ra lỗi khi xóa giỏ hàng.");
    }
  };


 
  console.log("DdiscountedTotal: ", discountedTotal);
  console.log("shipFree: ", shipFree);

  const saveOrder = async () => {
    if (!user.userID) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8900/api/shop/order/${user.userID}`,
        {
          code: selectedCoupon ? selectedCoupon.code : ''
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log("Data Payment: ", response.data);
toast.success("Đặt hàng thành công");
       clearCart();
      navigate('/');
if (selectedCoupon) {
      try {
        await axios.delete(`http://localhost:8900/api/discount/user-coupons/${user.userID}/${selectedCoupon.code}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log("Coupon deleted successfully");
      } catch (deleteError) {
        console.error("Failed to delete coupon:", deleteError);
      }
    }


    } catch (error) {
      console.error("Failed to update quantity:", error);
      setError(error.message || "Đã xảy ra lỗi khi cập nhật số lượng.");
    }
  };

  // Handle order completion for COD or PayPal
const handleCompleteOrder = async () => {
    // 1. Kiểm tra validation của thông tin giao hàng
    const areDetailsValid = validateUserDetails();
    if (!areDetailsValid) {
        toast.warn('Vui lòng điền đầy đủ tất cả các thông tin giao hàng bắt buộc trước khi đặt hàng.');
        return; // Dừng lại nếu validation thất bại
    }

    //user là một prop được truyền vào từ Context/Redux hoặc lấy từ localStorage
    const currentUserId = user?.userID || localStorage.getItem('userId');
    if (!currentUserId) {
        navigate('/login');
        return;
    }

    // 2. Nếu là PayPal, xử lý khác (PayPalButtons sẽ tự gọi API)
    if (userDetails.payment === "paypal") {
       try {
            const dataToUpdateUser = {
                userDetails: {
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email,
                    phoneNumber: userDetails.phoneNumber,
                    street: userDetails.street,
         
           
                    locality: userDetails.locality,
                    country: userDetails.country
                },
                userName:userDetails.email
            };

            // Gọi API cập nhật thông tin người dùng
            const updateResponse = await axios.put(
                `http://localhost:8900/api/accounts/users/${currentUserId}`, // Endpoint backend cập nhật user
                dataToUpdateUser,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (updateResponse.status === 200) {
                console.log('Thông tin người dùng đã được cập nhật thành công:', updateResponse.data);
                // alert('Thông tin giao hàng đã được cập nhật. Đang tiến hành đặt hàng...'); // Có thể bỏ alert này

                // Nếu cập nhật thành công, tiếp tục lưu đơn hàng


            } else {
                const errorMsg = updateResponse.data?.message || 'Lỗi khi cập nhật thông tin người dùng.';
                console.error('Cập nhật thông tin người dùng thất bại:', errorMsg);
                toast.error(`Cập nhật thông tin giao hàng thất bại: ${errorMsg}`);
            }

        } catch (error) {
            console.error("Lỗi trong quá trình cập nhật thông tin hoặc đặt hàng:", error);
             toast.error("Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại!");
        }
        // toast.warn("Vui lòng hoàn tất thanh toán PayPal.");
        // return; // Đợi PayPal xử lý
    } else {
        // 3. Nếu không phải PayPal (ví dụ: COD), tiến hành cập nhật userDetails và sau đó đặt hàng
        try {
            const dataToUpdateUser = {
                userDetails: {
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email,
                    phoneNumber: userDetails.phoneNumber,
                    street: userDetails.street,
     
           
                    locality: userDetails.locality,
                    country: userDetails.country
                },
                userName:userDetails.email
            };

            // Gọi API cập nhật thông tin người dùng
            const updateResponse = await axios.put(
                `http://localhost:8900/api/accounts/users/${currentUserId}`, // Endpoint backend cập nhật user
                dataToUpdateUser,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (updateResponse.status === 200) {
                console.log('Thông tin người dùng đã được cập nhật thành công:', updateResponse.data);
                // alert('Thông tin giao hàng đã được cập nhật. Đang tiến hành đặt hàng...'); // Có thể bỏ alert này

                // Nếu cập nhật thành công, tiếp tục lưu đơn hàng
                await saveOrder();

            } else {
                const errorMsg = updateResponse.data?.message || 'Lỗi khi cập nhật thông tin người dùng.';
                console.error('Cập nhật thông tin người dùng thất bại:', errorMsg);
                toast.error(`Cập nhật thông tin giao hàng thất bại: ${errorMsg}`);
            }

        } catch (error) {
            console.error("Lỗi trong quá trình cập nhật thông tin hoặc đặt hàng:", error);
             toast.error("Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại!");
        }
    }
};

const validateUserDetails = () => {
    const newErrors = {};

    // --- Required fields check ---
    // Note: 'fullName' is a conceptual field for the combined firstName/lastName input
    if (!userDetails.firstName.trim() || !userDetails.lastName.trim()) {
        newErrors.fullName = 'Họ và tên không được để trống.';
    }
    if (!userDetails.email.trim()) {
        newErrors.email = 'Email không được để trống.';
    }
    if (!userDetails.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Số điện thoại không được để trống.';
    }
    if (!userDetails.street.trim()) {
        newErrors.street = 'Đường không được để trống.';
    }
        
    if (!userDetails.locality.trim()) { // Assuming locality is required for shipping
        newErrors.locality = 'Tỉnh/Thành phố/Địa phương không được để trống.';
    }
    if (!userDetails.country.trim()) {
        newErrors.country = 'Quốc gia không được để trống.';
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
};
// Ví dụ: Đặt hàm này trong cùng một component hoặc file util
const updateUserDetailsOnBackend = async (userId, userDetailsData) => {
    try {
        const dataToUpdateUser = {
            userDetails: {
                firstName: userDetailsData.firstName,
                lastName: userDetailsData.lastName,
                email: userDetailsData.email,
                phoneNumber: userDetailsData.phoneNumber,
                street: userDetailsData.street,
                locality: userDetailsData.locality,
                country: userDetailsData.country
            },
            userName: userDetailsData.email
        };

        const updateResponse = await axios.put(
            `http://localhost:8900/api/accounts/users/${userId}`,
            dataToUpdateUser,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (updateResponse.status === 200) {
            console.log('Thông tin người dùng đã được cập nhật thành công (từ hàm updateUserDetailsOnBackend):', updateResponse.data);
            return { success: true };
        } else {
            const errorMsg = updateResponse.data?.message || 'Lỗi khi cập nhật thông tin người dùng.';
            console.error('Cập nhật thông tin người dùng thất bại (từ hàm updateUserDetailsOnBackend):', errorMsg);
            return { success: false, message: errorMsg };
        }

    } catch (error) {
        console.error("Lỗi trong quá trình cập nhật thông tin user:", error);
        if (error.response) {
            return { success: false, message: error.response.data?.message || error.message };
        } else if (error.request) {
            return { success: false, message: "Không thể kết nối đến server để cập nhật thông tin." };
        } else {
            return { success: false, message: `Lỗi không xác định khi cập nhật thông tin: ${error.message}` };
        }
    }
};
  return (

    // <PayPalScriptProvider options={{ "client-id": "AY7GrfYH7z7Dai8jDZBIaJrDUzD0F_jpg_DbUUeN8Rz0Kal0ghHCpU3Fg5JOXg88Ui9d95ub9zGJg2OG", currency: "USD" }}>

      <div className="container mt-4">
        <div className="row">
          {/* Thông tin giao hàng */}
          <div className="col-md-4">
            <h3>Thông tin giao hàng</h3>
          <form className="shipping-info">
            <div className="mb-3">
                <label className="form-label">Họ và tên:</label>
                <input
                    type="text"
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    name="fullName"
                    value={`${userDetails.firstName || ''} ${userDetails.lastName || ''}`}
                    onChange={handleInputChange}
                    required
                />
                {/* HIỂN THỊ LỖI CHO HỌ VÀ TÊN */}
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={userDetails.email || ''}
                    onChange={handleInputChange}
                    required
                />
                {/* HIỂN THỊ LỖI CHO EMAIL */}
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Số điện thoại:</label>
                <input
                    type="text"
                    className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                    name="phoneNumber"
                    value={userDetails.phoneNumber || ''}
                    onChange={handleInputChange}
                    required
                />
                {/* HIỂN THỊ LỖI CHO SỐ ĐIỆN THOẠI */}
                {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Đường:</label>
                <input
                    type="text"
                    className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                    name="street"
                    value={userDetails.street || ''}
                    onChange={handleInputChange}
                    required
                />
                {/* HIỂN THỊ LỖI CHO ĐƯỜNG */}
                {errors.street && <div className="invalid-feedback">{errors.street}</div>}
            </div>

            {/* Thêm các trường Số nhà, Mã bưu chính, Tỉnh/Thành phố/Địa phương nếu cần */}
           
            

            <div className="mb-3">
                <label className="form-label">Tỉnh/Thành phố/Địa phương:</label>
                <input
                    type="text"
                    className={`form-control ${errors.locality ? 'is-invalid' : ''}`}
                    name="locality"
                    value={userDetails.locality || ''}
                    onChange={handleInputChange}
                    required
                />
                {/* HIỂN THỊ LỖI CHO TỈNH/THÀNH PHỐ */}
                {errors.locality && <div className="invalid-feedback">{errors.locality}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Quốc gia:</label>
                <input
                    type="text"
                    className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                    name="country"
                    value={userDetails.country || ''}
                    onChange={handleInputChange}
                    required
                />
                {/* HIỂN THỊ LỖI CHO QUỐC GIA */}
                {errors.country && <div className="invalid-feedback">{errors.country}</div>}
            </div>
        </form>
            {/* Phương thức thanh toán */}
            <h5>Phương thức thanh toán</h5>
            <div className="form-check">
              <input type="radio" className="form-check-input" name="payment" value="cod" onChange={handleInputChange} required />
              <label className="form-check-label">Thanh toán khi giao hàng (COD)</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" name="payment" value="paypal" onChange={handleInputChange} required />
              <label className="form-check-label">Thanh toán bằng PayPal</label>
            </div>

            {/* Hiển thị PayPal khi chọn */}
            {userDetails.payment === "paypal" && (
              <div className="mt-3">
                <PayPalButtons

                  createOrder={async (data, actions) => {
                    const currentUserId = user?.userID || localStorage.getItem('userId');
                    try {
                      const updateResult = await updateUserDetailsOnBackend(currentUserId, userDetails);
                          if (!updateResult.success) {
                        toast.error(`Không thể cập nhật thông tin giao hàng: ${updateResult.message}. Vui lòng thử lại!`);
                        throw new Error("Failed to update user details before PayPal order."); // Ngăn tạo order
                    }

                      const exchangeRate = 24000; // Tỷ giá cố định

                      const amountUSD = await ((total / exchangeRate).toFixed(2));
                      console.log("Giá trị chuyển đổi sang USD:", amountUSD); // Debug xem có giá trị hợp lệ không

                      if (!amountUSD || isNaN(amountUSD) || amountUSD <= 0) {
                        throw new Error("Số tiền không hợp lệ!");
                      }
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{
                          amount: {
                            value: amountUSD.toString(),
                            currency_code: "USD" // Specify the currency
                          },
                        }],
                      });
                    } catch (error) {
                      console.error("Lỗi khi tạo đơn hàng PayPal:", error);
                      toast.error("Có lỗi khi tạo đơn hàng. Vui lòng thử lại!");
                    }
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then(function (details) {

                      // alert(`Transaction completed by ${details.payer.name.given_name}`);
                      updateUserDetailsOnBackend();
                      saveOrder();
                      clearCart();
                      navigate('/', { state: { message: `Transaction completed by ${details.payer.name.given_name}` } });
                    });
                  }}
                  onError={(err) => {
                    console.error('PayPal Checkout onError', err);
                    toast.error('Có lỗi xảy ra khi xử lý thanh toán PayPal.');
                  }}
                />
              </div>
            )}

            {/* Nút hoàn tất đơn hàng */}
            <button type="button" className="btn bg-orange w-100 mt-3" onClick={handleCompleteOrder}>
              Hoàn tất đơn hàng
            </button>
          </div>

          {/* Giỏ hàng */}
          <div className="col-md-7 ml-5">
            <h3 className="text-center">Giỏ hàng</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ?
                  cart.map(item => {
                    return (
                      <tr className='product-item ' key={`${item.id}`}>
                      <td className='d-flex align-items-center m-2'>
  <img 
    src={`/images/products/${images[item.product.id]}`}
    alt={item.product.productName} 
    style={{ width: '100px', height: 'auto' }} 
  />
  <div className='info-product ml-3' style={{ width: '350px' }}>
    <p className='text-uppercase mb-0'>{item.product.productName}</p>
  </div>
</td>

                        <td className='price-product' style={{ width: '120px' }}>{VND.format(item.product.price)}</td>
                        <td>
                          <div className="quantity-cart text-center">
                            {item.quantity}
                          </div>
                        </td>
                        <td className='price-product'>{VND.format(item.subTotal)}</td>
                      </tr>
                    )
                  }
                  ) :
                  <tr>
                    <td colSpan={4}>Không có sản phẩm nào trong giỏ hàng!</td>
                  </tr>
                }
              </tbody>
            </table>

            {/* Mã giảm giá */}
            {/* Phần nhập mã giảm giá */}
<div>
  {/* Phần nhập mã giảm giá */}
  <div className="input-group mb-3" style={{ maxWidth: '700px' }}>
    <input
      type="text"
      value={selectedCoupon ? selectedCoupon.code : ""}
      placeholder="Nhập hoặc chọn mã giảm giá"
      className="border p-2 rounded w-full cursor-pointer"
      onClick={() => setShowCouponModal(true)}
      readOnly
    />
    <button
      className="btn btn-warning"
      onClick={() => {
        if (selectedCoupon) {
          handleCouponSelect(selectedCoupon);
        } else {
          toast.warn("Vui lòng chọn mã giảm giá");
          // alert("Vui lòng chọn mã giảm giá");
        }
      }}
    >
      Thêm
    </button>
  </div>

  {/* Hàng 2: phần tổng tiền, căn phải */}
  <div className="d-flex ">
    <div className="border p-3" style={{ minWidth: '300px', maxWidth: '400px' }}>
      <p>Sản phẩm: <strong>{VND.format(total)}</strong></p>
      <p>Phí vận chuyển: <strong>{VND.format(30000)}</strong></p>
      <p>Tạm tính: <strong>{VND.format(total + 30000)}</strong></p>

      {selectedCoupon && selectedCoupon.discountType === "Shipping" ? (
        <p>Sau áp mã giảm giá: <strong>-{VND.format(30000 - shipFree)}</strong></p>
      ) : (
        <p>Sau áp mã giảm giá: <strong>{selectedCoupon ? `${selectedCoupon.discountValue}%` : "0%"}</strong></p>
      )}

      <p className="fw-bold">
        Tổng cộng: &nbsp;
        <strong>{VND.format(discountedTotal + shipFree)}</strong>
      </p>
    </div>
  </div>

  {/* Modal mã giảm giá */}
  <CouponModal
    userId={user.userID}
    show={showCouponModal}
    onClose={() => setShowCouponModal(false)}
    onSelect={(coupon) => {
      setShowCouponModal(false);
      handleCouponSelect(coupon);
    }}
  />
</div>

                
                </div>
                      </div>
      </div>
    // </PayPalScriptProvider>
  );
};

export default Checkout;