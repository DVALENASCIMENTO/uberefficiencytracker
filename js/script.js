// Recuperar dados do LocalStorage ao carregar a página
window.onload = function() {
  const savedDays = JSON.parse(localStorage.getItem("days")) || [];
  savedDays.forEach(day => renderCard(day));
};

document.getElementById("dayForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const hours = parseFloat(document.getElementById("hours").value);
  const trips = parseInt(document.getElementById("trips").value);
  const earnings = parseFloat(document.getElementById("earnings").value);
  const fuelValue = parseFloat(document.getElementById("fuel").value); // valor abastecido
  const kmInicial = parseFloat(document.getElementById("kmInicial").value); // km inicial
  const kmFinal = parseFloat(document.getElementById("kmFinal").value); // km final

  // Cálculos básicos
  const earningsPerHour = earnings / hours;
  const earningsPerTrip = earnings / trips;
  const tripsPerHour = trips / hours;

  // Fórmula de eficiência (escala 0 a 100)
  let efficiency = ((earningsPerHour/50)*40) + ((earningsPerTrip/20)*30) + ((tripsPerHour/3)*30);
  if (efficiency > 100) efficiency = 100; // Limite máximo

  // Constantes de combustível
  const fuelPrice = 6.99; // preço do litro
  const consumoMedio = 10.5; // km/L do Uno Attractive 1.0 2015

  // Quilometragem
  const distancia = kmFinal - kmInicial;

  // Consumo teórico e real
  const litrosAbastecidos = fuelValue / fuelPrice;
  const litrosNecessarios = distancia / consumoMedio;

  // Economia proporcional à eficiência
  const litrosEconomizados = litrosNecessarios * (efficiency / 100);
  const valorEconomizado = litrosEconomizados * fuelPrice;

  // Funções auxiliares
  function avaliarGanhosHora(valor) {
    if (valor < 25) return {nivel: "Baixo", cor: "red"};
    if (valor < 40) return {nivel: "Médio", cor: "yellow"};
    return {nivel: "Alto", cor: "lime"};
  }

  function avaliarGanhosViagem(valor) {
    if (valor < 10) return {nivel: "Baixo", cor: "red"};
    if (valor < 15) return {nivel: "Médio", cor: "yellow"};
    return {nivel: "Alto", cor: "lime"};
  }

  function avaliarViagensHora(valor) {
    if (valor < 1.5) return {nivel: "Baixo", cor: "red"};
    if (valor < 2.5) return {nivel: "Médio", cor: "yellow"};
    return {nivel: "Alto", cor: "lime"};
  }

  function avaliarEficiência(valor) {
    if (valor < 50) return {nivel: "Baixa", cor: "red"};
    if (valor < 75) return {nivel: "Boa", cor: "yellow"};
    return {nivel: "Excelente", cor: "lime"};
  }

  function ranking(valor) {
    if (valor < 50) return "🥉 Bronze";
    if (valor < 75) return "🥈 Prata";
    return "🥇 Ouro";
  }

  const dayData = {
    date,
    hours,
    trips,
    earnings,
    earningsPerHour,
    earningsPerTrip,
    tripsPerHour,
    efficiency,
    kmInicial,
    kmFinal,
    distancia,
    litrosAbastecidos,
    litrosNecessarios,
    litrosEconomizados,
    valorEconomizado,
    nivelHora: avaliarGanhosHora(earningsPerHour),
    nivelViagem: avaliarGanhosViagem(earningsPerTrip),
    nivelVph: avaliarViagensHora(tripsPerHour),
    nivelEf: avaliarEficiência(efficiency),
    medalha: ranking(efficiency)
  };

  // Salvar no LocalStorage
  const savedDays = JSON.parse(localStorage.getItem("days")) || [];
  savedDays.push(dayData);
  localStorage.setItem("days", JSON.stringify(savedDays));

  // Mostrar card
  renderCard(dayData);

  // Resetar formulário
  document.getElementById("dayForm").reset();
});

// Função para criar um card
function renderCard(day) {
  const resultsDiv = document.getElementById("results");
  const card = document.createElement("div");
  card.classList.add("result-card");

  card.innerHTML = `
    <button class="delete-btn">❌</button>
    <h3>📅 ${day.date}</h3>
    <p><strong>Horas Online:</strong> ${day.hours}h</p>
    <p><strong>Viagens:</strong> ${day.trips}</p>
    <p><strong>Ganhos:</strong> R$ ${day.earnings.toFixed(2)}</p>
    <p><strong>KM Inicial:</strong> ${day.kmInicial} km</p>
    <p><strong>KM Final:</strong> ${day.kmFinal} km</p>
    <p><strong>Distância Percorrida:</strong> ${day.distancia.toFixed(1)} km</p>
    <p><strong>Litros Abastecidos:</strong> ${day.litrosAbastecidos.toFixed(2)} L</p>
    <p><strong>Litros Necessários (10,5 km/L):</strong> ${day.litrosNecessarios.toFixed(2)} L</p>
    <p><strong>Gasolina Economizada (pela eficiência):</strong> ${day.litrosEconomizados.toFixed(2)} L</p>
    <p><strong>Valor Economizado:</strong> R$ ${day.valorEconomizado.toFixed(2)}</p>
    <p><strong>Ganhos/Hora:</strong> R$ ${day.earningsPerHour.toFixed(2)} 
      <span style="color:${day.nivelHora.cor}">(${day.nivelHora.nivel})</span>
    </p>
    <p><strong>Ganhos/Viagem:</strong> R$ ${day.earningsPerTrip.toFixed(2)} 
      <span style="color:${day.nivelViagem.cor}">(${day.nivelViagem.nivel})</span>
    </p>
    <p><strong>Viagens/Hora:</strong> ${day.tripsPerHour.toFixed(2)} 
      <span style="color:${day.nivelVph.cor}">(${day.nivelVph.nivel})</span>
    </p>
    <p><strong>Eficiência Geral:</strong> ${day.efficiency.toFixed(2)} ⭐ 
      <span style="color:${day.nivelEf.cor}">(${day.nivelEf.nivel})</span>
    </p>
    <h3 style="text-align:center; color:${day.nivelEf.cor}">🏆 Ranking: ${day.medalha}</h3>
  `;

  // Botão de apagar
  card.querySelector(".delete-btn").addEventListener("click", function() {
    card.remove();
    removeFromStorage(day.date);
  });

  resultsDiv.prepend(card);
}

// Função para remover do LocalStorage
function removeFromStorage(date) {
  let savedDays = JSON.parse(localStorage.getItem("days")) || [];
  savedDays = savedDays.filter(d => d.date !== date);
  localStorage.setItem("days", JSON.stringify(savedDays));
}
