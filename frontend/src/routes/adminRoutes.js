import DashboardContent from "../admin/layouts/Admin";
import CreateProduct from "../admin/layouts/CreateProduct";

import AdminContactPanel from "../admin/pages/contact/AdContactSection";
import CreateCouSection from "../admin/pages/coupon/CreateCouSection";
import Login from "../admin/pages/Login";
import CreateOrderSection from "../admin/pages/order/CreateOrderSection";
import CreatePostSection from "../admin/pages/order/CreateOrderSection";
import DetailOrderSection from "../admin/pages/order/DetailOrderSection";
import EditProSection from "../admin/pages/products/EditProSection";
import ProductAdSection from "../admin/pages/products/ProductAdSection";
import AllUser from "../admin/pages/users/AlllUser";


const AdminRoutes =[
    { path: "create-product", component: CreateProduct },
    { path: "all-product", component: ProductAdSection },
    { path: "edit-product/:id", component: EditProSection },
    { path: "all-user", component: AllUser },
    { path: "order", component: CreateOrderSection },
    { path: "order/:userName/:id", component: DetailOrderSection },
    { path: "coupon", component: CreateCouSection },
     { path: "contact", component: AdminContactPanel },
       { path: "page", component: DashboardContent }

]


export default AdminRoutes;