import { LINKS } from "@/lib/links";

// The home page IS the site, so drop the self-referential "site" link.
const shown = LINKS.filter((l) => l.label !== "site");

export function Links() {
  return (
    <nav
      aria-label="Links"
      className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-sm text-grey"
    >
      {shown.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="capitalize underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
