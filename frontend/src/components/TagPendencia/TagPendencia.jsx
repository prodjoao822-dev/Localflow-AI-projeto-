/**
 * Placeholder visível de lacuna real ([PENDENTE] nos requisitos/contrato).
 * Regra do projeto: lacuna não se esconde nem se inventa — se mostra.
 * @param {{ children: React.ReactNode, descricao?: string }} props
 *   children = texto curto; descricao = detalhe no tooltip
 */
export default function TagPendencia({ children, descricao }) {
  return (
    <span className="pendencia-tag" title={descricao}>
      <span className="pendencia-dot" aria-hidden="true" />
      {children}
    </span>
  );
}
