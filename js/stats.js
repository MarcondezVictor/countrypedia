// ============================================================
// stats.js — lógica da página de rankings (pages/stats.html)
// Responsabilidades:
//   • construir 6 tabelas Top 10 com diferentes critérios
//   • cada tabela é uma "janela" Win95 dentro de um grid
// ============================================================


// ============================================================
// DEFINIÇÃO DOS RANKINGS
// Cada objeto descreve uma tabela:
//   id      — identificador da <div> destino no HTML
//   title   — título que aparece na barra azul
//   sort    — função de comparação para .sort()
//   value   — função que devolve o texto da coluna "valor"
// ============================================================
const RANKINGS = [
    {
        id:    "rank-population",
        title: "🌍 Most Populous Countries",
        sort:  (a, b) => b.population - a.population,
        value: c => c.population.toLocaleString() + " people"
    },
    {
        id:    "rank-area",
        title: "📐 Largest Countries by Area",
        sort:  (a, b) => b.area - a.area,
        value: c => c.area.toLocaleString() + " km²"
    },
    {
        id:    "rank-idh-high",
        title: "📈 Highest Human Development Index",
        sort:  (a, b) => b.idh - a.idh,
        value: c => c.idh.toFixed(3)
    },
    {
        id:    "rank-gdp",
        title: "💰 Highest GDP per Capita",
        sort:  (a, b) => b.gdp_per_capita - a.gdp_per_capita,
        value: c => "$" + c.gdp_per_capita.toLocaleString()
    },
    {
        id:    "rank-borders",
        title: "🗺️ Most Bordering Countries",
        sort:  (a, b) => b.borders.length - a.borders.length,
        value: c => c.borders.length + " border" + (c.borders.length !== 1 ? "s" : "")
    },
    {
        id:    "rank-idh-low",
        title: "📉 Lowest Human Development Index",
        sort:  (a, b) => a.idh - b.idh,
        value: c => c.idh.toFixed(3)
    }
];


// ============================================================
// buildRanking(ranking)
// Objetivo: ordena o array countries[] pelo critério do ranking,
//           pega nos primeiros 10, e constrói uma <table> com
//           posição, bandeira, nome do país e valor.
// Parâmetros:
//   ranking — objeto do array RANKINGS acima
// Devolve: nada (injeta HTML no elemento #ranking.id)
// ============================================================
function buildRanking(ranking) {
    const container = document.getElementById(ranking.id);
    if (!container) return;

    // ordena uma cópia do array (não altera o original) e pega os 10 primeiros
    const top10 = [...countries].sort(ranking.sort).slice(0, 10);

    // constrói a <table>:
    // <thead> com os cabeçalhos
    // <tbody> com uma <tr> por país
    let html = `
        <table class="countries-table ranking-table">
            <thead>
                <tr>
                    <th style="width:36px;">#</th>
                    <th style="width:36px;">Flag</th>
                    <th>Country</th>
                    <th>Value</th>
                    <th>Continent</th>
                </tr>
            </thead>
            <tbody>
    `;

    // para cada país do Top 10 cria uma linha <tr>
    top10.forEach((country, index) => {
        // medalhas para os três primeiros
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;

        html += `
            <tr style="cursor:pointer;" onclick="window.location.href='country.html?iso=${country.iso}'">
                <td style="text-align:center;font-weight:bold;">${medal}</td>
                <td><img src="../flags/${country.iso}.svg" alt="${country.name} flag"></td>
                <td><strong>${country.name}</strong></td>
                <td>${ranking.value(country)}</td>
                <td>${country.continent}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}


// ============================================================
// buildAllRankings()
// Objetivo: chama buildRanking() para cada item de RANKINGS.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function buildAllRankings() {
    RANKINGS.forEach(r => buildRanking(r));

    // atualiza status bar com o total de países no array
    document.getElementById("statusText").textContent =
        `Based on ${countries.length} countries`;
}


// ============================================================
// search() e randomCountry() — navbar
// Igual às outras páginas: redireciona pra home/countries.
// ============================================================
function search() {
    const term = document.getElementById("searchInput").value.toLowerCase().trim();
    if (!term) return;

    const results = countries.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.capital.name.toLowerCase().includes(term) ||
        c.demonym.toLowerCase().includes(term)
    );

    if (results.length === 1) {
        window.location.href = `country.html?iso=${results[0].iso}`;
    } else if (results.length > 1) {
        window.location.href = `countries.html?search=${encodeURIComponent(term)}`;
    }
}

function randomCountry() {
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `country.html?iso=${random.iso}`;
}


// ============================================================
// Inicialização
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    buildAllRankings();

    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("open");
    });
});
