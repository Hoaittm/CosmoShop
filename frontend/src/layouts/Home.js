import React from 'react'
import Slider from '../page/home/Slider'
import Deal from '../page/home/Deal'



import Items from '../page/home/Items'


import Coupons from '../page/home/Coupons'

import Chatbot from './Chatbot'

import PostPage from '../page/home/PostPage'

const Home = (props) => {
  return (
    <div className='container'>
      <Slider/>
      <Deal/>
    
    
     <Coupons/>
      <Items/>
      <PostPage/>
    
   
      <Chatbot/>
    </div>
  )
}

export default Home
