import { useEffect, useState } from "react";
import { z } from "zod";
import Navbar from "./_components/NavbarComponent";
import Hero from "./_components/hero";
import VenueSection from "./_components/venuesection";
import SparringSection from "./_components/SparringSection";
import CompetitionSection from "./_components/CompetitionSection";
import TestimonialSection from "./_components/TestimonialSection";
import Footer from "./_components/Footer";
import FilterSelect from "./_components/FilterSelect";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero />
      <FilterSelect/>
      <VenueSection />
      <SparringSection />
      <CompetitionSection />
      <TestimonialSection />
      <Footer />
    </main>
  );
}
