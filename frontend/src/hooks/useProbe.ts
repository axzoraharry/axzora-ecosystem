import { useEffect, useRef, useState } from "react";

export type Status = "loading" | "online" | "offline" | "missing";

export type Probe = {
  status: Status;
  latencyMs: number | null;
  detail: string | null;
  checkedAt: number | null;
};

const TIMEOUT_MS = 8000;

/**
 * Poll a JSON endpoint and report reachability, latency and a short detail
 * string. A 404 means "not deployed yet" rather than a failure, which is the
 * honest state for a service that has a render.yaml but no running instance.
 */
export function useProbe(
  url: string | undefined,
  pick?: (data: unknown) => string | null,
  intervalMs = 60_000
): Probe {
  const [probe, setProbe] = useState<Probe>({
    status: url ? "loading" : "missing",
    latencyMs: null,
    detail: null,
    checkedAt: null,
  });
  const pickRef = useRef(pick);
  pickRef.current = pick;

  useEffect(() => {
    if (!url) {
      setProbe({ status: "missing", latencyMs: null, detail: null, checkedAt: null });
      return;
    }

    let cancelled = false;

    const run = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const started = performance.now();
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { accept: "application/json" },
          cache: "no-store",
        });
        const latencyMs = Math.round(performance.now() - started);

        if (response.status === 404 || response.status === 405) {
          if (!cancelled) {
            setProbe({
              status: "missing",
              latencyMs,
              detail: "not deployed yet",
              checkedAt: Date.now(),
            });
          }
          return;
        }

        const text = await response.text();
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = null;
        }

        if (!cancelled) {
          setProbe({
            status: response.ok ? "online" : "offline",
            latencyMs,
            detail: response.ok
              ? (pickRef.current?.(parsed) ?? "ok")
              : `HTTP ${response.status}`,
            checkedAt: Date.now(),
          });
        }
      } catch (error) {
        if (!cancelled) {
          setProbe({
            status: "offline",
            latencyMs: null,
            detail:
              error instanceof DOMException && error.name === "AbortError"
                ? "timed out"
                : "unreachable",
            checkedAt: Date.now(),
          });
        }
      } finally {
        clearTimeout(timer);
      }
    };

    void run();
    const id = setInterval(run, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [url, intervalMs]);

  return probe;
}
