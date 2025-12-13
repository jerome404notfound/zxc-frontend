"use client";
import logo from "@/assets/zxczxc.svg";
import { Fade as Hamburger } from "hamburger-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import {
  IconBookmark,
  IconDownload,
  IconLogin,
  IconPackages,
  IconSettings2,
} from "@tabler/icons-react";
import { GalleryVerticalEnd } from "lucide-react";
import SearchModal from "./search-components/search-modal";

export default function Header() {
  const [isOpen, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`fixed z-10 pt-4 pb-4 w-full transition-colors duration-300 ${
        scrolled ? "bg-background" : "bg-transparent"
      }`}
    >
      <div className=" w-[90%]  flex justify-between items-center mx-auto">
        <div className="size-11">
          <img className="h-full w-full" src={logo.src} alt="" />
        </div>
        <div className="flex items-center gap-3">
          <SearchModal />
          <Popover open={isOpen} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div>
                <Hamburger
                  distance="md"
                  direction="left"
                  toggled={isOpen}
                  toggle={setOpen}
                  rounded
                  hideOutline={false}
                />
              </div>
            </PopoverTrigger>

            <PopoverContent className="mt-2 grid grid-cols-4 gap-2" align="end">
              <span className="p-4 bg-popover rounded-md border flex flex-col gap-2">
                <IconBookmark />
                <p className="text-sm tracking-wide text-muted-foreground">
                  Watchlist
                </p>
              </span>
              <span className="p-4 bg-popover rounded-md border flex flex-col gap-2">
                <GalleryVerticalEnd />
                <p className="text-sm tracking-wide text-muted-foreground">
                  History
                </p>
              </span>

              <span className="p-4 bg-popover rounded-md border flex flex-col gap-2">
                <IconSettings2 />
                <p className="text-sm tracking-wide text-muted-foreground">
                  Settings
                </p>
              </span>
              <span className="p-4 bg-popover rounded-md border flex flex-col gap-2">
                <IconDownload />
                <p className="text-sm tracking-wide text-muted-foreground">
                  Updates
                </p>
              </span>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
