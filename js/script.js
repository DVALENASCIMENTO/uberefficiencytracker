// ========================
// Funções Auxiliares
// ========================
function avaliarGanhosHora(valor) {
  if (valor < 25) return { nivel: "Baixo", cor: "red" };
  if (valor < 40) return { nivel: "Médio", cor: "yellow" };
  return { nivel: "Alto", cor: "lime" };
}

function avaliarGanhosViagem(valor) {
  if (valor < 10) return { nivel: "Baixo", cor: "red" };
  if (valor < 15) return { nivel: "Médio", cor: "yellow" };
  return { nivel: "Alto", cor: "lime" };
}

function avaliarViagensHora(valor) {
  if (valor < 1.5) return { nivel: "Baixo", cor: "red" };
  if (valor < 2.5) return { nivel: "Médio", cor: "yellow" };
  return { nivel: "Alto", cor: "lime" };
}

function avaliarEficiência(valor) {
  if (valor < 50) return { nivel: "Baixa", cor: "red" };
  if (valor < 75) return { nivel: "Boa", cor: "yellow" };
  return { nivel: "Excelente", cor: "lime" };
}

function ranking(valor) {
  if (valor < 50) return "🥉 Bronze";
  if (valor < 75) return "🥈 Prata";
  return "🥇 Ouro";
}

// ========================
// Renderização do Histórico
// ========================
function renderEfficiencyHistory() {
  const historyDiv = document.getElementById("efficiencyHistory");
  historyDiv.innerHTML = ""; // limpa antes de renderizar

  const efficiencies = JSON.parse(localStorage.getItem("efficiencies")) || [];

  efficiencies.forEach(item => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${item.date}:</strong> ${item.efficiency.toFixed(2)} ⭐`;
    historyDiv.appendChild(p);
  });
}

// ========================
// Função para criar cards
// ========================
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

    <h3 style="text-align:center; color:${day.nivelEf.cor}">
      🏆 Ranking: ${day.medalha}
    </h3>
  `;

  // Botão para apagar
  card.querySelector(".delete-btn").addEventListener("click", function () {
    card.remove();
    removeFromStorage(day.date);
    removeFromEfficiency(day.date);
    renderEfficiencyHistory();
  });

  resultsDiv.prepend(card);
}

// ========================
// Funções de LocalStorage
// ========================
function removeFromStorage(date) {
  let savedDays = JSON.parse(localStorage.getItem("days")) || [];
  savedDays = savedDays.filter(d => d.date !== date);
  localStorage.setItem("days", JSON.stringify(savedDays));
}

function removeFromEfficiency(date) {
  let efficiencies = JSON.parse(localStorage.getItem("efficiencies")) || [];
  efficiencies = efficiencies.filter(e => e.date !== date);
  localStorage.setItem("efficiencies", JSON.stringify(efficiencies));
}

// ========================
// Carregar dados ao iniciar
// ========================
window.onload = function () {
  const savedDays = JSON.parse(localStorage.getItem("days")) || [];
  savedDays.forEach(day => renderCard(day));

  renderEfficiencyHistory();
};

// ========================
// Captura do formulário
// ========================
document.getElementById("dayForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const hours = parseFloat(document.getElementById("hours").value);
  const trips = parseInt(document.getElementById("trips").value);
  const earnings = parseFloat(document.getElementById("earnings").value);

  if (!date || hours <= 0 || trips <= 0 || earnings <= 0) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  // Cálculos
  const earningsPerHour = earnings / hours;
  const earningsPerTrip = earnings / trips;
  const tripsPerHour = trips / hours;

  let efficiency = ((earningsPerHour / 50) * 40) +
                   ((earningsPerTrip / 20) * 30) +
                   ((tripsPerHour / 3) * 30);
  efficiency = Math.min(efficiency, 100);

  const dayData = {
    date,
    hours,
    trips,
    earnings,
    earningsPerHour,
    earningsPerTrip,
    tripsPerHour,
    efficiency,
    nivelHora: avaliarGanhosHora(earningsPerHour),
    nivelViagem: avaliarGanhosViagem(earningsPerTrip),
    nivelVph: avaliarViagensHora(tripsPerHour),
    nivelEf: avaliarEficiência(efficiency),
    medalha: ranking(efficiency)
  };

  // Salvar "days"
  const savedDays = JSON.parse(localStorage.getItem("days")) || [];
  savedDays.push(dayData);
  localStorage.setItem("days", JSON.stringify(savedDays));

  // Salvar "efficiencies"
  const efficiencies = JSON.parse(localStorage.getItem("efficiencies")) || [];
  efficiencies.push({ date, efficiency });
  localStorage.setItem("efficiencies", JSON.stringify(efficiencies));

  renderCard(dayData);
  renderEfficiencyHistory();
  document.getElementById("dayForm").reset();
});

// --- CONTROLADOR DO SPLASH (colocar no topo do seu script.js ou em um arquivo importado) ---
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splashScreen');
  const startBtn = document.getElementById('startBtn');

  if (!splash || !startBtn) {
    console.warn('Splash ou startBtn não encontrados no DOM.');
    return;
  }

  // impede scroll/interaction no fundo enquanto o splash estiver visível
  document.body.classList.add('no-scroll');

  // Se quiser pular o splash em visitas futuras, pode usar localStorage
  const skip = localStorage.getItem('skipSplash') === 'true';
  if (skip) {
    splash.style.display = 'none';
    document.body.classList.remove('no-scroll');
    return;
  }

  function hideSplash() {
    // adiciona classe de fade; ao terminar a transição remove o elemento visualmente
    splash.classList.add('fade-out');
    splash.addEventListener('transitionend', () => {
      // opcional: remover do DOM ou apenas esconder
      splash.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }, { once: true });
  }

  // clique no botão iniciar
  startBtn.addEventListener('click', () => {
    // opcional: memorizar para não mostrar da próxima vez
    // localStorage.setItem('skipSplash', 'true');
    hideSplash();
  });

  // permitir fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideSplash();
  });

  // opcional: clicar fora do conteúdo fecha (overlay click)
  splash.addEventListener('click', (e) => {
    if (e.target === splash) hideSplash();
  });

  // opcional: fechar automaticamente após X segundos (descomente se quiser)
  // setTimeout(hideSplash, 7000);
});
