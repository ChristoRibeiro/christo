import { PROJECTS, HAS_STEALTH } from "@/lib/projects";

export function Portfolio() {
  return (
    <section className="mt-9">
      <p className="text-xs font-medium uppercase tracking-widest text-grey">
        Building
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {PROJECTS.map((p) => (
          <li key={p.name} className="text-body">
            {p.url ? (
              <a
                href={p.url}
                className="font-medium text-ink underline-offset-4 hover:underline"
              >
                {p.name}
              </a>
            ) : (
              <span className="font-medium text-ink">{p.name}</span>
            )}
            <span className="text-grey"> — {p.tagline}</span>
          </li>
        ))}
        {HAS_STEALTH && <li className="text-grey">More, in stealth.</li>}
      </ul>
    </section>
  );
}
