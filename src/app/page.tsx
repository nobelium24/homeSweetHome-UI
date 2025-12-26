import Hero from '@/components/sections/Hero';
import CategoriesSection from '@/components/sections/Categories';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import ReviewsSection from '@/components/sections/Reviews';
import LatestArrivals from '@/components/sections/LatestArrivals';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <ReviewsSection />
      <LatestArrivals />
      <Footer />
    </div>
  );
}