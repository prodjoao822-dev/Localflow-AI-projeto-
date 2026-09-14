import { conversasMock } from "../mocks/dadosMock";

export function filtrarPrioridade(conversas) {
  const prioridadesAltas = [];

  for (let i = 0; i < conversas.length; i++) {   // ← conversas, não conversasMock
    if (conversas[i].prioridade === "alta") {
      prioridadesAltas.push(conversas[i]);
    }
  }

  return prioridadesAltas;
}


console.log(filtrarPrioridade(conversasMock));

