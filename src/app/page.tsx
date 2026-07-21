import Hero from "@/features/home/modules/Hero/Hero";
import Stats from "@/features/home/modules/Stats/Stats";
import Howitworks from "@/features/home/modules/Howitworks/Howitworks";
import Professionals from "@/features/home/modules/Professionals/Professionals";
import Services from "@/features/home/modules/Services/Services";
import InstagramFeed from "@/features/home/modules/InstagramFeed/InstagramFeed";
import Testimonials from "@/features/home/modules/Testimonials/Testimonials";
import Cta from "@/features/home/modules/Cta/Cta";

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
