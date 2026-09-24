import { iniciais } from '../../utils/formatadores';
import Icone from '../Icone/Icone';
import './Avatar.css';

/**
 * Avatar de pessoa (iniciais) — usado para usuários do painel.
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

/**
 * Avatar de canal — o Cliente Final aparece pelo canal de origem (WhatsApp),
 * como nas telas de referência. Hoje só existe o canal 'whatsapp'.
 * @param {{ canal?: string, size?: number }} props
 */
export function AvatarCanal({ canal = 'whatsapp', size = 40 }) {
  return (
    <span
      className="lf-avatar lf-avatar-canal"
      style={{ width: size, height: size }}
      title={canal === 'whatsapp' ? 'WhatsApp' : canal}
    >
      <Icone nome="whatsapp" size={Math.round(size * 0.45)} />
    </span>
  );
}
