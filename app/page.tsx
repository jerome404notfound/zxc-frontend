"use client";
import { useSearchParams } from "next/navigation";
import ContentState from "./content-components/state";
import LandingPage from "./landing-components/landing-page";
import SearchResult from "./search-components/search-results";
import SearchModal from "./search-components/search-modal";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import Link from "next/link";
import Header from "./header";

export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const isSearching = Boolean(query);
  return (
    <div>
      <Header />
      <LandingPage />

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.3,
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.25,
                ease: "easeInOut",
              },
            }}
          >
            <SearchResult />
          </motion.div>
        ) : (
          <ContentState />
        )}
      </AnimatePresence>

      <ScrollToTop />
    </div>
  );
}
