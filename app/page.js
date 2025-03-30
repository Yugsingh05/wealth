import FeaturesData from "@/components/featuresData";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Join from "@/components/Join";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {

  const {userId} = await auth();
  console.log(userId);

  return (
   <div className={"mt-40"}>
    <HeroSection/>
    <Stats/>
    <FeaturesData/>
    <HowItWorks/>
    <Testimonials/>
   <Join/>
   </div>
  );
}
