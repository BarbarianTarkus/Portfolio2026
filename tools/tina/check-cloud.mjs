/**
 * Verify that the configured Tina Cloud project actually belongs to this site.
 *
 * Tina Cloud ties a client id to one connected Git repository and schema. The
 * .env values are shared with another project by mistake far too easily (for
 * example when copying a .env between sites), and the admin would then happily
 * edit the wrong content. This script asks the Content API for the project's
 * query fields and fails when our collections are missing.
 *
 * Run it after creating/replacing the Tina Cloud project:
 *
 *     deno task tina:check-cloud
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Collections the portfolio admin needs. */
const REQUIRED = ["site", "home", "about", "contact", "experience", "projects"];

function readDotEnv() {
  try {
    return Object.fromEntries(
      readFileSync(join(root, ".env"), "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "" && !line.startsWith("#"))
        .map((line) => {
          const separator = line.indexOf("=");
          return separator === -1
            ? [line, ""]
            : [line.slice(0, separator), line.slice(separator + 1)];
        }),
    );
  } catch {
    return {};
  }
}

const env = { ...readDotEnv(), ...process.env };
const clientId = env.PUBLIC_TINA_CLIENT_ID;
const token = env.TINA_TOKEN;
const branch = env.HEAD || "master";

if (!clientId || !token) {
  console.error(
    "Missing PUBLIC_TINA_CLIENT_ID or TINA_TOKEN (add them to .env).",
  );
  process.exit(1);
}

const endpoint = "https://content.tinajs.io/4.1/content/" + clientId +
  "/github/" + branch;

let response;
try {
  response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-API-KEY": token,
    },
    body: JSON.stringify({
      query: "{ __schema { queryType { fields { name } } } }",
    }),
  });
} catch (error) {
  console.error("Could not reach Tina Cloud: " + error.message);
  process.exit(1);
}

if (!response.ok) {
  console.error(
    "Tina Cloud rejected the request (HTTP " + response.status + "). " +
      "Check PUBLIC_TINA_CLIENT_ID, TINA_TOKEN and HEAD/branch.",
  );
  process.exit(1);
}

const payload = await response.json();
const fields = payload?.data?.__schema?.queryType?.fields?.map((field) =>
  field.name
) ?? [];
const missing = REQUIRED.filter((name) => !fields.includes(name));

console.log(
  "Tina Cloud project: " + clientId + " (branch " + branch + ")",
);
console.log("Collections exposed: " +
  fields.filter((name) => !name.endsWith("Connection")).join(", "));

if (missing.length > 0) {
  console.error(
    "\nThis project does not match the portfolio schema. Missing: " +
      missing.join(", ") + ".",
  );
  console.error(
    "Create a Tina Cloud project connected to this repository, then update " +
      "PUBLIC_TINA_CLIENT_ID and TINA_TOKEN (.env and GitHub secrets).",
  );
  process.exit(1);
}

console.log("\nOK: all portfolio collections are available in Tina Cloud.");
