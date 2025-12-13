"use client";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEscape } from "@/lib/useEscape";
import { useDebounce } from "@/lib/debounder";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpotlightBorderWrapper from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { IconCaretUpDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { title } from "process";

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
  // const typeDebounced = useDebounce(text, 300);
  // const clearDebounced = useDebounce(text, 100);
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

  // useEffect(() => {
  //   if (open) {
  //     inputRef.current?.focus();
  //   } else {
  //     setText("");
  //   }
  // }, [open]);

  // useEffect(() => {
  //   // 1. User cleared input (fast)
  //   if (clearDebounced.trim().length === 0) {
  //     router.replace(lastPage, { scroll: false });
  //     return;
  //   }

  //   // 2. User is typing (slow)
  //   if (typeDebounced.trim().length > 0) {
  //     router.replace(
  //       `/search?type=${value}&query=${encodeURIComponent(typeDebounced)}`
  //     );
  //   }
  // }, [typeDebounced, clearDebounced, lastPage, value]);
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
      <Input
        ref={inputRef}
        value={text}
        type="search"
        placeholder="Search ..."
        onChange={handleSearch}
        className="w-sm pr-28 pl-12"
      />

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
                        setValue(currentValue === value ? "" : currentValue);
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
