import React, { useState, useEffect } from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

const ImgSlider = ({ images, defaultIndex, prevImg, nextImg }) => {
  console.log(images, defaultIndex);

  const [currentImageIndex, setCurrentImageIndex] = useState(defaultIndex);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    setCurrentImageIndex(defaultIndex);
  }, [defaultIndex]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === "ArrowLeft") {
        prevSlide();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentImageIndex]);
  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event) => {
    const touchEndX = event.touches[0].clientX;
    const touchDeltaX = touchEndX - touchStartX;
    const sensitivity = 50; // Adjust this value as needed
    if (touchDeltaX > sensitivity) {
      prevSlide();
    } else if (touchDeltaX < -sensitivity) {
      nextSlide();
    }
  };
  const nextSlide = () => {
    nextImg();
    const newIndex = (currentImageIndex + 1) % images.length;
    console.log("Next index: ", newIndex);
    setCurrentImageIndex(newIndex);
  };

  const prevSlide = () => {
    prevImg();
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    console.log("Previous index: ", newIndex);
    setCurrentImageIndex(newIndex);
  };

  return (
    <div
      className="image_slider_container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <button className="slide_btn prev" onClick={prevSlide}>
        <NavigateBeforeIcon style={{ fontSize: 35 }} />
      </button>
      <div className="image_slider">
        <img
          src={images[defaultIndex].image_file_url}
          alt={`Slide`}
          style={{
            minWidth: "auto",
            width: "100%",
            maxWidth: "calc(100vh - 200px)",
            display: "block",
            marginInline: "auto",
          }}
        />
      </div>
      <button className="slide_btn next" onClick={nextSlide}>
        <NavigateNextIcon style={{ fontSize: 35 }} />
      </button>
    </div>
  );
};

export default ImgSlider;
