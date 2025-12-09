"use client";

import { useState } from "react";
import Movie from "./movie";
import TvShow from "./tv";
import { Separator } from "@/components/ui/separator";
import { Film, LucideIcon, Sword, Swords, Telescope, Tv } from "lucide-react";
import Discover from "./discover";
import Anime from "./anime";
interface NavItemProps {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}
export default function ContentState() {
  const [open, setOpen] = useState<"movie" | "tv" | "anime" | "discover">(
    "movie"
  );
  return (
    <div className="lg:w-[90%] w-[98%] mx-auto">
      <div className="flex justify-center items-center w-full lg:py-8 py-4 lg:gap-12 gap-6  tracking-wide overflow-auto">
        <NavItem
          label="Movie"
          icon={Film}
          active={open === "movie"}
          onClick={() => setOpen("movie")}
        />

        <NavItem
          label="TV Show"
          icon={Tv}
          active={open === "tv"}
          onClick={() => setOpen("tv")}
        />

        <NavItem
          label="Anime"
          icon={Swords}
          active={open === "anime"}
          onClick={() => setOpen("anime")}
        />

        <NavItem
          label="Discover"
          icon={Telescope}
          active={open === "discover"}
          onClick={() => setOpen("discover")}
        />
        <Separator className="flex-1 bg-linear-to-r from-border to-transparent" />
      </div>
      {/* {open === "movie" && <Movie />} {open === "tv" && <TvShow />}{" "}
      {open === "discover" && <Discover />} */}
      <div className={open === "movie" ? "block" : "hidden"}>
        <Movie />
      </div>
      <div className={open === "tv" ? "block" : "hidden"}>
        <TvShow />
      </div>
      <div className={open === "anime" ? "block" : "hidden"}>
        <Anime />
      </div>

      <div className={open === "discover" ? "block" : "hidden"}>
        <Discover />
      </div>
    </div>
  );
}
const NavItem = ({ label, icon: Icon, active, onClick }: NavItemProps) => (
  <span
    onClick={onClick}
    className={`cursor-pointer flex items-center gap-2 
      active:scale-95 hover:scale-105 transition duration-50 lg:text-lg text-sm whitespace-nowrap
      ${active ? "font-medium" : "text-muted-foreground"}`}
  >
    <Icon className="size-5" />
    {label}
  </span>
);
