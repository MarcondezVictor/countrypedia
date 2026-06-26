// ============================================================
// continents.js — lógica da página de continentes
//                 (pages/continents.html)
// Responsabilidades:
//   • construir os cards de resumo por continente
//   • abrir/fechar a janela de países do continente selecionado
//   • pré-selecionar continente se vier ?continent= no URL
//   • pesquisa na navbar (redireciona pra home ou countries)
// ============================================================


// imagens de cada continente — caminhos relativos a /pages/
const continentImage = {
    "Africa":        "../images/africa.png",
    "Asia":          "../images/asia.png",
    "Europe":        "../images/europe.png",
    "North America": "../images/north-america.png",
    "South America": "../images/south-america.png",
    "Oceania":       "../images/oceania.png"
};


// ============================================================
// buildContinents()
// Objetivo: lê o array countries[], agrupa por continente,
//           calcula as estatísticas e cria um card pra cada
//           continente no #continentsGrid.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function buildContinents() {
    const grid = document.getElementById("continentsGrid");
    grid.innerHTML = ""; // limpa cards anteriores

    // extrai os continentes únicos e ordena alfabeticamente
    const continents = [...new Set(countries.map(c => c.continent))].sort();

    continents.forEach(cont => {
        // filtra os países que pertencem a este continente
        // inclui países transcontinentais que tenham este continente na lista
        const contCountries = countries.filter(c =>
            c.continent === cont ||
            (c.transcontinental && c.continents.includes(cont))
        );

        // --- CÁLCULO DE ESTATÍSTICAS ---
        // reduce() percorre o array acumulando um valor

        // soma de todas as populações
        const totalPop = contCountries.reduce((sum, c) => sum + c.population, 0);

        // soma de todas as áreas
        const totalArea = contCountries.reduce((sum, c) => sum + c.area, 0);

        // país mais populoso (reduce compara e guarda o maior)
        const mostPopulous = contCountries.reduce(
            (max, c) => c.population > max.population ? c : max,
            contCountries[0]
        );

        // país com maior área
        const largest = contCountries.reduce(
            (max, c) => c.area > max.area ? c : max,
            contCountries[0]
        );

        // país com maior IDH
        const highestIDH = contCountries.reduce(
            (max, c) => c.idh > max.idh ? c : max,
            contCountries[0]
        );

        // cria o card como <div> — ao clicar abre a janela do continente
        const card = document.createElement("div");
        card.className = "continent-card raised"; // raised = efeito Win95
        card.onclick = () => openContinent(cont);

        // HTML interno do card:
        // cabeçalho azul com <img> do continente + nome
        // <table> com as estatísticas (countries, population, area, etc.)
        // rodapé com instrução de clique
        card.innerHTML = `
            <div class="continent-card-header">
                <img src="${continentImage[cont]}" class="continent-img" alt="${cont}">
                <span class="continent-name">${cont}</span>
            </div>
            <table class="continent-table">
                <tr>
                    <td>Countries</td>
                    <td><strong>${contCountries.length}</strong></td>
                </tr>
                <tr>
                    <td>Population</td>
                    <td><strong>${formatNum(totalPop)}</strong></td>
                </tr>
                <tr>
                    <td>Area</td>
                    <td><strong>${formatNum(totalArea)} km²</strong></td>
                </tr>
                <tr>
                    <td>Most populous</td>
                    <td><strong>${mostPopulous.name}</strong></td>
                </tr>
                <tr>
                    <td>Largest</td>
                    <td><strong>${largest.name}</strong></td>
                </tr>
                <tr>
                    <td>Highest HDI</td>
                    <td><strong>${highestIDH.name} (${highestIDH.idh})</strong></td>
                </tr>
            </table>
            <div class="continent-card-footer">
                Click to see countries →
            </div>
        `;

        grid.appendChild(card);
    });
}


// ============================================================
// openContinent(cont)
// Objetivo: mostra a janela secundária (#continentWindow) com
//           os cards de países do continente clicado.
//           Faz scroll automático até à janela.
// Parâmetros:
//   cont — nome do continente (string, ex: "Europe")
// Devolve: nada
// ============================================================
function openContinent(cont) {
    // filtra e ordena alfabeticamente os países do continente
    const contCountries = countries
        .filter(c =>
            c.continent === cont ||
            (c.transcontinental && c.continents.includes(cont))
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const grid = document.getElementById("continentCountriesGrid");
    grid.innerHTML = ""; // limpa cards anteriores

    // cria um card <a> (hiperligação) pra cada país do continente
    // reutiliza o mesmo estilo .country-card da home
    contCountries.forEach(country => {
        const card = document.createElement("a"); // <a> — link pra página do país
        card.className = "country-card";
        card.href = `country.html?iso=${country.iso}`; // caminho relativo dentro de /pages/
        card.innerHTML = `
            <img src="../flags/${country.iso}.svg" alt="${country.name} flag">
            <span>${country.name}</span>
        `;
        grid.appendChild(card);
    });

    // atualiza o título e o status da janela secundária
    document.getElementById("continentWindowTitle").textContent = cont;
    document.getElementById("continentStatusText").textContent =
        `${contCountries.length} countries`;

    // mostra a janela e faz scroll suave até ela
    const win = document.getElementById("continentWindow");
    win.style.display = "block";
    win.scrollIntoView({ behavior: "smooth" });
}


// ============================================================
// closeContinentWindow()
// Objetivo: esconde a janela de países do continente.
//           Chamada pelo botão ✕ da janela secundária.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function closeContinentWindow() {
    document.getElementById("continentWindow").style.display = "none";
}


// ============================================================
// formatNum(n)
// Objetivo: formata números grandes de forma legível.
//           Ex: 1500000 → "1.5M", 215000000 → "215.0M"
// Parâmetros:
//   n — número inteiro (população ou área)
// Devolve: string formatada
// ============================================================
function formatNum(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B"; // bilhões
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M"; // milhões
    if (n >= 1e3) return (n / 1e3).toFixed(0) + "K"; // milhares
    return n; // número pequeno, retorna como está
}


// ============================================================
// search()
// Objetivo: pesquisa na navbar — redireciona pra a página de
//           país (1 resultado) ou pra countries com ?search=
//           (vários resultados). Se campo vazio não faz nada.
// Parâmetros: nenhum (lê o #searchInput)
// Devolve: nada
// ============================================================
function search() {
    const term = document.getElementById("searchInput").value.toLowerCase().trim();
    if (!term) return; // campo vazio — não faz nada

    const results = countries.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.capital.name.toLowerCase().includes(term) ||
        c.demonym.toLowerCase().includes(term)
    );

    // um resultado → vai direto pra aquele país
    if (results.length === 1) {
        window.location.href = `country.html?iso=${results[0].iso}`;
        return;
    }

    // vários resultados → vai pra countries.html com o filtro no URL
    if (results.length > 1) {
        window.location.href = `countries.html?search=${encodeURIComponent(term)}`;
    }
}


// ============================================================
// randomCountry()
// Objetivo: navega pra um país aleatório.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function randomCountry() {
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `country.html?iso=${random.iso}`;
}


// ============================================================
// Inicialização — DOMContentLoaded
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    buildContinents(); // constrói os cards de continente

    // se o URL tiver ?continent=Europe, abre esse continente automaticamente
    // (usado quando se clica numa tag de continente na página de país)
    const params = new URLSearchParams(window.location.search);
    const preselected = params.get("continent");
    if (preselected) openContinent(preselected);

    // Enter no input de pesquisa dispara search()
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    // hamburger: mostra/esconde o menu em mobile
    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("open");
    });
});
