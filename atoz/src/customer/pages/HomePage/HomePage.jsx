import React from 'react'
import Carousel from '../../components/HomeCarousel/Carousel';
import HomeSectionCarousel from '../../components/HomeSectionCarousel/HomeSectionCarousel';
import protein from '../../../Data/Protein';

function HomePage() {
  return (
    <div>
        <Carousel/>

        <div className='space-y-10 py-20 flex flex-col justify-center '>
          <HomeSectionCarousel data={protein} sectionName={"Protein"}/>
          <HomeSectionCarousel data={protein} sectionName={"vitamins"}/>
          <HomeSectionCarousel data={protein} sectionName={"tablets"}/>
          <HomeSectionCarousel data={protein} sectionName={"creatine"}/>
          <HomeSectionCarousel data={protein} sectionName={"omega-3"}/>
          <HomeSectionCarousel data={protein} sectionName={"serup"}/>
        </div>
    </div>
  )
}

export default HomePage