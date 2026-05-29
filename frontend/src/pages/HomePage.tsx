import { useState } from "react";
import { motion } from "framer-motion";
import AboutSection from "../components/home/AboutSection";
import CategoriesSection from "../components/home/CategoriesSection";
import { toPerfumes, type CategoryName } from "../components/home/catalogData";
import FooterSection from "../components/home/FooterSection";
import HeroContent from "../components/home/HeroContent";
import ProductsSection from "../components/home/ProductsSection";
import { useProductsQuery } from "../hooks/useProductsQuery";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("All");
  const { data: products = [] } = useProductsQuery();
  const perfumes = toPerfumes(products);
  const reveal = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <>
      <HeroContent />
      <CategoriesSection
        perfumes={perfumes}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <motion.div {...reveal}>
        <ProductsSection
          perfumes={perfumes}
          key={selectedCategory}
          selectedCategory={selectedCategory}
        />

        <AboutSection />

        <FooterSection />
      </motion.div>
    </>
  );
}

export default HomePage;
