import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  { id: 1, src: "https://via.placeholder.com/800x400?text=Lorem+Ipsum+1", alt: "Lorem Ipsum 1" },
  { id: 2, src: "https://via.placeholder.com/800x400?text=Lorem+Ipsum+2", alt: "Lorem Ipsum 2" },
  { id: 3, src: "https://via.placeholder.com/800x400?text=Lorem+Ipsum+3", alt: "Lorem Ipsum 3" }
];

function AutoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Thay đổi slide mỗi 3 giây

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="relative flex items-center justify-center w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
      >
        <FaChevronLeft className="text-gray-700" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
      >
        <FaChevronRight className="text-gray-700" />
      </button>
    </div>
  );
}

export default AutoSlider;
