import { codeToHtml } from "shiki";

export function mapLang(lang?: string): string {
  const map: Record<string, string> = {
    bash: "bash",
    sh: "bash",
    shell: "bash",
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    json: "json",
    env: "dotenv",
    dotenv: "dotenv",
    ".env": "dotenv",
    gitignore: "gitignore",
    ".gitignore": "gitignore",
    "redis-cli": "bash",
    http: "http",
    "response headers": "http",
    architecture: "text",
    "how it fits": "text",
    text: "text",
    formula: "text",
    bits: "text",
    groups: "text",
    output: "text",
    name: "text",
    prompts: "text",
    nano: "text",
    dns: "text",
    flow: "text",
    "inbound rules": "text",
    sql: "sql",
    nginx: "nginx",
    ini: "ini",
    powershell: "powershell",
  };
  return map[lang ?? ""] ?? "text";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function highlightCode(
  code: string,
  shikiLang: string,
): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang: shikiLang as any,
      theme: "github-dark",
      colorReplacements: { "#24292e": "#0A0A0A" },
    });
  } catch {
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}