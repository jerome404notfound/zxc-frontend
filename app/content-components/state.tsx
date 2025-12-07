"use client";

import { useState } from "react";
import Movie from "./movie";
import TvShow from "./tv";
import { Separator } from "@/components/ui/separator";
import { Film, Sword, Swords, Telescope, Tv } from "lucide-react";
import Discover from "./discover";
import Anime from "./anime";

export default function ContentState() {
  const [open, setOpen] = useState<"movie" | "tv" | "anime" | "discover">(
    "movie"
  );
  return (
    <div className="w-[90%] mx-auto">
      <div className="flex justify-center items-center w-full py-8 gap-12 text-lg tracking-wide">
        <span
          onClick={() => setOpen("movie")}
          className={`cursor-pointer flex items-center gap-2 active:scale-95 hover:scale-105 transition duration-50 ${
            open === "movie" ? "font-medium" : "text-muted-foreground"
          }`}
        >
          <Film className="size-5" /> Movie
        </span>
        <span
          onClick={() => setOpen("tv")}
          className={`cursor-pointer  flex items-center gap-2 active:scale-95 hover:scale-105 transition duration-50 ${
            open === "tv" ? "font-medium" : "text-muted-foreground"
          }`}
        >
          <Tv className="size-5" /> TV Show
        </span>
        <span
          onClick={() => setOpen("anime")}
          className={`cursor-pointer  flex items-center gap-2 active:scale-95 hover:scale-105 transition duration-50 ${
            open === "anime" ? "font-medium" : "text-muted-foreground"
          }`}
        >
          <Swords className="size-5" /> Anime
        </span>

        <span
          onClick={() => setOpen("discover")}
          className={`cursor-pointer  flex items-center gap-2 active:scale-95 hover:scale-105 transition duration-50 ${
            open === "discover" ? "font-medium" : "text-muted-foreground"
          }`}
        >
          <Telescope className="size-5" /> Discover
        </span>
        <Separator className="flex-1" />
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
