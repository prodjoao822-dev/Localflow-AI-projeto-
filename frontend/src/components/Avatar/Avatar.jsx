import { iniciais } from '../../utils/formatadores';
import './Avatar.css';

/**
 * Avatar de texto (iniciais) — sem dependência de serviço externo de imagem.
 * @param {{ nome: string, size?: number }} props
 */
export default function Avatar({ nome, size = 40 }) {
  return (
    <span
      className="lf-avatar"
      style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.38)) }}
      title={nome}
    >
      {iniciais(nome)}
    </span>
  );
}
