import FeaturedProducts from "../components/landing/FeaturedProducts";
import Feedbacks from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <FeaturedProducts />
      <Feedbacks />
      <Footer />
    </div>
  );
}

export default Home;
