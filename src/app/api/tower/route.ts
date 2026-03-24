/**
 * Tower AI — API Route Handler
 *
 * POST /api/tower
 *
 * Accepts a conversation history and returns Tower's response.
 * Handles Anthropic tool-calling loop (max 3 rounds) before returning
 * the final text response to the client.
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Vercel serverless timeout — extend to 60s for AI calls
export const maxDuration = 60;

import { TOWER_SYSTEM_PROMPT } from "@/lib/tower/system-prompt";
import { TOWER_TOOLS } from "@/lib/tower/tools";
import { executeToolCall } from "@/lib/tower/tool-handlers";

const MAX_TOOL_ROUNDS = 3;
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;

interface TowerMessage {
  role: "user" | "assistant";
  content: string;
}

interface TowerRequest {
  messages: TowerMessage[];
  locale?: "en";
}

export async function POST(request: NextRequest) {
  // --- Auth check ---
  const session = request.cookies.get('skystratos-session')
  if (!session?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // --- Validate env ---
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // --- Parse request ---
    const body: TowerRequest = await request.json();
    if (
      !body.messages ||
      !Array.isArray(body.messages) ||
      body.messages.length === 0
    ) {
      return NextResponse.json(
        { error: "Request must include a non-empty messages array" },
        { status: 400 }
      );
    }

    // --- Validate message array ---
    if (body.messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: `Message array exceeds maximum of ${MAX_MESSAGES} messages` },
        { status: 400 }
      );
    }

    for (const msg of body.messages) {
      if (msg.role !== "user" && msg.role !== "assistant") {
        return NextResponse.json(
          { error: `Invalid message role: ${msg.role}. Must be 'user' or 'assistant'.` },
          { status: 400 }
        );
      }
      if (typeof msg.content !== "string" || msg.content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json(
          { error: `Message content must be a string of at most ${MAX_MESSAGE_LENGTH} characters` },
          { status: 400 }
        );
      }
    }

    // --- Init Anthropic client ---
    const client = new Anthropic({ apiKey });
    const model = "claude-sonnet-4-6";

    // Build system prompt
    const systemPrompt = TOWER_SYSTEM_PROMPT;

    // Build the messages array for the API
    let messages: Anthropic.MessageParam[] = body.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const toolResults: Record<string, unknown>[] = [];

    // --- Tool-calling loop ---
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await client.messages.create({
        model,
        system: systemPrompt,
        tools: TOWER_TOOLS,
        messages,
        max_tokens: 4096,
      });

      // Check if the response contains any tool_use blocks
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ContentBlock & { type: "tool_use" } =>
          block.type === "tool_use"
      );

      // If no tool calls, extract text and return
      if (toolUseBlocks.length === 0) {
        const textBlocks = response.content.filter(
          (
            block
          ): block is Anthropic.ContentBlock & {
            type: "text";
            text: string;
          } => block.type === "text"
        );
        const responseText = textBlocks.map((b) => b.text).join("\n\n");

        return NextResponse.json({
          response: responseText,
          toolResults: toolResults.length > 0 ? toolResults : undefined,
        });
      }

      // --- Execute tool calls and build tool_result messages ---

      // Add the assistant's response (with tool_use blocks) to the conversation
      messages = [
        ...messages,
        { role: "assistant" as const, content: response.content },
      ];

      // Execute each tool call and collect results
      const toolResultBlocks: Anthropic.ToolResultBlockParam[] = [];
      for (const toolUse of toolUseBlocks) {
        try {
          const result = executeToolCall(
            toolUse.name,
            toolUse.input as Record<string, unknown>
          );
          toolResults.push({
            tool: toolUse.name,
            input: toolUse.input,
            result,
          });
          toolResultBlocks.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify(result),
          });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown tool execution error";
          toolResultBlocks.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            is_error: true,
            content: errorMessage,
          });
        }
      }

      // Add tool results as a user message (Anthropic API convention)
      messages = [
        ...messages,
        { role: "user" as const, content: toolResultBlocks },
      ];
    }

    // If we exhausted all rounds without a text-only response, make one
    // final call without tools to force a text response
    const finalResponse = await client.messages.create({
      model,
      system: systemPrompt,
      messages,
      max_tokens: 4096,
    });

    const finalText = finalResponse.content
      .filter(
        (
          block
        ): block is Anthropic.ContentBlock & { type: "text"; text: string } =>
          block.type === "text"
      )
      .map((b) => b.text)
      .join("\n\n");

    return NextResponse.json({
      response:
        finalText ||
        "I processed your request but could not generate a text summary. Please try rephrasing your question.",
      toolResults: toolResults.length > 0 ? toolResults : undefined,
    });
  } catch (err) {
    console.error("[Tower API] Error:", err);

    // Handle specific Anthropic API errors
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: `Anthropic API error: ${err.message}`,
          code: err.status,
        },
        { status: err.status || 500 }
      );
    }

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
