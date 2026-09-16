import AboutSection from "../components/home/AboutSection";
import { toPerfumes } from "../components/home/catalogData";
import FooterSection from "../components/home/FooterSection";
import HeroContent from "../components/home/HeroContent";
import BestSellersSection from "../components/home/BestSellersSection";
import { useProductsQuery } from "../hooks/useProductsQuery";

function HomePage() {
  const { data: products = [] } = useProductsQuery();
  const perfumes = toPerfumes(products);

  return (
    <>
      <HeroContent />
      <BestSellersSection perfumes={perfumes} />
      <AboutSection />
      <FooterSection />
    </>
  );
}

export default HomePage;
