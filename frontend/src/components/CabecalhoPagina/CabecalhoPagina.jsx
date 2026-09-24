import './CabecalhoPagina.css';

/**
 * Cabeçalho padrão das telas internas: breadcrumb opcional, título,
 * subtítulo e, à direita, as ações da página.
 * @param {{ secao?: string, titulo: string, subtitulo?: string, acoes?: React.ReactNode }} props
 */
export default function CabecalhoPagina({ secao, titulo, subtitulo, acoes }) {
  return (
    <header className="cabecalho-pagina">
      <div>
        {secao && <p className="cabecalho-pagina-secao">{secao}</p>}
        <h1 className="cabecalho-pagina-titulo">{titulo}</h1>
        {subtitulo && <p className="cabecalho-pagina-subtitulo">{subtitulo}</p>}
      </div>
      {acoes && <div className="cabecalho-pagina-acoes">{acoes}</div>}
    </header>
  );
}
