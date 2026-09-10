import { useContext } from 'react';
import { AuthContext } from './authContextCore';

/** Hook de acesso ao contexto de autenticação. */
export function useAuth() {
  return useContext(AuthContext);
}
