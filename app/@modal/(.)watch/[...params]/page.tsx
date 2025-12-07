"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function WatchMode() {
  const router = useRouter();
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = Number(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const [open, setOpen] = useState(true);

  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => router.back(), 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-full p-0" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <iframe
          height="100%"
          width="100%"
          src={`https://www.zxcstream.xyz/embed/${media_type}/${id}${
            media_type === "tv" ? `/${season}/${episode}` : ""
          }`}
        />
      </DialogContent>
    </Dialog>
  );
}
