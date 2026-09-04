/**
 * A marca: uma etiqueta de preço acesa pela mesma luz que ilumina a página.
 * O furo é preenchido com a cor da superfície onde a marca assenta, para que
 * funcione tanto no cartão do cabeçalho como em fundo claro.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path
        d="M17.6 5H25a2 2 0 0 1 2 2v7.4a2 2 0 0 1-.59 1.42L16.4 26.41a2 2 0 0 1-2.83 0L5.59 18.4a2 2 0 0 1 0-2.83L16.18 5.59A2 2 0 0 1 17.6 5Z"
        fill="currentColor"
      />
      <circle cx="21.4" cy="10.6" r="2.1" fill="hsl(var(--card))" />
    </svg>
  );
}
