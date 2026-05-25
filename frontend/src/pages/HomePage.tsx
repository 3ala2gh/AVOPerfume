import { useState } from "react";
import { motion } from "framer-motion";
import AboutSection from "../components/home/AboutSection";
import CategoriesSection from "../components/home/CategoriesSection";
import { type CategoryName } from "../components/home/catalogData";
import FooterSection from "../components/home/FooterSection";
import HeroContent from "../components/home/HeroContent";
import ProductsSection from "../components/home/ProductsSection";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("All");
  const reveal = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <>
      <HeroContent />
      <motion.div {...reveal}>
        <CategoriesSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <ProductsSection key={selectedCategory} selectedCategory={selectedCategory} />

        <AboutSection />

        
        <FooterSection />
      </motion.div>
    </>
  );
}

export default HomePage;
