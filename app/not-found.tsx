import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-sans text-sm font-medium tracking-[0.2em] uppercase text-[var(--accent-dim)] mb-6">
        404
      </p>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mb-4">
        Página não encontrada
      </h1>
      <p className="font-sans text-[var(--text-muted)] max-w-md leading-relaxed mb-10">
        O caminho para esta página se perdeu nas Crônicas. Talvez a busca possa te guiar de volta.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--accent)] rounded-lg text-[var(--accent)] font-sans text-sm font-medium hover:bg-[var(--accent-light)] transition-colors"
      >
        Voltar à busca
      </Link>
    </div>
  );
}
