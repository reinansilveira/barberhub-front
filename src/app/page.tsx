import Image from "next/image";
import styles from "./page.module.css";
import Hero from "@/pages/home/modules/Hero/Hero";
import Stats from "@/pages/home/modules/Stats/Stats";
import Howitworks from "@/pages/home/modules/Howitworks/Howitworks";
import Professionals from "@/pages/home/modules/Professionals/Professionals";
import Services from "@/pages/home/modules/Services/Services";
import InstagramFeed from "@/pages/home/modules/InstagramFeed/InstagramFeed";
import Testimonials from "@/pages/home/modules/Testimonials/Testimonials";
import Cta from "@/pages/home/modules/Cta/Cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Howitworks />
      <Professionals />
      <Services />
      <InstagramFeed />
      <Testimonials />
      <Cta />
    </main>
  );
}
