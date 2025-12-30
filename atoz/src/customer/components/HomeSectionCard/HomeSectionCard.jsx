import React from 'react'




const HomeSectionCard = ({product}) => {
return (
    <div className='cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg
     overflow-hidden w-[15rem] mx-3 border-black'>
            <div className='h-[13rem] w-[10rem]'>
                    <img
                        src={product.image}
                        alt="Container evoking a sense of health and nutrition"
                        className='object-cover'
                    />
            </div>
            
            <div className='p-4'>
                <h3 className='text-lg font-medium text-gray-900'>{product.name}</h3>
                <p className='mt-2 text-sm text-gray-500'>{product.brand}</p>    
            </div>

    </div>
)
}

export default HomeSectionCard;