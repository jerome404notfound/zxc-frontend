"use client";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEscape } from "@/lib/useEscape";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import SpotlightBorderWrapper from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { IconCaretUpDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  useEscape(() => setOpen((prev) => !prev));
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [lastPage, setLastPage] = useState("/");
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [text, setText] = useState(query ?? "");

  const [value, setValue] = useState("movie");
  useEffect(() => {
    if (
      !pathname.startsWith("/search") &&
      !pathname.startsWith("/details") &&
      !pathname.startsWith("/discover") &&
      !pathname.startsWith("/watch")
    ) {
      setLastPage(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (text.trim().length === 0) {
      router.replace(lastPage, { scroll: false });
      return;
    }

    router.replace(`/search?type=${value}&query=${encodeURIComponent(text)}`);
  }, [text, value, lastPage]);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return (
    <div className="relative flex items-center">
      <span className="absolute left-2 flex items-center border-r pl-1 pr-2">
        <Search className="size-4 opacity-50" />
      </span>
      <SpotlightBorderWrapper>
        <Input
          ref={inputRef}
          value={text}
          type="search"
          placeholder={
            value === "keyword"
              ? `Search topic.. e.g. "Time Loop" `
              : value === "movie"
              ? "Search Movie..."
              : "Search TV Shows..."
          }
          onChange={handleSearch}
          className="w-sm pr-28 pl-12"
        />
      </SpotlightBorderWrapper>
      <div className="absolute top-0.5 right-0.5">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              role="combobox"
              aria-expanded={open}
              variant="outline"
              className="border-0 h-8"
            >
              {frameworks.find((meow) => meow.value === value)?.label}
              <IconCaretUpDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen(false);
                      }}
                    >
                      {framework.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === framework.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
const frameworks = [
  {
    value: "movie",
    label: "Movie",
  },
  {
    value: "tv",
    label: "TV Show",
  },
  {
    value: "keyword",
    label: "Keyword",
  },
];
