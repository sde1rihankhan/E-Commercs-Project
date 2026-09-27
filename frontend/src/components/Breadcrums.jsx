import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrums = ({singleProduct}) => {
  
  return (
    <div>
      <div className='flex gap-4'>
        <Link className='text-gray-500' to='/'>Home {'  >'}</Link>
        
        <Link className='text-gray-500' to='/product'>Product {'  >'}</Link>
        <p>{singleProduct.productName
        }</p>
      </div>
    </div>
  )
}

export default Breadcrums