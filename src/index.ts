import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const getEnv = (key: keyof Env): string => {
  const envFromProcess = (globalThis as unknown as { process?: any }).process
    ?.env?.[key] as string | undefined;

  const value = envFromProcess;
  if (!value) {
    throw new Error(`Missing env: ${String(key)}`);
  }
  return value;
};

type Member = {
  id: number;
  name: string;
  role: string;
  avatar_url: string | null;
  tw_url: string | null;
};

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "API is running" });
});

app.post("/api/counter", async (c) => {
  try {
    const supabaseUrl = getEnv("SUPABASE_URL");
    const supabaseAnonKey = getEnv("SUPABASE_ANON_KEY");

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("counters")
      .select("count")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error fetching counter:", error);
      return c.json({ error: "Failed to fetch counter" }, 500);
    }

    const currentCount = data?.count ?? 0;
    const newCount = currentCount + 1;

    const { error: updateError } = await supabase
      .from("counters")
      .update({ count: newCount, updated_at: new Date().toISOString() })
      .eq("id", 1);

    if (updateError) {
      console.error("Error updating counter:", updateError);
      return c.json({ error: "Failed to update counter" }, 500);
    }

    return c.json({ count: newCount });
  } catch (err) {
    console.error("Unexpected error:", err);
    return c.json({ error: "Unexpected error occurred" }, 500);
  }
});

app.get("/api/members", async (c) => {
  try {
    const supabaseUrl = getEnv("SUPABASE_URL");
    const supabaseAnonKey = getEnv("SUPABASE_ANON_KEY");

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("members")
      .select("id,name,role,avatar_url,tw_url")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
      return c.json({ error: "Failed to fetch members" }, 500);
    }

    return c.json((data ?? []) as Member[]);
  } catch (err) {
    console.error("Unexpected error:", err);
    return c.json({ error: "Unexpected error occurred" }, 500);
  }
});

export default app;
