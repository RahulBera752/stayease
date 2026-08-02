import Hero from '../components/home/Hero.jsx';
import PopularDestinations from '../components/home/PopularDestinations.jsx';
import FeaturedHotels from '../components/home/FeaturedHotels.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import CallToAction from '../components/home/CallToAction.jsx';

const HomePage = () => {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <FeaturedHotels />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default HomePage;