import Hero from '@/components/Hero';
import PropertySearch from '@/components/PropertySearch';
import FeaturedProperties from '@/components/FeaturedProperties';
import AIInsights from '@/components/AIInsights';

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <PropertySearch />
      <FeaturedProperties />
      <AIInsights />
    </div>
  );
}
