import { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children: ReactNode;
};

export default function Section({ id, eyebrow, title, description, children }: Props) {
  return (
    <section id={id} className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          {eyebrow && (
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-accent">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base text-muted sm:text-lg">{description}</p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
