import React from 'react';
import './CardAtendimento.css';

/**
 * Componente responsável por exibir as informações resumidas de um atendimento.
 * Recebe via props o objeto `atendimento` contendo id, cliente, status, ultimaMensagem e dataAtualizacao.
 */
const CardAtendimento = ({ atendimento }) => {
  if (!atendimento || !atendimento.cliente) return null;

  const {
    id,
    cliente: { nome, avatar },
    status,
    ultimaMensagem,
    dataAtualizacao
  } = atendimento;

  // Formata a data para exibir apenas a hora ou uma data curta
  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Mapeia o status para um estilo/texto amigável
  const getStatusInfo = (statusText) => {
    switch (statusText) {
      case 'aguardando':
        return { label: 'Aguardando', className: 'status-aguardando' };
      case 'em_andamento':
        return { label: 'Em Andamento', className: 'status-andamento' };
      case 'concluido':
        return { label: 'Concluído', className: 'status-concluido' };
      default:
        return { label: statusText, className: 'status-default' };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="card-atendimento" data-id={id}>
      <div className="card-avatar-wrapper">
        <img src={avatar} alt={`Avatar de ${nome}`} className="card-avatar" />
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-nome">{nome}</h3>
          <span className="card-tempo">{formatarData(dataAtualizacao)}</span>
        </div>
        
        <div className="card-body">
          <p className="card-mensagem">{ultimaMensagem}</p>
        </div>
        
        <div className="card-footer">
          <span className={`card-status ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardAtendimento;
