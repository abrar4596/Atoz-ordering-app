import React from 'react'




const HomeSectionCard = ({product}) => {
return (
    <div className='cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-full'>
            {/* Responsive image area (scales with the carousel item width) */}
            <div className='w-full aspect-[16/9] sm:aspect-[4/3] lg:aspect-[1/1] bg-gray-50'>
                    <img
                        src={product.image}
                        alt="Container evoking a sense of health and nutrition"
                        className='w-full h-full object-cover'
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