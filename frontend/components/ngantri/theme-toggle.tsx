"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const modes = [
  { icon: Sun, label: "Light", value: "light" },
  { icon: Moon, label: "Dark", value: "dark" },
  { icon: Monitor, label: "System", value: "system" },
] as const;

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme ?? "system" : "system";

  return (
    <div className="inline-flex rounded-xl border border-border bg-card p-1 text-muted-foreground shadow-sm">
      {modes.map(({ icon: Icon, label, value }) => (
        <Button
          aria-label={`Gunakan ${label} mode`}
          className="size-9 rounded-lg"
          key={value}
          onClick={() => setTheme(value)}
          size="icon"
          type="button"
          variant={currentTheme === value ? "secondary" : "ghost"}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  );
}
