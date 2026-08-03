import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

const html = await readFile("index.html", "utf8");
const iconAssets = Object.fromEntries(await Promise.all([
  "check-circle-fill.svg",
  "circle-next.svg",
  "circle-upcoming.svg",
].map(async (name) => [`/assets/${name}`, await readFile(`assets/${name}`, "utf8")])));
const worker = `const html = ${JSON.stringify(html)};
const iconAssets = ${JSON.stringify(iconAssets)};

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const pathname = new URL(request.url).pathname;
    if (iconAssets[pathname]) {
      return new Response(request.method === "HEAD" ? null : iconAssets[pathname], {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return new Response(request.method === "HEAD" ? null : html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};
`;

await writeFile("dist/server/index.js", worker);
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
