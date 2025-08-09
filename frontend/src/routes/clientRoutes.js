import CartSection from "../cart/CartSection";
import Checkout from "../cart/Checkout";
import FavoriteProduct from "../components/products/FavoriteProduct";
import AllBlog from "../layouts/AllBlog";
import AllProduct from "../layouts/AllProduct";
import Home from "../layouts/Home";
import ProductDetail from "../layouts/ProductDetail";
import Profile from "../layouts/Profile";
import UserLogin from "../layouts/UserLogin";
import UserRegister from "../layouts/UserRegister";
import PostDetail from "../page/home/blog/ContentGenerator";

import ContactPage from "../page/home/contact/ContactPage";
import AllCoupon from "../page/home/coupon/AllCoupon";
import LogoutContent from "../page/home/logout/LogoutContent";
import PreviewPro from "../page/home/recommendation/PreviewPro";

import Order from "../page/orders/Order";
import ProductCategory from "../page/products/ProductCategory";
import SearchResults from "../page/products/SearchResults";

const ClientRoutes = [
    { 'path': "/", 'component': Home },
    { 'path': "/login", 'component': UserLogin },
    { 'path': "/signup", 'component': UserRegister },
    { 'path': "/logout", 'component':LogoutContent},
    { 'path': "/products", 'component': AllProduct },
    { 'path': "/blogs", 'component': AllBlog },
        { 'path': "/blogs/:title", 'component': PostDetail },
    { 'path': "/product-detail/:productId", 'component': ProductDetail },
    { 'path': "/profile", 'component': Profile },
    { 'path': "/cart", 'component': CartSection },

    { 'path': "/search", 'component': SearchResults },
    { 'path': "/:category", 'component': ProductCategory },
    { 'path':"/order", 'component': Order},
    { "path" : "/checkout", 'component' : Checkout },
    { "path": "/favorite-list", 'component': FavoriteProduct },
        { "path": "/coupon", 'component': AllCoupon },
    {"path":"/contact",'component':ContactPage},
    {"path":"/rating",'component':PreviewPro}



];
export default ClientRoutes;