import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { GET_ID, POST_ADD } from '../../api/apiService';
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';
import UserContext from '../../context/UserContext';
import { CartContext } from '../../context/CartContext';
import ProductCard from '../../components/products/productCard';
import { Row, Col, Container, Breadcrumb } from 'react-bootstrap';
import { toast } from 'react-toastify';
const DetailSection = () => {
    const [product, setProduct] = useState({});
    const [sameProducts, setSameProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = useParams();
    const product_id = productId.productId;
    const navigate = useNavigate();
    const disPatch = useDispatch();
    const { user } = useContext(UserContext);
    const [recommendations, setRecommendations] = useState([]);
    const { cart, setCart } = useContext(CartContext);
    const sumRating = 0;

    useEffect(() => {
        let existingCartId = Cookies.get("cartId");
        if (!existingCartId) {
            let newCartId = `cart_${new Date().getTime()}`;
            Cookies.set("cartId", newCartId, { path: "/", expires: 7 });


        }
    }, []);

    console.log("productId: ", product_id)
    useEffect(() => {
        if (productId) {
            GET_ID(`catalog/products/${productId.productId}`)
                .then(response => {
                    setProduct(response);
                    fetchRecommendations(response.productName);
                    console.log("Data: ", response)
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch product:", error);
                    setError(error);
                    setLoading(false);
                });
        }
    }, [productId]);

    useEffect(() => {
        if (productId) {
            GET_ID(`catalog/products`)
                .then(response => {
                    setSameProducts(response);
                    console.log("Data: ", response)
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch product:", error);
                    setError(error);
                    setLoading(false);
                });
        }
    }, []);

    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const addProductToCart = async (e) => {
        e.preventDefault();

        if (!user || !user.username) {
            navigate("/login");
            return;
        }

        let cartId = Cookies.get("cartId");
        console.log("cartId: ", cartId);
        if (!cartId) {
            toast.error("Cart not initialized. Please refresh the page.");
            return;
        }

        try {
            let updatedCart;
            let newQuantity;

            const existingProductIndex = cart.findIndex((item) => item.product.id === product.id);

            if (existingProductIndex !== -1) {
                // 🔁 Sản phẩm đã có => tăng số lượng
                updatedCart = [...cart];
                newQuantity = updatedCart[existingProductIndex].quantity + quantity;
            } else {
                newQuantity = quantity;
                updatedCart = [...cart, { product, quantity }];
            }

            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            await POST_ADD(`shop/cart`, `productId=${product.id}&quantity=${newQuantity}`);
            // const response = await POST_ADD(`shop/cart`, `productId=${product_id}&quantity=${quantity}`);
            // console.log("Data in cart: ", response);


            // setCart(response);


            // localStorage.setItem("cart", JSON.stringify(response));

            toast.success("Thêm giỏ hàng thành công!");
        } catch (error) {
            console.error("Failed to add product to cart:", error);
            setError(error);
        }
    };
// const addProductToCart = async (e) => {
//         e.preventDefault();

//         if (!user || !user.username) {
//             navigate("/login");
//             return;
//         }

//         let cartId = Cookies.get("cartId");
//         if (!cartId) {
//             alert("Cart not initialized. Please refresh the page.");
//             return;
//         }

//         try {
//             let updatedCart;
//             let newQuantity;

//             const existingProductIndex = cart.findIndex((item) => item.product.id === product.id);

//             if (existingProductIndex !== -1) {
//                 // 🔁 Sản phẩm đã có => tăng số lượng
//                 updatedCart = [...cart];
//                 newQuantity = updatedCart[existingProductIndex].quantity + quantity;
//             } else {
//                 newQuantity = quantity;
//                 updatedCart = [...cart, { product, quantity }];
//             }

//             setCart(updatedCart);
//             localStorage.setItem("cart", JSON.stringify(updatedCart));

//             await POST_ADD(`shop/cart`, `productId=${product.id}&quantity=${newQuantity}`);

//             // Swal.fire({
//             //     icon: 'success',
//             //     title: 'Thành công!',
//             //     text: 'Sản phẩm đã được thêm vào giỏ hàng.',
//             //     showConfirmButton: false,
//             //     timer: 2000
//             // });
//         } catch (error) {
//             console.error("Failed to add product to cart:", error);
//             setError(error);
//         }
//     };
    const fetchRecommendations = (productName) => {
        const apiUrl = `http://localhost:8900/api/review/recommendations?name=${productName}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log("Rating: ", data);

                if (data.length > 0) {
                    const totalRating = data.reduce((sum, item) => sum + item.rating, 0);
                    const avgRating = totalRating / data.length;
                    setRecommendations(data);
                    setAvgRating(Math.round(avgRating)); // Làm tròn rating
                } else {
                    setAvgRating(0); // Nếu không có đánh giá nào
                }
            })
            .catch(error => {
                console.error("Failed to fetch recommendations:", error);
            });
    };

    const [avgRating, setAvgRating] = useState(0);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading product details</div>;

    return (
        <section className="section-content bg-white padding-y">
            <div className="container">
             <Container className="my-3"> {/* my-3 để tạo margin trên và dưới */}
      <Row>
        <Col md={12}>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>
           Tất cả sản phẩm
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              <b>{product.productName}</b>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
    </Container>
                <div className="row">
                    <aside className="col-md-6">
                        <div className="card">
                            <article className="gallery-wrap">
                                <div className="img-big-wrap">
                                    <div className='justify-content-center d-flex'>
                                        <img
                                            src={`/images/products/${product.imageUrl}`}
                                            alt={product.productName}
                                        />

                                    </div>
                                </div>
                            </article>
                        </div>
                    </aside>
                    <main className="col-md-6">
                        <article className="product-info-aside">
                            <h2 className="title mt-3">{product.productName}</h2>
                            <div className="rating-wrap my-3">
                                <ul className="rating-stars">
                                    <div style={{ display: 'flex' }}>
                                        {[...Array(5)].map((_, starIndex) => (
                                            <i
                                                key={starIndex}
                                                className={`fa fa-star ${starIndex < avgRating ? 'text-warning' : 'text-muted'}`}
                                            ></i>
                                        ))}
                                    </div>

                                </ul>
                                <small className="label-rating text-muted">{recommendations.length} đánh giá</small>
                                <small className="label-rating text-success">
                                    <i className="fa fa-clipboard-check"></i> 154 đã đặt hàng
                                </small>
                            </div>

                            {product.priceSale !== null ? (
                                <div className="mb-3">
                                 <var className="price h4">
  { Number(product.price * (1 - (product.priceSale / 100))).toLocaleString() } VNĐ
</var>

                                    <span className="text-muted" style={{ textDecoration: "line-through" }}> {Number(product.price).toLocaleString()} VNĐ</span>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <var className="price h4"> {Number(product.price).toLocaleString()} VNĐ</var>
                                </div>
                            )}

                            <p>{product.discription}</p>

                            <div className="form-row mt-4">
                                <div className="form-group col-3">
                                    <div className="input-group input-spinner">
                                        <div className="input-group-prepend">
                                            <button className="btn btn-danger" type="button" onClick={decrementQuantity} > &minus; </button>
                                        </div>
                                        <input type="text" className="form-control" value={quantity} readOnly />
                                        <div className="input-group-append">
                                            <button className="btn btn-danger" type="button" onClick={incrementQuantity}> +  </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-9">
                                    <button className="btn bg-orange" onClick={addProductToCart}>
                                        <i className="fas fa-shopping-cart"></i> <span className="text">Thêm vào giỏ hàng</span>
                                    </button>
                                    {/* <a href="/" className="btn btn-light">
                                        <i className="fas fa-envelope"></i> <span className="text">Contact supplier</span>
                                    </a> */}
                                </div>
                            </div>
                        </article>
                    </main>
                </div >
            </div >
  <div className="container">
  <header className="section-heading heading-line">
    <h4 className="title-section text-uppercase">SẢN PHẨM LIÊN QUAN</h4>
  </header>

  {sameProducts.filter(item => item.category === product.category && item.id !== product.id).length === 0 && (
    <p>Không có sản phẩm liên quan nào!</p>
  )}

  <div
    style={{
      display: 'flex',
      overflowX: 'auto',
      gap: '1rem',
      paddingBottom: '1rem',
      // Giới hạn chiều cao nếu muốn
      // maxHeight: '350px',
    }}
  >
    {sameProducts
      .filter(item => item.category === product.category && item.id !== product.id)
      .map(item => (
        <div
          key={item.id}
          style={{
            flex: '0 0 33.3333%',  // 3 sp trên 1 hàng, cố định 1/3 chiều ngang mỗi item
            maxWidth: '33.3333%',
          }}
        >
          <ProductCard product={item} />
        </div>
      ))}
  </div>
</div>

        </section >
    )
}

export default DetailSection
