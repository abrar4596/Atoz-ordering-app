import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import CarouselData from './CarouselImg/CarouselData'; 





const Carousel = () => {


const items = CarouselData.map((item) => <img className='cursor-pointer flex items-center justify-center w-full max-w-[800rem] h-64 overflow-hidden -z-10' role='presentation'
 src={item.image} alt="" />)

return(
    <AliceCarousel
        autoPlay
        autoPlayInterval={900}
        animationDuration={800}
        animationType="fadeout" 
        fixedheight
        infinite
        disableButtonsControls
        items={items}
    />
)
};

export default Carousel;