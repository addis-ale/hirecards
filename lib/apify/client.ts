/**
 * Apify API Client
 * Handles communication with Apify actors
 */

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_API_URL = "https://api.apify.com/v2";

export interface ApifyRunOptions {
  actorId: string;
  input: any;
  timeout?: number; // in seconds
  memory?: number; // in MB
  build?: string;
}

export interface ApifyRunResult {
  id: string;
  status: string;
  defaultDatasetId: string;
}

/**
 * Start an Apify actor run
 */
export async function runActor(options: ApifyRunOptions): Promise<ApifyRunResult> {
  if (!APIFY_API_TOKEN) {
    throw new Error("APIFY_API_TOKEN environment variable is not set");
  }

  const { actorId, input, timeout = 300, memory = 4096 } = options;

  const response = await fetch(
    `${APIFY_API_URL}/acts/${actorId}/runs?token=${APIFY_API_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...input,
        maxItems: input.maxItems || 50,
        timeout,
        memory,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apify API error: ${error}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Wait for actor run to complete and get results
 */
export async function waitForRun(runId: string, maxWaitTime = 120000): Promise<any[]> {
  if (!APIFY_API_TOKEN) {
    throw new Error("APIFY_API_TOKEN environment variable is not set");
  }

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    // Check run status
    const statusResponse = await fetch(
      `${APIFY_API_URL}/actor-runs/${runId}?token=${APIFY_API_TOKEN}`
    );

    if (!statusResponse.ok) {
      throw new Error("Failed to check run status");
    }

    const statusData = await statusResponse.json();
    const status = statusData.data.status;

    if (status === "SUCCEEDED") {
      // Get dataset results
      const datasetId = statusData.data.defaultDatasetId;
      const datasetResponse = await fetch(
        `${APIFY_API_URL}/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}`
      );

      if (!datasetResponse.ok) {
        throw new Error("Failed to fetch dataset");
      }

      const results = await datasetResponse.json();
      return results;
    } else if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      throw new Error(`Actor run ${status.toLowerCase()}`);
    }

    // Wait 2 seconds before checking again
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Actor run timed out");
}

/**
 * Run actor and wait for results (convenience method)
 */
export async function runActorAndWait(
  options: ApifyRunOptions,
  maxWaitTime = 120000
): Promise<any[]> {
  console.log(`🚀 Starting Apify actor: ${options.actorId}`);
  const run = await runActor(options);
  console.log(`⏳ Waiting for run ${run.id} to complete...`);
  const results = await waitForRun(run.id, maxWaitTime);
  console.log(`✅ Actor completed. Retrieved ${results.length} results.`);
  return results;
}
