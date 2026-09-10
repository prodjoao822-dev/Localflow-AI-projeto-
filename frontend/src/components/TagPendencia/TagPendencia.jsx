/**
 * Tag de pendência real dos requisitos (ex.: RN03). Usada onde o protótipo
 * implementa a tela, mas a regra de negócio ainda não foi decidida.
 * @param {{ codigo: string, descricao?: string }} props
 */
export default function TagPendencia({ codigo, descricao }) {
  return (
    <span className="pendencia-tag" title={descricao}>
      <span className="pendencia-dot" />
      Lógica pendente — {codigo}
    </span>
  );
}
