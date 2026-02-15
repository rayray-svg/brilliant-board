import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const tools = [
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Create a new task on the Kanban board",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Task title" },
          description: { type: "string", description: "Task description" },
          status: { type: "string", enum: ["todo", "in_progress", "in_review", "done"], description: "Task status column" },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"], description: "Task priority" },
          tags: { type: "array", items: { type: "string" }, description: "Task tags" },
          assignee: { type: "string", description: "Assignee name" },
          due_date: { type: "string", description: "Due date in YYYY-MM-DD format" },
        },
        required: ["title"],
      },
    },
  },
];

async function handleToolCall(name: string, args: Record<string, unknown>) {
  if (name === "create_task") {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from("tasks").insert({
      title: args.title as string,
      description: (args.description as string) || null,
      status: (args.status as string) || "todo",
      priority: (args.priority as string) || "medium",
      tags: (args.tags as string[]) || [],
      assignee: (args.assignee as string) || null,
      due_date: (args.due_date as string) || null,
      sort_order: 0,
    }).select().single();
    if (error) throw error;
    return { success: true, task: data };
  }
  throw new Error(`Unknown tool: ${name}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // First call - may include tool calls
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI project management assistant embedded in a Kanban board app called TaskFlow. You help users:
- Plan and break down work into tasks
- Create tasks on the board using the create_task tool
- Suggest task priorities and assignments
- Answer questions about project management best practices
- Help with sprint planning and estimation

When users ask you to create a task, ALWAYS use the create_task tool. You can create multiple tasks if needed.
Keep answers clear, concise, and actionable. Use markdown formatting.`,
          },
          ...messages,
        ],
        tools,
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result = await response.json();
    let assistantMessage = result.choices?.[0]?.message;

    // Handle tool calls in a loop
    const conversationMessages = [
      {
        role: "system",
        content: `You are a helpful AI project management assistant embedded in a Kanban board app called TaskFlow. You help users:
- Plan and break down work into tasks
- Create tasks on the board using the create_task tool
- Suggest task priorities and assignments
- Answer questions about project management best practices
Keep answers clear, concise, and actionable. Use markdown formatting.`,
      },
      ...messages,
    ];

    let iterations = 0;
    while (assistantMessage?.tool_calls && iterations < 5) {
      iterations++;
      conversationMessages.push(assistantMessage);

      for (const toolCall of assistantMessage.tool_calls) {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          const toolResult = await handleToolCall(toolCall.function.name, args);
          conversationMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
          });
        } catch (e) {
          conversationMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: e instanceof Error ? e.message : "Tool call failed" }),
          });
        }
      }

      // Follow-up call after tool execution
      const followUp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: conversationMessages,
          tools,
          stream: false,
        }),
      });

      if (!followUp.ok) {
        const t = await followUp.text();
        console.error("Follow-up error:", followUp.status, t);
        break;
      }

      result = await followUp.json();
      assistantMessage = result.choices?.[0]?.message;
    }

    const content = assistantMessage?.content || "Done!";
    const tasksCreated = iterations > 0;

    return new Response(JSON.stringify({ content, tasksCreated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
