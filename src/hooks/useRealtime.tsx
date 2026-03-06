import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface RealtimeSubscription {
  table: string;
  event?: RealtimeEvent;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onChange?: () => void;
}

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export function useRealtime(
  channelName: string,
  subscriptions: RealtimeSubscription[],
  showToasts: boolean = false
) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const channelRef = useRef<any>(null);

  useEffect(() => {
    setStatus("connecting");

    const channel = supabase.channel(channelName);

    subscriptions.forEach(({ table, event = "*", onInsert, onUpdate, onDelete, onChange }) => {
      channel.on(
        "postgres_changes" as any,
        { event, schema: "public", table },
        (payload: any) => {
          if (showToasts) {
            const eventType = payload.eventType as string;
            if (eventType === "INSERT") {
              toast({ title: `New ${table} record added`, description: "Data updated in real-time" });
            } else if (eventType === "UPDATE") {
              toast({ title: `${table} record updated`, description: "Data updated in real-time" });
            } else if (eventType === "DELETE") {
              toast({ title: `${table} record deleted`, description: "Data updated in real-time", variant: "destructive" });
            }
          }

          if (payload.eventType === "INSERT" && onInsert) onInsert(payload.new);
          if (payload.eventType === "UPDATE" && onUpdate) onUpdate(payload.new);
          if (payload.eventType === "DELETE" && onDelete) onDelete(payload.old);
          if (onChange) onChange();
        }
      );
    });

    channel.subscribe((channelStatus) => {
      if (channelStatus === "SUBSCRIBED") setStatus("connected");
      else if (channelStatus === "CLOSED") setStatus("disconnected");
      else if (channelStatus === "CHANNEL_ERROR") setStatus("error");
    });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  const reconnect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    setStatus("connecting");
  }, []);

  return { status, reconnect };
}
