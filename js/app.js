// ============================================================
// app.js — lógica da página principal (home / index.html)
// Responsabilidades:
//   • construir as tabs de continente
//   • construir o mosaico de cards de países
//   • ordenar os países
//   • pesquisar no array
//   • navegar para um país aleatório
// ============================================================


// --- ESTADO GLOBAL ---
// Variáveis que guardam qual continente/ordenação está ativo.
// Ficam fora das funções pra qualquer função conseguir ler/alterar.
let activeContinent = "All";   // começa mostrando todos os continentes
let activeSort = "name-asc";   // ordenação padrão: A → Z pelo nome


// ============================================================
// buildTabs()
// Objetivo: cria os botões de filtro de continente (tabs)
//           e adiciona-os na div #tabs do HTML.
// Parâmetros: nenhum
// Devolve: nada (void) — só manipula o DOM
// ============================================================
function buildTabs() {
    // pega na div onde as tabs vão aparecer
    const tabsContainer = document.getElementById("tabs");

    // extrai os continentes únicos do array de países
    // Set() remove duplicados automaticamente, depois espalhamos com ...
    const continents = ["All", ...new Set(countries.map(c => c.continent))];

    // para cada continente cria um <button> e adiciona no container
    continents.forEach(continent => {
        const btn = document.createElement("button"); // cria o botão
        btn.className = "tab-btn";                    // aplica o estilo Win95
        btn.textContent = continent;                  // texto visível

        // a tab "All" começa marcada como ativa
        if (continent === "All") btn.classList.add("active");

        // quando o utilizador clica numa tab:
        btn.addEventListener("click", () => {
            // tira o "active" de todas as tabs
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            // coloca "active" só na tab clicada
            btn.classList.add("active");
            // atualiza a variável de estado
            activeContinent = continent;
            // reconstrói o mosaico com o filtro novo
            buildGrid();
        });

        tabsContainer.appendChild(btn); // adiciona o botão ao DOM
    });
}


// ============================================================
// buildGrid()
// Objetivo: lê o array countries, filtra pelo continente ativo,
//           ordena, e cria um <a> card pra cada país na div #countriesGrid.
// Parâmetros: nenhum
// Devolve: nada (void) — só manipula o DOM
// ============================================================
function buildGrid() {
    // pega no container da grelha e limpa o conteúdo anterior
    const grid = document.getElementById("countriesGrid");
    grid.innerHTML = "";

    // filtra por continente — se for "All" usa o array completo
    const filtered = activeContinent === "All"
        ? countries
        : countries.filter(c =>
            c.continent === activeContinent ||
            // países transcontinentais podem aparecer em múltiplos continentes
            (c.transcontinental && c.continents.includes(activeContinent))
        );

    // ordena a lista filtrada usando a função sortCountries()
    const sorted = sortCountries(filtered);

    // para cada país cria um card <a> com bandeira e nome
    // <a> é usado aqui porque cada card é um link pra página do país
    sorted.forEach(country => {
        const card = document.createElement("a"); // <a> — tag de hiperligação
        card.className = "country-card";
        // link pra página de detalhe passando o código ISO no URL
        card.href = `pages/country.html?iso=${country.iso}`;

        // HTML interno do card: bandeira, nome, capital e população
        card.innerHTML = `
            <img src="flags/${country.iso}.svg" alt="${country.name} flag">
            <span class="card-name">${country.name}</span>
            <span class="card-sub">${country.capital.name}</span>
            <span class="card-sub">${country.population.toLocaleString()}</span>
        `;

        grid.appendChild(card); // adiciona o card ao mosaico
    });

    // atualiza o texto da status bar com quantos países foram encontrados
    document.getElementById("statusText").textContent =
        `${sorted.length} countr${sorted.length !== 1 ? "ies" : "y"} found`;
}


// ============================================================
// sortCountries(list)
// Objetivo: ordena uma lista de países com base em activeSort.
// Parâmetros:
//   list — array de objetos de países a ordenar
// Devolve: novo array ordenado (não altera o original)
// ============================================================
function sortCountries(list) {
    // spread [...list] cria uma cópia pra não alterar o array original
    return [...list].sort((a, b) => {
        switch (activeSort) {
            case "name-asc":         return a.name.localeCompare(b.name);         // A → Z
            case "name-desc":        return b.name.localeCompare(a.name);         // Z → A
            case "population-desc":  return b.population - a.population;          // mais populoso primeiro
            case "population-asc":   return a.population - b.population;          // menos populoso primeiro
            case "area-desc":        return b.area - a.area;                      // maior área primeiro
            case "area-asc":         return a.area - b.area;                      // menor área primeiro
            case "idh-desc":         return b.idh - a.idh;                        // maior IDH primeiro
            case "idh-asc":          return a.idh - b.idh;                        // menor IDH primeiro
            default:                 return a.name.localeCompare(b.name);         // fallback: A → Z
        }
    });
}


// ============================================================
// changeSort()
// Objetivo: chamada pelo <select> do HTML quando o utilizador
//           muda a ordenação — atualiza activeSort e reconstrói.
// Parâmetros: nenhum (lê direto do DOM)
// Devolve: nada
// ============================================================
function changeSort() {
    activeSort = document.getElementById("sortSelect").value; // lê o valor escolhido
    buildGrid(); // reconstrói a grelha com a nova ordenação
}


