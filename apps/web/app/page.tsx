import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Link from 'next/link'

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PulseWatch — minimal uptime monitoring",
  description:
    "PulseWatch checks the sites you care about on a schedule, and tells you the moment one goes down. An MVP built with NestJS, BullMQ, Redis, and Next.js.",
};

const REPO_URL = "https://github.com/MLuqman150/PulseWatch";

type Monitor = {
  name: string;
  up: boolean;
  latency: string;
};

const monitors: Monitor[] = [
  { name: "api.pulsewatch.dev", up: true, latency: "142ms" },
  { name: "test.pulsewatch.dev", up: true, latency: "88ms" },
  { name: "staging.internal", up: false, latency: "timeout" },
  { name: "docs.pulsewatch.dev", up: true, latency: "204ms" },
];

const steps = [
  {
    n: "01",
    title: "Add a site",
    body: "Paste a URL and set how often it should be checked.",
  },
  {
    n: "02",
    title: "It gets polled",
    body: "A background worker pings it on schedule, no manual refreshing.",
  },
  {
    n: "03",
    title: "You get status",
    body: "Uptime, response time, and history, all in one dashboard.",
  },
];

const stack = [
  "NestJS",
  "BullMQ",
  "Redis",
  "PostgreSQL",
  "Docker",
  "Next.js",
  "JWT Auth",
];

export default function Home() {
  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[#0A0A0A] text-[#F4F4F2]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <style>{`
        @keyframes pw-pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        @keyframes pw-heartbeat {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pw-rise {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .pw-pulse-dot { animation: pw-pulse-dot 1.8s ease-in-out infinite; }
        .pw-heartbeat { animation: pw-heartbeat 3.2s linear infinite; }
        .pw-rise { animation: pw-rise 0.6s ease-out both; }
        ::selection { background-color: #F4F4F2; color: #0A0A0A; }
        @media (prefers-reduced-motion: reduce) {
          .pw-pulse-dot, .pw-heartbeat, .pw-rise {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* Nav */}
      <header className="border-b border-[#242422]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="pw-pulse-dot inline-block h-2 w-2 rounded-full bg-[#F4F4F2]" />
            PulseWatch
          </div>
          {/* <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#8C8C88] transition-colors hover:text-[#F4F4F2]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Source ↗
          </a> */}
          <Link 
            href={`/register`}
            className="text-sm text-[#8C8C88] transition-colors hover:text-[#F4F4F2]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
              Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#242422]">
        <svg
          className="pointer-events-none absolute inset-x-0 top-1/2 hidden w-full -translate-y-1/2 opacity-[0.08] md:block"
          viewBox="0 0 1000 120"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 60 H340 L370 20 L400 100 L430 60 L460 60 L490 10 L520 110 L550 60 H1000"
            stroke="#F4F4F2"
            strokeWidth="2"
            strokeDasharray="1000"
            className="pw-heartbeat"
          />
        </svg>

        <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p
            className="pw-rise text-xs uppercase tracking-[0.2em] text-[#8C8C88]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            MVP · website monitoring
          </p>
          <h1
            className="pw-rise mt-5 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Monitoring, minimal.
          </h1>
          <p
            className="pw-rise mt-6 max-w-lg text-lg text-[#8C8C88]"
            style={{ animationDelay: "80ms" }}
          >
            PulseWatch checks the sites you care about on a schedule, and
            shows you the moment one goes quiet.
          </p>

          <div
            className="pw-rise mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "140ms" }}
          >
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm bg-[#F4F4F2] px-5 py-3 text-sm font-medium text-[#0A0A0A] transition-opacity hover:opacity-85"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              View source
            </a>
            <a
              href="#how-it-works"
              className="rounded-sm border border-[#242422] px-5 py-3 text-sm text-[#F4F4F2] transition-colors hover:border-[#F4F4F2]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              How it works
            </a>
          </div>

          {/* status panel */}
          <div
            className="pw-rise mt-14 max-w-xl rounded-sm border border-[#242422] bg-[#141412]"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center justify-between border-b border-[#242422] px-4 py-3">
              <span
                className="text-xs uppercase tracking-[0.15em] text-[#8C8C88]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Monitors
              </span>
              <span
                className="text-xs text-[#8C8C88]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Live (demo)
              </span>
            </div>
            <ul>
              {monitors.map((m) => (
                <li
                  key={m.name}
                  className="flex items-center justify-between border-b border-[#242422] px-4 py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        m.up
                          ? "pw-pulse-dot bg-[#F4F4F2]"
                          : "border border-[#F4F4F2] bg-transparent"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className="text-sm text-[#F4F4F2]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {m.name}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-4 text-xs text-[#8C8C88]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span>{m.up ? "UP" : "DOWN"}</span>
                    <span>{m.latency}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-[#242422]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h2
            className="text-2xl font-bold tracking-tight md:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How it works
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((s) => (
              <div key={s.n} className="border-t border-[#242422] pt-5">
                <span
                  className="text-sm text-[#8C8C88]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.n}
                </span>
                <h3
                  className="mt-3 text-lg font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8C8C88]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-b border-[#242422]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h2
            className="text-xs uppercase tracking-[0.2em] text-[#8C8C88]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Built with
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {stack.map((item) => (
              <li
                key={item}
                className="rounded-sm border border-[#242422] px-3 py-1.5 text-sm text-[#F4F4F2]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-lg text-sm leading-relaxed text-[#8C8C88]">
            This is a small, working MVP built to learn the stack end to
            end, job queues, background workers, and a real deployment
            pipeline, not a polished product.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center">
          <p
            className="text-xs text-[#8C8C88]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            PulseWatch — an MVP by Muhammad Luqman
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#8C8C88] transition-colors hover:text-[#F4F4F2]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            github.com/MLuqman150/PulseWatch ↗
          </a>
        </div>
      </footer>
    </main>
  );
}