import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { DELETE, GET_CART, GET_ID, POST_ADD } from "../api/apiService";
import { CartContext } from "../context/CartContext";
import UserContext from "../context/UserContext";
import CouponModal from "../components/coupon/couponSection";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const CartSection = () => {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);

  const navigate = useNavigate();

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.subTotal, 0);
  }, [cart]);

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

  useEffect(() => {
    const newTotal = total - (total * discountPercent) / 100;
    setDiscountedTotal(newTotal);
  }, [total, discountPercent]);

  useEffect(() => {
    let existingCartId = Cookies.get("cartId");
    if (!existingCartId) {
      let newCartId = "cart1";
      Cookies.set("cartId", newCartId, { path: "/cart", expires: 7 });
    }
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await GET_CART();
        setCart(data.length ? data : []);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCart([]);
        } else {
          setError("Không thể lấy giỏ hàng.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleCouponSelect = (coupon) => {
    if (!coupon) return;

    if (total < coupon.minOrderValue) {
      alert(`Đơn hàng phải trên ${coupon.minOrderValue} để áp dụng mã này.`);
      setDiscountPercent(0);
      setSelectedCoupon(null);
      return;
    }

    if (coupon.discountType === "PERCENT") {
      setDiscountPercent(coupon.discountValue);
    } else {
      setDiscountPercent(0);
    }

    setSelectedCoupon(coupon);
    alert(`Áp dụng mã ${coupon.code} giảm ${coupon.discountValue}%`);
  };
const deleteItem = async (product_id) => {
        let cartId = Cookies.get("cartId");
        if (!cartId) {
            alert("Cart not initialized. Please refresh the page.");
            return;
        }
        try {
            await DELETE(`shop/cart`, `productId=${product_id}`);
            console.log("Item deleted successfully!");

            try {
                const updatedCart = await GET_CART();
                setCart(updatedCart.length ? updatedCart : []);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setCart([]);
                } else {
                    setError("Không thể lấy giỏ hàng.");
                }
            }
toast.success("Xóa thành công");
     
        } catch (error) {
            console.error("Failed to delete item:", error);
            setError(error.message || "Đã xảy ra lỗi khi xóa sản phẩm.");
        }
    };
  const clearCart = async () => {
    let cartId = Cookies.get("cartId");
    if (!cartId) {
      alert("Cart not initialized. Please refresh the page.");
      return;
    }
    try {
      await DELETE(`shop/cart/del`);
      setCart([]);
      alert("Xác nhận xóa giỏ hàng!");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete cart:", error);
      setError(error.message || "Đã xảy ra lỗi khi xóa giỏ hàng.");
    }
  };

  const decrementQuantity = (product_id, quantity) => {
    if (quantity < 1) return;
    changeQuantity(product_id, quantity - 1);
  };

  const incrementQuantity = (product_id, quantity) => {
    changeQuantity(product_id, quantity + 1);
  };

  const changeQuantity = async (product_id, quantity) => {
    let cartId = Cookies.get("cartId");
    if (!cartId) {
      alert("Cart not initialized. Please refresh the page.");
      return;
    }
    try {
      const response = await POST_ADD(`shop/cart`, `productId=${product_id}&quantity=${quantity}`);
      setCart(response);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setError(error.message || "Đã xảy ra lỗi khi cập nhật số lượng.");
    }
  };

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className='section-cart' style={{ margin:'20px' }}>

        <Row>
          <Col md={12}>
            <Breadcrumb>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Trang chủ
              </Breadcrumb.Item>
      
               <Breadcrumb.Item active>
               Giỏ hàng
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className='cart'>
          <div className='cart-container row'>
            <div className='cart-main '>
              <div className='list-cart card p-2'>
                <table>
                  <thead>
                    <tr>
                      <th>Thông tin sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length > 0 ? cart.map(item => (
                      <tr className='product-item border' key={item.id}>
                        <td className='row m-2'>
                          <div className='col-1'>
                            <img
                              src={`/images/products/${images[item.product.id]}`}
                              alt={item.product.productName}
                              style={{ width: '100px' }}
                            />
                          </div>
                          <div className='info-product ml-2' style={{ width: '520px' }}>
                            <h5 className='text-uppercase'>{item.product.productName}</h5>
                            <div
                              className='delete mt-2 btn btn-danger'
                              style={{ cursor: 'pointer' }}
                              onClick={() => deleteItem(item.product.id)}
                            >
                              Xóa
                            </div>
                          </div>
                        </td>
                        <td className='price-product' style={{ width: '120px' }}>{VND.format(item.product.price)}</td>
                        <td style={{ width: '120px' }}>
                          <div className="quantity-cart d-flex align-items-center">
                            <button className="btn btn-warning btn-sm px-2" onClick={() => decrementQuantity(item.product.id, item.quantity)}>-</button>
                            <input type="text" className="form-control form-control-sm text-center mx-1" style={{ width: "40px" }} value={item.quantity} readOnly />
                            <button className="btn btn-warning btn-sm px-2" onClick={() => incrementQuantity(item.product.id, item.quantity)}>+</button>
                          </div>
                        </td>
                        <td className='price-product'>{VND.format(item.subTotal)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4}>Không có sản phẩm nào trong giỏ hàng!</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}></td>
                      <td className='font-weight-bold'> Tổng tiền: </td>
                      <td className='total'>{VND.format(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
                <div className='mt-3 d-flex justify-content-between'>
                    <button className='btn btn-success' onClick={clearCart}>Hủy giỏ hàng</button>
                    <Link className='btn btn-warning' to="/checkout" state={{ discountedTotal, coupon: selectedCoupon }}>
                      Thanh toán
                    </Link>
                  </div>
            </div>

            {/* <div className='cart-action col-md-3 card'>
              <div className="coupon-section ml-2">
                <div className="coupon-input">
                  <label>Có mã giảm giá không?</label>
                  <div className='row ml-1'>
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
                      onClick={() => handleCouponSelect(selectedCoupon)}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
                <CouponModal
                  userId={user.userID}
                  show={showCouponModal}
                  onClose={() => setShowCouponModal(false)}
                  onSelect={handleCouponSelect}
                />
                <div className="price-breakdown">
                  <div className="font-weight-bold">
                    <span>Tổng tiền: </span>
                    <span className='text-xl-left'>{VND.format(total)}</span>
                  </div>
                  <div className="font-weight-bold">
                    <span>Giảm giá: </span>
                    <span>{selectedCoupon ? selectedCoupon.discountValue + "%" : "0%"}</span>
                  </div>
                  <div className="font-weight-bold total">
                    <span>Tổng thành tiền: </span>
                    <span>{VND.format(discountedTotal)}</span>
                  </div>
               
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSection;