import sarah from '../assets/sarah.png'
import john from "../assets/john.png"
import rahul from "../assets/rahul.png"
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Sample testimonial data
const testimonials = [
  {
    name: "John D",
    feedback:
      "FixMate made finding a plumber so easy! Within minutes, I found a reliable professional who fixed my issue the same day. The process was seamless and stress-free.",
    avatar: john, // Replace with your avatar image paths
  },
  {
    name: "Sarah P",
    feedback:
      "As a busy mom, FixMate is a lifesaver! I've used it for electrical repairs and cleaning services, and every time, the professionals were timely, skilled, and polite.",
    avatar: sarah,
  },
  {
    name: "Rahul K",
    feedback:
      "FixMate connects me to trusted professionals every time. From electricians to plumbers, I've found convenient solutions for my issues. Highly recommended!",
    avatar: rahul,
  },
];

// Custom next and previous buttons for the slider
// eslint-disable-next-line react/prop-types
const CustomNextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-white-dark text-white p-2 rounded-full shadow-lg hover:bg-slate-300"
    onClick={onClick}
  >
   <IoIosArrowForward />
  </button>
);

// eslint-disable-next-line react/prop-types
const CustomPrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 transform -translate-y-1/2 z-10 bg-white-dark text-white p-2 rounded-full shadow-lg hover:bg-slate-300"
    onClick={onClick}
  >
    <IoIosArrowBack />
  </button>
);

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-gray-50 py-16 px-7">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        What our clients say
      </h2>
      <div className="container mx-auto">
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4">
              <div className="bg-green-100 p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-green-500"
                  />
                </div>
                <p className="text-gray-700 text-sm text-center mb-4">
                  {testimonial.feedback}
                </p>
                <h4 className="text-green-500 font-semibold text-center">
                  {testimonial.name}
                </h4>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
