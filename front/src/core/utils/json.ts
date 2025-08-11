import { parse as bestEffortJsonParser } from "best-effort-json-parser";

export function parseJSON<T>(
  jsonString: string,
  defaultValue: T,
  _options?: {
    silent?: boolean;
  },
): T {
  try {
    // Attempt to find the first and last curly braces
    const firstBraceIndex = jsonString.indexOf("{");
    const lastBraceIndex = jsonString.lastIndexOf("}");

    if (firstBraceIndex === -1 || lastBraceIndex === -1) {
      // Fallback for non-object JSON (e.g., arrays, primitives)
      const titleMatch = /"#\s+(.+)"/.exec(jsonString);
      if (titleMatch?.[1]) {
        return { title: titleMatch[1].trim() } as T;
      }
      return defaultValue;
    }
    
    // Clean up the input more thoroughly
    let cleaned = jsonString.trim();
    
    // Remove markdown code block markers
    cleaned = cleaned
      .replace(/^```(js|json|ts|plaintext|javascript|typescript)?\s*/g, "")
      .replace(/\s*```$/g, "");
    
    // Remove any leading/trailing whitespace again after code block removal
    cleaned = cleaned.trim();
    
    // If the cleaned string starts with a non-JSON character but contains JSON,
    // try to extract the JSON part
    if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
      const jsonMatch = /(\{[\s\S]*\}|\[[\s\S]*\])/.exec(cleaned);
      if (jsonMatch?.[1]) {
        cleaned = jsonMatch[1];
      }
    }
    
    // Try standard JSON.parse first (faster for valid JSON)
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      // Fall back to best-effort parser for malformed JSON
      return bestEffortJsonParser(cleaned) as T;
    }
  } catch (error) {
    console.warn("Failed to parse JSON:", { jsonString, error });
    return defaultValue;
  }
}
