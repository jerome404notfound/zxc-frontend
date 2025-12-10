import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandTelegram,
  IconVersions,
} from "@tabler/icons-react";
import Link from "next/link";
export default function ChangeLogs() {
  const versions = [
    {
      id: 4,
      version: "0",
      date: "N/A",
      title: "Future Update",
      updates: ["Watch History", "Add to Watchlist", "and more.."],
    },
    {
      id: 3,
      version: "1.1.0",
      date: "Nov 25, 2025",
      title: "Minor Update",
      updates: ["Added new anime movies"],
    },
    {
      id: 2,
      version: "1.0.1",
      date: "Oct 30, 2025",
      title: "Patch Update",
      updates: ["Fixed broken streaming links"],
    },
    {
      id: 1,
      version: "1.0.0",
      date: "Oct 10, 2025",
      title: "Initial Release",
      updates: ["Launched movie website with basic features"],
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconVersions />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl m-auto h-fit  px-6 pt-6 rounded-lg space-y-6 bg-card">
        <DialogHeader>
          <DialogTitle>Changelogs</DialogTitle>
          <DialogDescription>Version: 1.2.0</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-100">
          <Timeline defaultValue={versions.length - 1}>
            {versions.map((item) => (
              <TimelineItem key={item.id} step={item.id}>
                <TimelineHeader>
                  <TimelineSeparator />

                  <TimelineTitle className="text-base">
                    {item.title} v.{item.version}
                  </TimelineTitle>
                  <TimelineDate className="text-sm">{item.date}</TimelineDate>
                  <TimelineIndicator />
                </TimelineHeader>
                <TimelineContent className="mt-3">
                  <ul className="list-disc list-inside space-y-1 text-base">
                    {item.updates.map((u, idx) => (
                      <li key={idx}>{u}</li>
                    ))}
                  </ul>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </ScrollArea>
        <DialogFooter className="flex-col! gap-4">
          <Button className="w-full" variant="destructive">
            <IconBrandFacebook /> Have suggestions or want to report a problem?
          </Button>
          <div className="flex gap-3 items-center text-sm text-muted-foreground">
            <Separator className="flex-1 bg-border" />
            Visit us for more update
            <Separator className="flex-1 bg-border" />
          </div>
          <div className="flex justify-center items-center gap-6">
            <Link
              scroll={false}
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-[#165ec9] transition-colors"
            >
              <IconBrandFacebook size={24} />
            </Link>

            {/* Telegram */}
            <Link
              scroll={false}
              href="https://t.me/yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#0088cc] text-white hover:bg-[#007ab8] transition-colors"
            >
              <IconBrandTelegram size={24} />
            </Link>

            {/* Discord */}
            <Link
              scroll={false}
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#5865F2] text-white hover:bg-[#4752c4] transition-colors"
            >
              <IconBrandDiscord size={24} />
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
