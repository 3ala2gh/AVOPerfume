import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

const FETCH_TIMEOUT_MS = Number(process.env.STATIC_DATA_FETCH_TIMEOUT_MS ?? 120000);
const FETCH_ATTEMPTS = Number(process.env.STATIC_DATA_FETCH_ATTEMPTS ?? 3);
const DEFAULT_SIZE_PRICES = {
  "10ml": 2,
  "30ml": 6,
  "55ml": 8,
  "100ml": 15,
};

async function fetchJson(candidates, endpoint) {
  let lastError = null;

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt += 1) {
    for (const baseUrl of candidates) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      try {
        console.log(`Fetching ${endpoint} (attempt ${attempt}/${FETCH_ATTEMPTS})`);
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

    if (attempt < FETCH_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
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
    originalPrice: Number(product.originalPrice ?? product.originalPrice55Ml ?? price55Ml),
    originalPrice10Ml: Number(product.originalPrice10Ml ?? price10Ml),
    originalPrice30Ml: Number(product.originalPrice30Ml ?? price30Ml),
    originalPrice55Ml: Number(product.originalPrice55Ml ?? product.originalPrice ?? price55Ml),
    originalPrice100Ml: Number(product.originalPrice100Ml ?? price100Ml),
    sizes: [
      {
        size: "10ml",
        price: price10Ml,
        originalPrice: Number(product.originalPrice10Ml ?? price10Ml),
        enabled: product.sizes?.find((item) => item.size === "10ml")?.enabled ?? true,
      },
      {
        size: "30ml",
        price: price30Ml,
        originalPrice: Number(product.originalPrice30Ml ?? price30Ml),
        enabled: product.sizes?.find((item) => item.size === "30ml")?.enabled ?? true,
      },
      {
        size: "55ml",
        price: price55Ml,
        originalPrice: Number(product.originalPrice55Ml ?? product.originalPrice ?? price55Ml),
        enabled: product.sizes?.find((item) => item.size === "55ml")?.enabled ?? true,
      },
      {
        size: "100ml",
        price: price100Ml,
        originalPrice: Number(product.originalPrice100Ml ?? price100Ml),
        enabled: product.sizes?.find((item) => item.size === "100ml")?.enabled ?? true,
      },
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
    process.env.STATIC_DATA_API_URL ??
    env.STATIC_DATA_API_URL ??
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

  // Fetch products first to wake a sleeping backend before parallel requests.
  const products = await fetchJson(candidateBaseUrls, "/products");
  const [offers, categories] = await Promise.all([
    fetchJson(candidateBaseUrls, "/products/offers"),
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
