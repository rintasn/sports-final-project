import { useEffect, useState } from "react";
import { z } from "zod";
import Navbar from "./_components/navbar";
import Hero from "./_components/hero";
import VenueSection from "./_components/venuesection";
import SparringSection from "./_components/SparringSection";
import CompetitionSection from "./_components/CompetitionSection";
import TestimonialSection from "./_components/TestimonialSection";
import Footer from "./_components/Footer";
import FilterSelect from "./_components/FilterSelect";

// Define the schema using zod
const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const ApiResponseSchema = z.object({
  error: z.boolean(),
  result: z.object({
    current_page: z.number(),
    data: z.array(CategorySchema),
    first_page_url: z.string(),
    from: z.number(),
    last_page: z.number(),
    last_page_url: z.string(),
    links: z.array(
      z.object({
        url: z.string().nullable(),
        label: z.string(),
        active: z.boolean(),
      })
    ),
    next_page_url: z.string().nullable(),
    path: z.string(),
    per_page: z.number(),
    prev_page_url: z.string().nullable(),
    to: z.number(),
    total: z.number(),
  }),
});

type Category = z.infer<typeof CategorySchema>;

export default function Home() {
  const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activities, setActivities] = useState<{ id: number; name: string }[]>(
    []
  );
  const [sportsBranches, setSportsBranches] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [location, setLocation] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in localStorage");
        }

        const response = await fetch(
          `${BASE_URL}/api/v1/sport-categories?is_paginate=true&per_page=5&page=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const parsedData = ApiResponseSchema.parse(data);

        if (parsedData.error) {
          throw new Error("An error occurred while fetching categories");
        }

        setCategories(parsedData.result.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main>
      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Navbar categories={categories} />
      )}
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
