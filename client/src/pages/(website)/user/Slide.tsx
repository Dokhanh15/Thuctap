import { useEffect, useState } from "react";
import bannerImage1 from "../../../../assets/img/header/baner.jpg";
import bannerImage2 from "../../../../assets/img/header/baner2.jpg";
import bannerImage3 from "../../../../assets/img/header/baner3.jpg";
const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bannerImage1, bannerImage2, bannerImage3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div>
      <div className="relative w-full h-[600px] max-w-full mx-auto">
        <div className="overflow-hidden relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-transform duration-500 ease-in-out transform ${
                index === currentSlide ? "translate-x-0" : "translate-x-full"
              }`}
              style={{
                transform: `translateX(${(index - currentSlide) * 100}%)`,
              }}
            >
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-[30px]  lg:text-4xl xl:text-5xl font-bold mb-4 mx-10">
                  Discover Your Street Style with Our Diverse Collection of
                  Streetwear
                </h1>
                <p className="text-[20px]  lg:text-lg xl:text-xl mb-8 mx-5">
                  Get your unique streetwear style with our various collections.
                  Shop now to look fashionable with the latest trends.
                </p>
                <button className="px-6 py-3 bg-white text-black rounded-full font-semibold transition ease-in-out transform hover:scale-105">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
