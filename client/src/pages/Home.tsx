import FeaturedProducts from "../components/landing/FeaturedProducts";
import Features from "../components/landing/Features";
import Feedbacks from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import ShopCategory from "../components/landing/ShopCategory";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <ShopCategory />
      <FeaturedProducts />
      <Features />
      <Feedbacks />
      <Footer />
    </div>
  );
}

export default Home;
