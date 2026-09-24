import CardConversa from '../../components/CardConversa/CardConversa';

/**
 * Coluna 1 — fila de conversas agrupada (ver utils/fila.js para a regra).
 * Grupos vazios não aparecem; os contadores do topo já mostram o zero.
 */
export default function FilaConversas({ grupos, carregando, selecionadaId, onSelecionar }) {
  const visiveis = grupos.filter((g) => g.conversas.length > 0);

  return (
    <section className="coluna coluna-fila" aria-label="Fila de conversas">
      {carregando ? (
        <p className="coluna-vazia">Carregando conversas…</p>
      ) : visiveis.length === 0 ? (
        <p className="coluna-vazia">Nenhuma conversa por aqui ainda.</p>
      ) : (
        visiveis.map((grupo) => (
          <div key={grupo.id} className="fila-grupo">
            <h2 className="fila-grupo-titulo">
              {grupo.titulo}
              <span className="fila-grupo-contagem">{grupo.conversas.length}</span>
            </h2>
            <ul className="fila-lista">
              {grupo.conversas.map((conversa) => (
                <li key={conversa.id}>
                  <CardConversa
                    conversa={conversa}
                    selecionada={conversa.id === selecionadaId}
                    onSelecionar={onSelecionar}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
