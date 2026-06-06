import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

const FETCH_TIMEOUT_MS = 60000;
const DEFAULT_SIZE_PRICES = {
  "10ml": 2,
  "30ml": 6,
  "55ml": 8,
  "100ml": 15,
};

async function fetchJson(candidates, endpoint) {
  let lastError = null;

  for (const baseUrl of candidates) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        signal: controller.signal,
      });
      if (response.ok) {
        return response.json();
      }

      lastError = new Error(
        `Failed to fetch ${endpoint} from ${baseUrl} (${response.status} ${response.statusText})`,
      );
    } catch (error) {
      lastError = new Error(
        `Failed to fetch ${endpoint} from ${baseUrl}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${endpoint}`);
}

async function writeStaticJson(fileName, payload) {
  const outputDir = path.resolve(process.cwd(), "public", "data");
  await mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, fileName);
  await writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Generated ${filePath}`);
}

function normalizeProduct(product) {
  const price10Ml = Number(
    product.price10Ml ??
      product.sizes?.find((item) => item.size === "10ml")?.price ??
      DEFAULT_SIZE_PRICES["10ml"],
  );
  const price30Ml = Number(
    product.price30Ml ??
      product.sizes?.find((item) => item.size === "30ml")?.price ??
      DEFAULT_SIZE_PRICES["30ml"],
  );
  const price55Ml = Number(
    product.price55Ml ??
      product.sizes?.find((item) => item.size === "55ml")?.price ??
      product.price ??
      DEFAULT_SIZE_PRICES["55ml"],
  );
  const price100Ml = Number(
    product.price100Ml ??
      product.sizes?.find((item) => item.size === "100ml")?.price ??
      DEFAULT_SIZE_PRICES["100ml"],
  );

  return {
    ...product,
    price: price55Ml,
    price10Ml,
    price30Ml,
    price55Ml,
    price100Ml,
    sizes: [
      { size: "10ml", price: price10Ml },
      { size: "30ml", price: price30Ml },
      { size: "55ml", price: price55Ml },
      { size: "100ml", price: price100Ml },
    ],
  };
}

async function main() {
  const env = loadEnv(
    process.env.MODE ?? process.env.NODE_ENV ?? "production",
    process.cwd(),
    "",
  );
  const apiBaseUrl =
    process.env.VITE_API_BASE_URL ??
    env.VITE_API_BASE_URL ??
    "http://localhost:3000/api";
  const candidateBaseUrls = apiBaseUrl
    .split(",")
    .map((baseUrl) => baseUrl.trim().replace(/\/$/, ""))
    .filter(Boolean);

  console.log(
    `Fetching static data from candidates: ${candidateBaseUrls.join(", ")}`,
  );

  const [offers, products, categories] = await Promise.all([
    fetchJson(candidateBaseUrls, "/products/offers"),
    fetchJson(candidateBaseUrls, "/products"),
    fetchJson(candidateBaseUrls, "/products/categories"),
  ]);
  const normalizedProducts = products.map(normalizeProduct);

  await Promise.all([
    writeStaticJson("offers.json", offers),
    writeStaticJson("products.json", normalizedProducts),
    writeStaticJson("categories.json", categories),
  ]);
}

main().catch((error) => {
  console.error("generate:data failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
