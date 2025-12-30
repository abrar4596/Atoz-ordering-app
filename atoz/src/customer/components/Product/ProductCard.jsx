import React from 'react'
import './ProductCard.css'


function ProductCard() {
  return (
    <div className='ProductCard w-[15rem] m-3 transition-all cursor-pointer'>
       <div className='h-[20rem]'>
        <img className='h-full w-full object-cover object-left-top' src="" alt="" />
       </div>

      <div className='textPart bg-white p-3'>
          <div>
             <p className='font-bold opacity-60'>Brand</p>
             <p>here is the discription section</p>
          </div>
          <div className='flex items-center space-x-2'>
            <p className='font-semibold'>199rs</p>
            <p className='line-through opacity-50'>real199rs</p>
            <p className='text-green-600 font-semibold'>48% off</p>
          </div>

      </div>

    </div>
  )
}

export default ProductCard;