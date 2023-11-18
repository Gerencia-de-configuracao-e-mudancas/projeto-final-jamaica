// funcao para formatar o horario;
export function formatarDataHora(dataHoraString) {
  const dataHora = new Date(dataHoraString);
  const optionsData = { day: 'numeric', month: 'long'};
  const optionsHora = { hour: '2-digit', minute: '2-digit' };

  const dataFormatada = new Intl.DateTimeFormat('pt-BR', optionsData).format(dataHora);
  const horaFormatada = new Intl.DateTimeFormat('pt-BR', optionsHora).format(dataHora);

  return `${dataFormatada}, ${horaFormatada}`;
}

// função para pegar o horario da cidade em que a requisição vai ser feita;
export function ajustarHora(offsetMinutes) {
  let horaCerta = (new Date().getUTCHours() * 60) + (offsetMinutes);
  if (horaCerta < 0) { horaCerta = (24 * 60) + offsetMinutes }
  horaCerta = Math.floor(horaCerta / 60)
  if (horaCerta > 23) { horaCerta = horaCerta % 24}

  return horaCerta;
}