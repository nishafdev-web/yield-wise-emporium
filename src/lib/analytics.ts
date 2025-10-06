import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "checkout_start"
  | "order_complete";

interface EventPayload {
  [key: string]: any;
}

export const trackEvent = async (
  eventName: AnalyticsEvent,
  payload: EventPayload = {}
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        user_id: user?.id || null,
        payload,
      });

    if (error) {
      console.error("Analytics tracking error:", error);
    }
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};
