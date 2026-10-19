/**
 * The Axzora ecosystem, in one place.
 *
 * Everything the dashboard renders is described here so the repo stays the
 * single source of truth when a service moves or a new app appears.
 */

export type ServiceKind = "app" | "service" | "site" | "library";

export type EcosystemEntry = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  kind: ServiceKind;
  repo: string;
  href: string;
  /** Public health/JSON endpoint polled by the live strip, if any. */
  health?: string;
  /** Shown under the live badge, e.g. what the endpoint proves. */
  healthLabel?: string;
  accent: string;
  facts: string[];
};

export const REPO_BASE = "https://github.com/axzoraharry";

export const ecosystem: EcosystemEntry[] = [
  {
    id: "axzoraos",
    name: "AxzoraOS",
    tagline: "Android shell with a live HUD",
    description:
      "The phone app: gesture HUD, hub panel, in-app OTA updates and the Mr Happy assistant. Ships as a signed APK delivered by its own update channel.",
    kind: "app",
    repo: `${REPO_BASE}/axzora-ota`,
    href: `${REPO_BASE}/axzora-ota/releases`,
    health: "https://axzora-server-k39z.onrender.com/update/check",
    healthLabel: "OTA manifest",
    accent: "from-violet-500/20 to-fuchsia-500/10",
    facts: ["versionCode 210", "minSdk 26", "targetSdk 34", "v2 + v3 signed"],
  },
  {
    id: "server",
    name: "Axzora Server",
    tagline: "Local-first OTA hub",
    description:
      "Express hub the app talks to: update manifest, APK download, families and ledger. Prefers a phone-local APK and only redirects to the GitHub release asset when the local file is absent.",
    kind: "service",
    repo: `${REPO_BASE}/axzora-server`,
    href: "https://axzora-server-k39z.onrender.com/",
    health: "https://axzora-server-k39z.onrender.com/update/check",
    healthLabel: "update/check",
    accent: "from-sky-500/20 to-cyan-500/10",
    facts: ["Render + local :8787", "admin code env-only", "302 fallback to release"],
  },
  {
    id: "ludo",
    name: "Axzora Ludo",
    tagline: "Authoritative multiplayer rooms",
    description:
      "Server-owned Ludo: create or join by 4-character code, dice and captures validated server-side, AI fills empty seats, browser client included.",
    kind: "service",
    repo: `${REPO_BASE}/axzora-ludo`,
    href: `${REPO_BASE}/axzora-ludo`,
    health: "https://axzora-ludo.onrender.com/health",
    healthLabel: "/health",
    accent: "from-amber-500/20 to-orange-500/10",
    facts: ["52-cell board", "17 tests", "2 KB frame cap", "AI seat hand-off"],
  },
  {
    id: "super-app",
    name: "Axzora Super App",
    tagline: "Happy Paisa dApp",
    description:
      "Mobile-first token dApp: HP mint/burn/transfer, staking, price display, biometric face tracking and a voice-controlled avatar. Static, no build step.",
    kind: "app",
    repo: `${REPO_BASE}/axzora-super-app`,
    href: `${REPO_BASE}/axzora-super-app`,
    accent: "from-emerald-500/20 to-teal-500/10",
    facts: ["deferred CDN bundles", "no committed API keys", "252-file secret scan"],
  },
  {
    id: "docs",
    name: "Axzora Docs",
    tagline: "Install, OTA and release notes",
    description:
      "Public documentation site: installation, the OTA manifest contract (file vs url), the local hub, keyboard and gestures, troubleshooting, version table.",
    kind: "site",
    repo: `${REPO_BASE}/axzora-docs`,
    href: "https://axzoraharry.github.io/axzora-docs/",
    accent: "from-indigo-500/20 to-blue-500/10",
    facts: ["GitHub Pages", "releases table", "troubleshooting"],
  },
  {
    id: "satyug",
    name: "Satyug OS",
    tagline: "Consent shell + live lattice",
    description:
      "A calm alternative desktop: a live lattice field at the root, a consent-first shell at /shell, a two-person room transport and a world digest API. Private by design.",
    kind: "library",
    repo: `${REPO_BASE}/satyug-os`,
    href: `${REPO_BASE}/satyug-os`,
    accent: "from-rose-500/20 to-pink-500/10",
    facts: ["256×128 field", "8 Hz room beacons", "world digest API", "private repo"],
  },
];

export const endpoints = [
  {
    id: "ota",
    label: "OTA manifest",
    url: "https://axzora-server-k39z.onrender.com/update/check",
    /** Pull a version string out of a manifest-shaped response. */
    pick: (data: unknown): string | null => {
      if (!data || typeof data !== "object") return null;
      const manifest = data as Record<string, unknown>;
      const version = manifest.versionName ?? manifest.version;
      const code = manifest.versionCode ?? manifest.code;
      if (!version) return null;
      return code ? `${String(version)} (${String(code)})` : String(version);
    },
  },
  {
    id: "ludo",
    label: "Ludo health",
    url: "https://axzora-ludo.onrender.com/health",
    pick: (data: unknown): string | null => {
      if (!data || typeof data !== "object") return null;
      const body = data as Record<string, unknown>;
      if (body.ok !== true) return null;
      const rooms = typeof body.rooms === "number" ? ` · ${body.rooms} rooms` : "";
      return `${String(body.version ?? "ok")}${rooms}`;
    },
  },
] as const;

export const numbers = [
  { label: "Apps shipped", value: "6" },
  { label: "APK channel", value: "210" },
  { label: "Green tests", value: "269" },
  { label: "Repos", value: "227" },
];
