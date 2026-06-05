// ============================================================
// app.js — lógica da home
// ============================================================

// --- ESTADO ---
let activeContinent = "All";
let activeSort = "name-asc"; // ordenação padrão

// --- TABS ---
function buildTabs() {
    const tabsContainer = document.getElementById("tabs");

    // extrair continentes unicos do array
    // Set() remove duplicados automaticamente
    const continents = ["All", ...new Set(countries.map(c => c.continent))];

    // pra cada coontinente cria um botao
    continents.forEach(continent => {
        const btn = document.createElement("button");
        btn.className = "tab-btn";
        btn.textContent = continent;

        // a tab All começa atiiva
        if (continent === "All") btn.classList.add("active");

        // ao clicar numa tab
        btn.addEventListener("click", () => {
            // remove ativo das tabs
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            // adiciona ativo a esta
            btn.classList.add("active");
            // atualiza o continennte ativo
            activeContinent = continent;
            // reconstroi a grelha com o filtro
            buildGrid();
        });
        tabsContainer.appendChild(btn);
    });
}

// --- GRELHA ---
function buildGrid() {
    const grid = document.getElementById("countriesGrid");
    grid.innerHTML = "";

    // filtra por continente
    const filtered = activeContinent === "All"
        ? countries
        : countries.filter(c => 
            c.continent === activeContinent ||
            (c.transcontinental && c.continents.includes(activeContinent))
        );

    // ordena o resultado filtrado
    const sorted = sortCountries(filtered);

    // constrói os cards com a lista ordenada
    sorted.forEach(country => {
        const card = document.createElement("a");
        card.className = "country-card";
        card.href = `pages/country.html?iso=${country.iso}`;
        card.innerHTML = `
            <img src="flags/${country.iso}.svg" alt="${country.name} flag">
            <span>${country.name}</span>
        `;
        grid.appendChild(card);
    });

    document.getElementById("statusText").textContent =
        `${sorted.length} countr${sorted.length !== 1 ? "ies" : "y"} found`;
}



// --- ORDENAÇÃO ---
function sortCountries(list) {
    // cria uma cópia do array para não alterar o original
    return [...list].sort((a, b) => {
        switch (activeSort) {
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "population-desc":
                return b.population - a.population;
            case "population-asc":
                return a.population - b.population;
            case "area-desc":
                return b.area - a.area;
            case "area-asc":
                return a.area - b.area;
            case "idh-desc":
                return b.idh - a.idh;
            case "idh-asc":
                return a.idh - b.idh;
            default:
                return a.name.localeCompare(b.name);
        }
    });
}

// quando o select muda
function changeSort() {
    activeSort = document.getElementById("sortSelect").value;
    buildGrid();
}

// --- STATS ---
function buildStats() {
    const continents = new Set(countries.map(c => c.continent));
    document.getElementById("totalCountries").textContent = countries.length;
    document.getElementById("totalContinents").textContent = continents.size;
}

// --- RANDOM ---
function randomCountry() {
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `pages/country.html?iso=${random.iso}`;
}

// --- PESQUISA --- 
function search() {
    const term = document.getElementById("searchInput").value.toLowerCase().trim();

    // se vazio reconstrói a grelha normal
    if (!term) {
        buildGrid();
        return;
    }

    const results = countries.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.capital.name.toLowerCase().includes(term) ||
        c.demonym.toLowerCase().includes(term)
    );

    // só altera a grelha — nunca toca nas tabs
    const grid = document.getElementById("countriesGrid");
    grid.innerHTML = "";

    if (results.length === 0) {
        grid.innerHTML = `
            <p style="padding:16px; font-size:var(--text-sm);">
                No countries found for "${term}".
            </p>
        `;
        document.getElementById("statusText").textContent = `No results found`;
        return;
    }

    // se só um resultado vai direto para a página
    if (results.length === 1) {
        window.location.href = `pages/country.html?iso=${results[0].iso}`;
        return;
    }

    const sorted = sortCountries(results);
    sorted.forEach(country => {
        const card = document.createElement("a");
        card.className = "country-card";
        card.href = `pages/country.html?iso=${country.iso}`;
        card.innerHTML = `
            <img src="flags/${country.iso}.svg" alt="${country.name} flag">
            <span>${country.name}</span>
        `;
        grid.appendChild(card);
    });

    document.getElementById("statusText").textContent =
        `${results.length} result${results.length !== 1 ? "s" : ""} for "${term}"`;
}

// pesquisa em tempo real ao escrever
document.addEventListener("DOMContentLoaded", () => {
    buildStats();
    buildTabs();
    buildGrid();

    // liga o input para pesquisar ao escrever
    document.getElementById("searchInput").addEventListener("input", search);

    // liga o enter ao botão de pesquisa
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    // verifica se veio termo de pesquisa pelo URL
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get("search");
    if(searchTerm) {
        document.getElementById("searchInput").value = searchTerm;
        search()
    }

    // --- HAMBURGER ---
    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("open");
    });
});
