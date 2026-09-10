import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './authContextCore';

/**
 * Provider de autenticação do protótipo.
 *
 * No MVP não existe backend real (RNF01 — autenticação segura fica para a
 * etapa de IAM + JWT). A sessão fica no localStorage apenas para tornar o
 * protótipo navegável; esta camada isola a decisão para que a troca por
 * tokens reais não toque nas telas.
 */

const CHAVE_SESSAO = 'localflow.sessao';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function restaurarSessao() {
      try {
        const salvo = localStorage.getItem(CHAVE_SESSAO);
        if (salvo) {
          const sessao = JSON.parse(salvo);
          const restaurado = await authService.buscarPorId(sessao.id);
          if (ativo && restaurado) setUsuario(restaurado);
          else if (ativo) localStorage.removeItem(CHAVE_SESSAO);
        }
      } catch {
        if (ativo) localStorage.removeItem(CHAVE_SESSAO);
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    restaurarSessao();
    return () => {
      ativo = false;
    };
  }, []);

  async function entrar(email, senha) {
    const autenticado = await authService.login({ email, senha });
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ id: autenticado.id }));
    setUsuario(autenticado);
    return autenticado;
  }

  function sair() {
    localStorage.removeItem(CHAVE_SESSAO);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}
