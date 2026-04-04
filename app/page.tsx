import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import AchievementGrid from "@/components/AchievementGrid";
import QuoteBlock from "@/components/QuoteBlock";
import QuoteBlockX from "@/components/QuoteBlock2";
import APCSection from "@/components/APCSection";
import AgendaSection from "@/components/AgendaSection";
import PressGrid from "@/components/PressGrid";
import GratitudeNote from "@/components/GratitudeNote";
import CommunityWall from "@/components/CommunityWall";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <AchievementGrid />
      <QuoteBlock />
      <APCSection />
      <AgendaSection />
       <QuoteBlockX />
      <PressGrid />
      <CommunityWall />
      <GratitudeNote />
      <ContactSection />
      <Footer />
    </main>
  );
}
