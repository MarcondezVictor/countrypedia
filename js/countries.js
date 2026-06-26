// ============================================================
// countries.js — lógica da página de listagem completa
//                (pages/countries.html)
// Responsabilidades:
//   • construir a tabela HTML com todos os países
//   • filtrar por continente
//   • ordenar por várias colunas
//   • paginar os resultados (25 por página)
//   • pesquisar no array
// ============================================================


// --- ESTADO GLOBAL ---
// Estas variáveis controlam o estado atual da tabela.
let currentPage     = 1;          // página atual da paginação
let activeSort      = "name-asc"; // ordenação ativa (padrão: A → Z)
let activeContinent = "All";      // filtro de continente (padrão: todos)
const PER_PAGE      = 25;         // número de países por página


// ============================================================
// sortCountries(list)
// Objetivo: ordena um array de países com base em activeSort.
// Parâmetros:
//   list — array de objetos de países
// Devolve: novo array ordenado (cópia, não altera o original)
// ============================================================
function sortCountries(list) {
    return [...list].sort((a, b) => {
        switch (activeSort) {
            case "name-asc":         return a.name.localeCompare(b.name);
            case "name-desc":        return b.name.localeCompare(a.name);
            case "population-desc":  return b.population - a.population;
            case "population-asc":   return a.population - b.population;
            case "area-desc":        return b.area - a.area;
            case "area-asc":         return a.area - b.area;
            case "idh-desc":         return b.idh - a.idh;
            case "idh-asc":          return a.idh - b.idh;
            case "continent-asc":    return a.continent.localeCompare(b.continent);
            case "continent-desc":   return b.continent.localeCompare(a.continent);
            default:                 return a.name.localeCompare(b.name);
        }
    });
}


// ============================================================
// setSort(asc, desc)
// Objetivo: alternância de ordenação ao clicar no <th> da tabela.
//           Se clicar no mesmo header duas vezes, inverte a ordem.
// Parâmetros:
//   asc  — valor de ordenação ascendente (ex: "name-asc")
//   desc — valor de ordenação descendente (ex: "name-desc")
// Devolve: nada
// ============================================================
let lastSort = ""; // guarda qual foi a última coluna clicada

function setSort(asc, desc) {
    // se já estava no modo asc desta coluna, troca pra desc (e vice-versa)
    activeSort = lastSort === asc ? desc : asc;
    lastSort = activeSort;
    currentPage = 1; // volta pra primeira página ao mudar ordenação
    buildTable();
}


// ============================================================
// changeSort()
// Objetivo: chamada pelo <select> de ordenação — lê o valor
//           e reconstrói a tabela.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function changeSort() {
    activeSort = document.getElementById("sortSelect").value;
    currentPage = 1;
    buildTable();
}


// ============================================================
// changeContinent()
// Objetivo: chamada pelo <select> de continente — atualiza o
//           filtro ativo e reconstrói a tabela.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function changeContinent() {
    activeContinent = document.getElementById("continentSelect").value;
    currentPage = 1;
    buildTable();
}


// ============================================================
// buildContinentFilter()
// Objetivo: preenche o <select> de continentes com as opções
//           extraídas dinamicamente do array countries.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function buildContinentFilter() {
    const select = document.getElementById("continentSelect");

    // extrai continentes únicos e ordena alfabeticamente
    const continents = [...new Set(countries.map(c => c.continent))].sort();

    continents.forEach(cont => {
        const opt = document.createElement("option"); // cria cada <option>
        opt.value = cont;
        opt.textContent = cont;
        select.appendChild(opt); // adiciona ao <select>
    });
}


// ============================================================
// buildTable()
// Objetivo: principal função desta página — aplica filtro,
//           ordenação e paginação, e depois constrói as linhas
//           <tr> da tabela com os dados de cada país.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function buildTable() {
    // pega no <tbody> e limpa as linhas anteriores
    const body = document.getElementById("countriesBody");
    body.innerHTML = "";

    // --- FILTRO DE CONTINENTE ---
    const filtered = activeContinent === "All"
        ? countries
        : countries.filter(c =>
            c.continent === activeContinent ||
            (c.transcontinental && c.continents.includes(activeContinent))
        );

    // --- ORDENAÇÃO ---
    const sorted = sortCountries(filtered);

    // --- PAGINAÇÃO ---
    // calcula quantas páginas há no total
    const totalPages = Math.ceil(sorted.length / PER_PAGE);
    // índice do primeiro e último país desta página
    const start = (currentPage - 1) * PER_PAGE;
    const end   = Math.min(start + PER_PAGE, sorted.length);
    // fatia do array que corresponde à página atual
    const slice = sorted.slice(start, end);

    // --- CONSTRUÇÃO DAS LINHAS DA TABELA ---
    // <table> é usada aqui porque os dados são tabulares (linhas e colunas)
    slice.forEach(country => {
        const tr = document.createElement("tr"); // <tr> — linha da tabela
        tr.style.cursor = "pointer";

        // ao clicar na linha navega pra a página do país
        tr.onclick = () => {
            window.location.href = `country.html?iso=${country.iso}`;
        };

        // função local que devolve uma cor baseada no valor do IDH
        // verde = alto, amarelo = médio, laranja = baixo, vermelho = muito baixo
        function idhColor(v) {
            if (v >= 0.8)  return "#006400"; // verde escuro
            if (v >= 0.7)  return "#8B8000"; // amarelo escuro
            if (v >= 0.55) return "#8B4500"; // laranja escuro
            return "#8B0000";                // vermelho escuro
        }

        // HTML de cada linha: 7 células <td>
        // <img> — bandeira do país como imagem SVG local
        // <td>  — célula de dados da tabela
        tr.innerHTML = `
            <td>
                <img
                    src="../flags/${country.iso}.svg"
                    alt="${country.name} flag"
                >
            </td>
            <td><strong>${country.name}</strong></td>
            <td>${country.capital.name}</td>
            <td>${country.population.toLocaleString()}</td>
            <td>${country.area.toLocaleString()} km²</td>
            <td style="color:${idhColor(country.idh)};font-weight:bold;">
                ${country.idh}
            </td>
            <td>${country.transcontinental ? country.continents.join(" / ") : country.continent}</td>
        `;

        body.appendChild(tr); // adiciona a linha ao <tbody>
    });

    // --- ATUALIZA CONTADORES ---
    document.getElementById("resultCount").textContent = `${filtered.length} countries`;
    document.getElementById("statusText").textContent  =
        `Showing ${start + 1}–${end} of ${filtered.length} countries`;

    // --- CONSTRÓI A PAGINAÇÃO ---
    buildPagination(totalPages);
}


