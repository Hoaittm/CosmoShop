import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import Home from './Home'
import UserLogin from './UserLogin'
import UserRegister from './UserRegister'
import AllProduct from './AllProduct'
import ProductDetail from './ProductDetail'
import Profile from './Profile'
import SearchResults from '../page/products/SearchResults'
import ProductCategory from '../page/products/ProductCategory'
import CartSection from '../cart/CartSection'
import Payment from '../components/Payment'
import Order from '../page/orders/Order'

import Checkout from '../cart/Checkout'
import LogoutContent from '../page/home/logout/LogoutContent'
import Header from './Header'
import Footer from './Footer'
const Main = () => {
  
  return (
    <main>
    <Header />
    <div>
      <Outlet />
    </div>
    <Footer />
  </main>
  )
}

export default Main
