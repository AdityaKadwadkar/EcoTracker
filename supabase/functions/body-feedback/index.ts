import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function responseJSON(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function safeJson(req: Request) {
  try {
    return await req.json();
  } catch {
    throw new Error("Invalid or missing JSON body");
  }
}

async function callGemini(prompt: string, key: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error: ${res.status} → ${body}`);
  }

  const data = await res.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.output ??
    data?.output?.[0]?.content?.[0]?.text ??
    null
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { category, entry, user_id } = await safeJson(req);

    if (!category || !entry || !user_id) {
      return responseJSON({ error: "Missing category, entry, or user_id" }, 400);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!SUPABASE_URL || !SERVICE_KEY || !GEMINI_KEY) {
      return responseJSON({ error: "Missing environment variables" }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // 1. SAVE ENTRY FIRST
    const { data: savedEntry, error: dbError } = await supabase
      .from("entries")
      .insert({
        user_id,
        category,
        entry_text: entry,
        feedback: null
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB Error:", dbError);
      return responseJSON({ error: "Failed to save entry" }, 500);
    }

    // 2. GENERATE AI FEEDBACK
    const prompt = `
You are a holistic wellness coach.
Reflect on the user's ${category} entry: "${entry}"

Respond with:
1) A brief encouragement regarding their physical health efforts.
2) One simple tip for improvement or consistency.
    `;

    try {
      const aiText = await callGemini(prompt, GEMINI_KEY);

      // 3. UPDATE ENTRY WITH FEEDBACK
      if (aiText) {
        await supabase
          .from("entries")
          .update({ feedback: aiText })
          .eq("id", savedEntry.id);

        return responseJSON({ feedback: aiText });
      }
    } catch (aiError) {
      console.error("AI Error:", aiError);
      return responseJSON({
        feedback: "Entry saved! The tailored feedback engine is currently overloaded. Please check back later."
      });
    }

    return responseJSON({ feedback: "Feedback generation pending." });

  } catch (error) {
    return responseJSON({ error: error.message }, 500);
  }
});
