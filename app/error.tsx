"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na aplicação:", error);
  }, [error]);

  const isApiError = error.message?.includes("API Error");
  const statusCode = isApiError
    ? error.message.split(": ")[1]?.split(" ")[0]
    : null;

  const title = statusCode === "404"
    ? "Página não encontrada"
    : statusCode === "429"
    ? "Muitas requisições"
    : "Algo deu errado";

  const description = statusCode === "404"
    ? "O caminho para esta página se perdeu nas Crônicas."
    : statusCode === "429"
    ? "Você fez muitas requisições. Aguarde um momento e tente novamente."
    : "Um erro inesperado aconteceu. Tente recarregar a página.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-sans text-sm font-medium tracking-[0.2em] uppercase text-[var(--accent-dim)] mb-6">
        {statusCode || "Erro"}
      </p>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mb-4">
        {title}
      </h1>
      <p className="font-sans text-[var(--text-muted)] max-w-md leading-relaxed mb-10">
        {description}
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--accent)] rounded-lg text-[var(--accent)] font-sans text-sm font-medium hover:bg-[var(--accent-light)] transition-colors"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-soft)] rounded-lg text-[var(--text-muted)] font-sans text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          Voltar à busca
        </Link>
      </div>
    </div>
  );
}
