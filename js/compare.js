// ============================================================
// compare.js — lógica da página de comparação de países
//              (pages/compare.html)
// Responsabilidades:
//   • popular dois <select> com todos os países
//   • construir a tabela de comparação lado a lado
//   • destacar o "vencedor" de cada campo numérico
// ============================================================


// ============================================================
// populateSelects()
// Objetivo: preenche os dois <select> com todos os países
//           ordenados alfabeticamente.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function populateSelects() {
    // ordena os países por nome para os dropdowns
    const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));

    const selectA = document.getElementById("selectA");
    const selectB = document.getElementById("selectB");

    // opção vazia no início — força o utilizador a escolher
    const placeholder = '<option value="">— Select a country —</option>';
    selectA.innerHTML = placeholder;
    selectB.innerHTML = placeholder;

    // cria uma <option> por país em ambos os selects
    sorted.forEach(c => {
        const optA = document.createElement("option");
        optA.value = c.iso;
        optA.textContent = c.name;

        const optB = optA.cloneNode(true); // copia a opção pra o segundo select

        selectA.appendChild(optA);
        selectB.appendChild(optB);
    });
}


// ============================================================
// buildComparison()
// Objetivo: lê os dois ISO selecionados, vai buscar os objetos
//           ao array countries[], e constrói a tabela comparativa.
//           Destaca a verde o valor melhor em campos numéricos.
//           Chamada sempre que um dos <select> muda.
// Parâmetros: nenhum (lê os valores de #selectA e #selectB)
// Devolve: nada
// ============================================================
function buildComparison() {
    const isoA = document.getElementById("selectA").value;
    const isoB = document.getElementById("selectB").value;

    const output = document.getElementById("compareOutput");

    // nenhum ou só um país selecionado — mostra instrução
    if (!isoA || !isoB) {
        output.innerHTML = `
            <p style="padding:24px; text-align:center; font-size:var(--text-sm); color:var(--text-muted);">
                Select two countries above to compare them.
            </p>
        `;
        return;
    }

    // mesmo país nos dois lados — avisa o utilizador
    if (isoA === isoB) {
        output.innerHTML = `
            <p style="padding:24px; text-align:center; font-size:var(--text-sm); color:var(--text-muted);">
                Please select two different countries.
            </p>
        `;
        return;
    }

    // vai buscar os objetos ao array pelo ISO
    const cA = countries.find(c => c.iso === isoA);
    const cB = countries.find(c => c.iso === isoB);

    // função auxiliar: retorna o estilo de destaque pra o campo vencedor
    // higher = true → maior número é melhor (população, área, GDP)
    // higher = false → menor número é melhor (IDH não tem "melhor" óbvio — usamos higher=true)
    function win(valA, valB, higher = true) {
        if (valA === valB) return ["", ""];  // empate — sem destaque
        const aWins = higher ? valA > valB : valA < valB;
        return aWins
            ? ["background:var(--win-color);font-weight:bold;", ""]
            : ["", "background:var(--win-color);font-weight:bold;"];
    }

    // calcula estilos de vencedor pra cada campo numérico
    const [popA, popB]   = win(cA.population,     cB.population);
    const [areaA, areaB] = win(cA.area,            cB.area);
    const [idhA, idhB]   = win(cA.idh,             cB.idh);
    const [gdpA, gdpB]   = win(cA.gdp_per_capita,  cB.gdp_per_capita);
    const [borA, borB]   = win(cA.borders.length,  cB.borders.length);
    const [indA, indB]   = win(cB.independence_year, cA.independence_year); // menor ano = mais antigo = vence

    // constrói a tabela de comparação:
    // col 1: campo (150px fixo)    col 2: país A (50%)    col 3: país B (50%)
    // <colgroup> define as larguras fixas das colunas — sem isto o browser
    // ajusta automaticamente ao conteúdo e o layout muda a cada seleção
    output.innerHTML = `
        <table class="compare-table">
            <colgroup>
                <col style="width:150px">
                <col style="width:50%">
                <col style="width:50%">
            </colgroup>
            <thead>
                <tr>
                    <th class="compare-field-col">Field</th>
                    <th>
                        <div class="compare-header">
                            <img src="../flags/${cA.iso}.svg" alt="${cA.name} flag" class="compare-flag">
                            ${cA.name}
                        </div>
                    </th>
                    <th>
                        <div class="compare-header">
                            <img src="../flags/${cB.iso}.svg" alt="${cB.name} flag" class="compare-flag">
                            ${cB.name}
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="compare-label">Continent</td>
                    <td>${cA.transcontinental ? cA.continents.join(" / ") : cA.continent}</td>
                    <td>${cB.transcontinental ? cB.continents.join(" / ") : cB.continent}</td>
                </tr>
                <tr>
                    <td class="compare-label">Capital</td>
                    <td>${cA.capital.name}</td>
                    <td>${cB.capital.name}</td>
                </tr>
                <tr>
                    <td class="compare-label">Government</td>
                    <td>${cA.government}</td>
                    <td>${cB.government}</td>
                </tr>
                <tr>
                    <td class="compare-label">Population</td>
                    <td style="${popA}">${cA.population.toLocaleString()}</td>
                    <td style="${popB}">${cB.population.toLocaleString()}</td>
                </tr>
                <tr>
                    <td class="compare-label">Area</td>
                    <td style="${areaA}">${cA.area.toLocaleString()} km²</td>
                    <td style="${areaB}">${cB.area.toLocaleString()} km²</td>
                </tr>
                <tr>
                    <td class="compare-label">HDI</td>
                    <td style="${idhA}">${cA.idh.toFixed(3)}</td>
                    <td style="${idhB}">${cB.idh.toFixed(3)}</td>
                </tr>
                <tr>
                    <td class="compare-label">GDP per capita</td>
                    <td style="${gdpA}">$${cA.gdp_per_capita.toLocaleString()}</td>
                    <td style="${gdpB}">$${cB.gdp_per_capita.toLocaleString()}</td>
                </tr>
                <tr>
                    <td class="compare-label">Borders</td>
                    <td style="${borA}">${cA.borders.length} countries</td>
                    <td style="${borB}">${cB.borders.length} countries</td>
                </tr>
                <tr>
                    <td class="compare-label">Independence</td>
                    <td style="${indA}">${cA.independence_year}</td>
                    <td style="${indB}">${cB.independence_year}</td>
                </tr>
                <tr>
                    <td class="compare-label">Currency</td>
                    <td>${cA.currency}</td>
                    <td>${cB.currency}</td>
                </tr>
                <tr>
                    <td class="compare-label">Languages</td>
                    <td>${cA.languages.join(", ")}</td>
                    <td>${cB.languages.join(", ")}</td>
                </tr>
                <tr>
                    <td class="compare-label">National animal</td>
                    <td>${cA.national_animal}</td>
                    <td>${cB.national_animal}</td>
                </tr>
                <tr>
                    <td class="compare-label">Phone code</td>
                    <td>${cA.phone_code}</td>
                    <td>${cB.phone_code}</td>
                </tr>
            </tbody>
        </table>
        <p style="padding:6px 8px;font-size:11px;color:var(--text-muted);border-top:1px solid var(--border-dark);">
            Highlighted cells indicate the higher value in numerical fields.
        </p>
    `;
}


// ============================================================
// search() e randomCountry() — navbar
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
    populateSelects();
    buildComparison(); // mostra a instrução inicial (nenhum país selecionado)

    // reconstrói a comparação sempre que um select muda
    document.getElementById("selectA").addEventListener("change", buildComparison);
    document.getElementById("selectB").addEventListener("change", buildComparison);

    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("open");
    });
});
