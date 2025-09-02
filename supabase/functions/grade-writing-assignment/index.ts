import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { essay, criteria } = await req.json();

    if (!essay) {
      throw new Error("Essay text is required");
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const systemPrompt = criteria
      ? `You are an expert writing instructor. Evaluate the student's essay based on the following criteria:\n${criteria}`
      : "You are an expert writing instructor. Evaluate the student's essay.";

    const fullPrompt = `${systemPrompt}\n\nEssay:\n${essay}\n\nReturn a JSON object with the following structure:\n{\n  \"grade\": number between 0 and 100,\n  \"feedback\": \"concise constructive feedback\"\n}`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that grades student writing. Always respond with valid JSON.",
          },
          { role: "user", content: fullPrompt },
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json();
    let gradingResult;

    try {
      gradingResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      const content = data.choices[0].message.content;
      const gradeMatch = content.match(/"?grade"?\s*:?\s*(\d{1,3})/i);
      const feedbackMatch = content.match(/"?feedback"?\s*:?\s*"([\s\S]+)"/i);
      gradingResult = {
        grade: gradeMatch ? Number(gradeMatch[1]) : 0,
        feedback: feedbackMatch ? feedbackMatch[1] : content,
      };
    }

    return new Response(
      JSON.stringify({ success: true, data: gradingResult }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error grading essay:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
