import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ecosystem, endpoints, numbers, REPO_BASE } from "@/data/ecosystem";
import { useProbe, type Probe } from "@/hooks/useProbe";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Boxes,
  Download,
  ExternalLink,
  Github,
  Radio,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Terminal,
} from "lucide-react";
import { useState } from "react";

const statusStyles: Record<Probe["status"], string> = {
  loading: "bg-muted text-muted-foreground",
  online: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  offline: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  missing: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
};

const statusText: Record<Probe["status"], string> = {
  loading: "checking",
  online: "online",
  offline: "offline",
  missing: "not deployed",
};

function StatusDot({ probe }: { probe: Probe }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", statusStyles[probe.status])}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          probe.status === "online" && "bg-emerald-500",
          probe.status === "offline" && "bg-red-500",
          probe.status === "missing" && "bg-amber-500",
          probe.status === "loading" && "animate-pulse bg-muted-foreground"
        )}
      />
      {statusText[probe.status]}
      {probe.latencyMs !== null && probe.status === "online" && (
        <span className="text-[10px] opacity-70">{probe.latencyMs} ms</span>
      )}
    </Badge>
  );
}

function LiveStrip() {
  const ota = useProbe(endpoints[0].url, endpoints[0].pick);
  const ludo = useProbe(endpoints[1].url, endpoints[1].pick);
  const [nonce, setNonce] = useState(0);

  return (
    <div className="rounded-2xl border bg-card/60 p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Radio className="h-4 w-4 text-primary" />
          Live endpoints
        </div>
        <Button size="sm" variant="ghost" onClick={() => setNonce(nonce + 1)} className="h-7 gap-1 text-xs">
          <RefreshCw className="h-3 w-3" />
          recheck
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2" key={nonce}>
        <EndpointRow label={endpoints[0].label} probe={ota} />
        <EndpointRow label={endpoints[1].label} probe={ludo} />
      </div>
    </div>
  );
}

function EndpointRow({ label, probe }: { label: string; probe: Probe }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-background/40 px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-xs font-medium">{label}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          {probe.detail ?? (probe.status === "loading" ? "contacting…" : "—")}
        </div>
      </div>
      <StatusDot probe={probe} />
    </div>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Boxes className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Axzora</div>
            <div className="text-[11px] text-muted-foreground">ecosystem</div>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <a href="https://axzoraharry.github.io/axzora-docs/" target="_blank" rel="noreferrer">
              Docs
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <a href={`${REPO_BASE}/axzora-ota/releases`} target="_blank" rel="noreferrer">
              Releases
            </a>
          </Button>
          <Button asChild size="sm" className="gap-1.5">
            <a href={REPO_BASE} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-20">
        {/* hero */}
        <section className="py-10 sm:py-14">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            Self-hosted · signed builds · no committed secrets
          </Badge>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            One Android shell, one update channel, six things that actually run.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
            AxzoraOS ships signed APKs through its own local-first OTA hub. Around it: a
            multiplayer game server, a token dApp, public docs and a consent-first desktop.
            Everything below is a real repository — the numbers are measured, not planned.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Button asChild className="gap-1.5">
              <a href={`${REPO_BASE}/axzora-ota/releases/latest`} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" />
                Download AxzoraOS
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-1.5">
              <a href="https://axzoraharry.github.io/axzora-docs/" target="_blank" rel="noreferrer">
                Install guide
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" className="gap-1.5">
              <a href={`${REPO_BASE}/axzora-ludo`} target="_blank" rel="noreferrer">
                Ludo server
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>

        {/* numbers */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {numbers.map((n) => (
            <div key={n.label} className="rounded-xl border bg-card/60 p-3 backdrop-blur">
              <div className="text-2xl font-semibold tabular-nums">{n.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{n.label}</div>
            </div>
          ))}
        </section>

        {/* live */}
        <section className="mt-6">
          <LiveStrip />
        </section>

        {/* cards */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
            <span className="text-xs text-muted-foreground">{ecosystem.length} entries</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ecosystem.map((entry) => (
              <Card
                key={entry.id}
                className="group relative overflow-hidden border-border/70 bg-card/60 backdrop-blur transition-colors hover:border-primary/40"
              >
                <div className={cn("absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-70", entry.accent)} />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{entry.name}</CardTitle>
                      <CardDescription className="mt-0.5">{entry.tagline}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px] uppercase tracking-wide">
                      {entry.kind}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">{entry.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.facts.map((fact) => (
                      <span
                        key={fact}
                        className="rounded-md border bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {fact}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="relative justify-between pt-0">
                  <a
                    href={entry.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-3.5 w-3.5" />
                    source
                  </a>
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  >
                    open
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* quick start */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card className="bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Smartphone className="h-4 w-4 text-primary" />
                Install AxzoraOS
              </CardTitle>
              <CardDescription>Signed, delivered over its own update channel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Open the release, download the APK, allow installs from this source, then accept the
                in-app update dialog. Later versions arrive without leaving the app.
              </p>
              <pre className="overflow-x-auto rounded-lg border bg-background/70 p-3 text-[11px] leading-relaxed text-foreground">
{`# verify before installing
sha256sum AxzoraOS-18.18.apk
# 1d0ae458d93dfdd04938b11d…
# cert F9276561…90456 (v2 + v3)`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Terminal className="h-4 w-4 text-primary" />
                Run the hub locally
              </CardTitle>
              <CardDescription>LAN-first, so updates stay off mobile data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Point the app at your own machine and it pulls the APK from local disk, only
                forwarding to GitHub when the file is missing.
              </p>
              <pre className="overflow-x-auto rounded-lg border bg-background/70 p-3 text-[11px] leading-relaxed text-foreground">
{`git clone ${REPO_BASE}/axzora-server
cd axzora-server && npm ci
cp .env.local.example .env.local
PORT=8787 node server.js`}
              </pre>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Axzora · MIT for the open parts</span>
          <div className="flex gap-3">
            <a className="hover:text-foreground" href={`${REPO_BASE}/axzora-docs`} target="_blank" rel="noreferrer">
              docs
            </a>
            <a className="hover:text-foreground" href={`${REPO_BASE}/axzora-ludo`} target="_blank" rel="noreferrer">
              ludo
            </a>
            <a className="hover:text-foreground" href={`${REPO_BASE}/axzora-super-app`} target="_blank" rel="noreferrer">
              super app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