// ============================================================
// buildStats()
// Objetivo: calcula e mostra as estatísticas globais na stats bar.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function buildStats() {
    // continentes únicos — Set remove duplicados automaticamente
    const continents = new Set(countries.map(c => c.continent));
    document.getElementById("totalCountries").textContent = countries.length;
    document.getElementById("totalContinents").textContent = continents.size;

}


// ============================================================
// buildDidYouKnow()
// Objetivo: escolhe um país aleatório e mostra uma curiosidade
//           (capital, número de fronteiras ou continente).
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function buildDidYouKnow() {
    // país aleatório — mesma lógica do randomCountry()
    const c = countries[Math.floor(Math.random() * countries.length)];

    // três curiosidades possíveis — escolhemos uma ao acaso
    const curiosidades = [
        `The capital of <strong>${c.name}</strong> is <strong>${c.capital.name}</strong>.`,
        `<strong>${c.name}</strong> has <strong>${c.borders.length}</strong> border${c.borders.length !== 1 ? "s" : ""}.`,
        `<strong>${c.name}</strong> is located in <strong>${c.transcontinental ? c.continents.join(" and ") : c.continent}</strong>.`,
    ];
    const curiosidade = curiosidades[Math.floor(Math.random() * curiosidades.length)];

    document.getElementById("didYouKnow").innerHTML = `
        <img src="flags/${c.iso}.svg" alt="${c.name} flag">
        <span><em>Did you know?</em> ${curiosidade}</span>
    `;
}


// ============================================================
// randomCountry()
// Objetivo: navega pra um país escolhido aleatoriamente.
//           Chamado pelo link "Random" na navbar.
// Parâmetros: nenhum
// Devolve: nada (redireciona a página)
// ============================================================
function randomCountry() {
    // Math.random() gera número entre 0 e 1
    // multiplicado pelo tamanho do array dá um índice aleatório válido
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `pages/country.html?iso=${random.iso}`;
}


// ============================================================
// search()
// Objetivo: filtra o mosaico em tempo real pelo texto digitado.
//           Procura por nome, capital e gentílico do país.
//           Chamada pelo input da navbar e pelo botão Search.
// Parâmetros: nenhum (lê o valor do #searchInput)
// Devolve: nada
// ============================================================
function search() {
    // lê e normaliza o texto de pesquisa (lowercase + sem espaços nas pontas)
    const term = document.getElementById("searchInput").value.toLowerCase().trim();

    // se o campo estiver vazio reconstrói a grelha normal sem filtro
    if (!term) {
        buildGrid();
        return;
    }

    // filtra os países que contêm o termo no nome, capital ou gentílico
    const results = countries.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.capital.name.toLowerCase().includes(term) ||
        c.demonym.toLowerCase().includes(term)
    );

    const grid = document.getElementById("countriesGrid");
    grid.innerHTML = ""; // limpa a grelha atual

    // se não encontrou nada mostra mensagem
    if (results.length === 0) {
        grid.innerHTML = `
            <p style="padding:16px; font-size:var(--text-sm);">
                No countries found for "${term}".
            </p>
        `;
        document.getElementById("statusText").textContent = `No results found`;
        return;
    }

    // se só há um resultado vai direto pra a página do país
    if (results.length === 1) {
        window.location.href = `pages/country.html?iso=${results[0].iso}`;
        return;
    }

    // se há vários resultados, mostra-os no mosaico
    const sorted = sortCountries(results);
    sorted.forEach(country => {
        const card = document.createElement("a"); // <a> — hiperligação pra cada resultado
        card.className = "country-card";
        card.href = `pages/country.html?iso=${country.iso}`;
        card.innerHTML = `
            <img src="flags/${country.iso}.svg" alt="${country.name} flag">
            <span class="card-name">${country.name}</span>
            <span class="card-sub">${country.capital.name}</span>
            <span class="card-sub">${country.population.toLocaleString()}</span>
        `;
        grid.appendChild(card);
    });

    document.getElementById("statusText").textContent =
        `${results.length} result${results.length !== 1 ? "s" : ""} for "${term}"`;
}


// ============================================================
// Inicialização — DOMContentLoaded
// Só executa depois que o browser terminou de montar o HTML.
// É aqui que arrancamos tudo e ligamos os event listeners.
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    buildStats();        // preenche os contadores da stats bar
    buildDidYouKnow();   // mostra a curiosidade do dia na caixa
    buildTabs();         // cria os botões de continente
    buildGrid();         // constrói o mosaico de países

    // pesquisa em tempo real: dispara search() a cada letra digitada
    document.getElementById("searchInput").addEventListener("input", search);

    // pesquisa ao pressionar Enter no campo de pesquisa
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    // se o URL tiver ?search=... (vindo de outra página), faz a pesquisa automaticamente
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get("search");
    if (searchTerm) {
        document.getElementById("searchInput").value = searchTerm;
        search();
    }

    // hamburger: alterna a classe "open" no menu de links (mostra/esconde em mobile)
    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("open");
    });
});