// ============================================================
// buildPagination(totalPages)
// Objetivo: cria os botões de navegação entre páginas
//           (Prev, números, Next) na div #pagination.
// Parâmetros:
//   totalPages — número total de páginas calculado em buildTable()
// Devolve: nada
// ============================================================
function buildPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // limpa botões anteriores

    // se só houver uma página não precisa de paginação
    if (totalPages <= 1) return;

    // --- BOTÃO ANTERIOR ---
    const prev = document.createElement("button");
    prev.className = "page-btn";
    prev.textContent = "← Prev";
    prev.disabled = currentPage === 1; // desativa na primeira página
    prev.onclick = () => { currentPage--; buildTable(); };
    pagination.appendChild(prev);

    // --- BOTÕES DE NÚMERO DE PÁGINA ---
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        // marca o botão da página atual como "active"
        btn.className = "page-btn" + (i === currentPage ? " active" : "");
        btn.textContent = i;
        const page = i;
        btn.onclick = () => { currentPage = page; buildTable(); };
        pagination.appendChild(btn);
    }

    // --- BOTÃO PRÓXIMO ---
    const next = document.createElement("button");
    next.className = "page-btn";
    next.textContent = "Next →";
    next.disabled = currentPage === totalPages; // desativa na última página
    next.onclick = () => { currentPage++; buildTable(); };
    pagination.appendChild(next);
}


// ============================================================
// search()
// Objetivo: filtra a tabela pelo texto digitado na navbar.
//           Procura por nome, capital e gentílico.
//           Se encontrar só um país, redireciona automaticamente.
// Parâmetros: nenhum (lê o #searchInput)
// Devolve: nada
// ============================================================
function search() {
    const term = document.getElementById("searchInput").value.toLowerCase().trim();

    // campo vazio → volta à tabela normal
    if (!term) {
        buildTable();
        return;
    }

    // filtra o array pelo termo de pesquisa
    const results = countries.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.capital.name.toLowerCase().includes(term) ||
        c.demonym.toLowerCase().includes(term)
    );

    // um único resultado → vai direto pra aquela página
    if (results.length === 1) {
        window.location.href = `country.html?iso=${results[0].iso}`;
        return;
    }

    // vários resultados → mostra-os na tabela sem paginação
    const body = document.getElementById("countriesBody");
    body.innerHTML = "";

    results.forEach(country => {
        const tr = document.createElement("tr"); // <tr> — linha da tabela
        tr.onclick = () => { window.location.href = `country.html?iso=${country.iso}`; };
        tr.innerHTML = `
            <td><img src="../flags/${country.iso}.svg" alt="${country.name}"></td>
            <td><strong>${country.name}</strong></td>
            <td>${country.capital.name}</td>
            <td>${country.population.toLocaleString()}</td>
            <td>${country.area.toLocaleString()} km²</td>
            <td>${country.idh}</td>
            <td>${country.transcontinental ? country.continents.join(" / ") : country.continent}</td>
        `;
        body.appendChild(tr);
    });

    document.getElementById("statusText").textContent =
        `${results.length} result${results.length !== 1 ? "s" : ""} for "${term}"`;

    // esconde a paginação durante a pesquisa
    document.getElementById("pagination").innerHTML = "";
}


// ============================================================
// randomCountry()
// Objetivo: redireciona pra um país aleatório do array.
// Parâmetros: nenhum
// Devolve: nada
// ============================================================
function randomCountry() {
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `country.html?iso=${random.iso}`;
}


// ============================================================
// Inicialização — DOMContentLoaded
// Aguarda o DOM estar pronto antes de executar qualquer coisa.
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    buildContinentFilter(); // preenche o <select> de continentes
    buildTable();           // constrói a tabela pela primeira vez

    // pesquisa em tempo real: atualiza a tabela a cada letra digitada
    document.getElementById("searchInput").addEventListener("input", search);
    // pesquisa ao pressionar Enter
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    // hamburger: mostra/esconde o menu em mobile
    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("open");
    });
});
