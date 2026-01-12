"use client";

import {
  CheckCircle,
  Info,
  Loader2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      duration={3500}
      className="toaster group"
      icons={{
        success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
        info: <Info className="h-4 w-4 text-blue-500" />,
        warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        error: <XCircle className="h-4 w-4 text-red-500" />,
        loading: (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-lg border border-border bg-popover text-popover-foreground shadow-sm",
          title: "text-sm font-medium",
          description: "text-xs text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
        },
      }}
      style={
        {
          "--border-radius": "8px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
