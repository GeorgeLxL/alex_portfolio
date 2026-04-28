import { Github, Linkedin, Mail } from "lucide-react";

const social = [
  { Icon: Github, href: "https://github.com/yamposskype", label: "GitHub" },
  { Icon: Linkedin, href: "https://linkedin.com/in/alexyampolskyi", label: "LinkedIn" },
  { Icon: Mail, href: "mailto:alex.ymapolskyi@yahoo.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-md ring-1 ring-accent/40">
            <img src="/1.jpg" alt="Oleksandr Yampolskyi" className="h-full w-full object-cover" />
          </span>
          © {new Date().getFullYear()} Oleksandr Yampolskyi. Crafted with care.
        </div>
        <div className="flex items-center gap-4 text-muted">
          {social.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-text"
              aria-label={label}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
