import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../../redux/action/productAction';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const favoriteProducts = useSelector(state => state.product.favoriteProducts);

    const isFavorited = favoriteProducts.some(p => p.id === product.id);

    const toggleFavorite = (e) => {
        e.preventDefault();

        if (!user || !user.username) {
            navigate("/login");
            return;
        }

        if (isFavorited) {
            dispatch(REMOVE_FAVORITE(product));
            toast.info("Đã xóa khỏi yêu thích");
        } else {
            dispatch(ADD_FAVORITE(product));
            toast.success("Đã thêm vào yêu thích");
        }
    };

    return (
        <div className="card h-100 shadow-sm">
            <figcaption className="info-wrap p-3 d-flex flex-column">
                <Link to={`/product-detail/${product.id}`} className="d-flex justify-content-center mb-3" style={{ height: '220px' }}>
                    <img
                        src={require(`/public/images/products/${product.imageUrl}`)}
                        alt={product.productName}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                </Link>

                <div className="info mb-2" style={{ flex: 1 }}>
                    <Link to={`/product-detail/${product.id}`} className="title font-weight-bold d-block mb-2">
                        {product.productName}
                    </Link>

                    {product.priceSale == null ? (
                        <div className="price-wrap mb-2">
                            <span className="price">{Number(product.price).toLocaleString()} VNĐ</span>
                        </div>
                    ) : (
                        <div className="price-wrap mb-2 d-flex align-items-center">
                            <small className="text-muted"><del>{product.price} VNĐ</del></small>
                            <span className="price ml-2 font-weight-bold text-danger">
                                {Number(product.price * (1 - product.priceSale / 100)).toLocaleString()} VNĐ
                            </span>
                        </div>
                    )}

                    <p className="mb-1">{product.availability} cái <small className="text-muted">- Số lượng tối thiểu</small></p>
                    <p className="text-muted mb-2">{product.category}</p>
                </div>

                <hr />

                <p className="mb-2"><span className="tag"><i className="fa fa-check"></i> Đã xác minh</span></p>

                <label className="custom-control custom-checkbox mb-2" onClick={toggleFavorite}>
                    <input type="checkbox" checked={isFavorited} readOnly className="custom-control-input" />
                    <div className="custom-control-label">
                        {isFavorited ? "Đã yêu thích" : "Thêm vào yêu thích"}
                    </div>
                </label>
            </figcaption>
        </div>
    );
};

export default ProductCard;
