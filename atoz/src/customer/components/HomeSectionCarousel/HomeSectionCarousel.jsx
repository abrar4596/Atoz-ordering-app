import React, { useState, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import { Button } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import data from "../../../Data/Protein";

const HomeSectionCarousel = ({data,sectionName}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null); 

  const responsive = {
    0: { items: 1 },
    720: { items: 2 },
    1024: { items: 5.5 },
  };

  const handleSlidePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.slidePrev(); 
    }
  };

  const handleSlideNext = () => {
    if (carouselRef.current) {
      carouselRef.current.slideNext();
    }
  };

  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  const items = data.slice(0,15).map((item, id) => (
    <HomeSectionCard key={id} product={item} />
  ));

  return (
    <div className="px-4 lg:px-8">
      <div className="relative p-5">
        <h2 className="text-2xl pb-7 underline font-extrabold text-gray-800 py-5">{sectionName}</h2>
        <AliceCarousel
          ref={carouselRef} 
          items={items}
          responsive={responsive}
          disableButtonsControls 
          disableDotsControls
          onSlideChanged={syncActiveIndex}
          animationType="slide"
        />

        {activeIndex < items.length - 1 && (
          <Button
            className="z-50"
            onClick={handleSlideNext} 
            variant="contained"
            sx={{
              position: "absolute",
              top: "13rem",
              right: "0rem",
              transform: "translateX(50%) rotate(90deg)",
            }}
            color="white"
            aria-label="next"
          >
            <ArrowLeftIcon sx={{ transform: "rotate(90deg)", color: "black" }} />
          </Button>
        )}

        {activeIndex > 0 && (
          <Button
            className="z-50"
            onClick={handleSlidePrev} 
            variant="contained" 
            sx={{
              position: "absolute",
              top: "13rem",
              left: "0rem",
              transform: "translateX(-50%) rotate(-90deg)",
            }}
            color="white"
            aria-label="prev"
          >
            <ArrowLeftIcon sx={{ transform: "rotate(90deg)", color: "black" }} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeSectionCarousel;
