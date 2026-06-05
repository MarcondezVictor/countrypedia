// ============================================================
// countries.js — lógica da página de listagem completa
// ============================================================

// --- ESTADO ---
let currentPage   = 1;
let activeSort    = "name-asc";
let activeContinent = "All";
const PER_PAGE    = 25; // países por página

// --- ORDENAÇÃO ---
function sortCountries(list) {
    return [...list].sort((a, b) => {
        switch (activeSort) {
            case "name-asc":        return a.name.localeCompare(b.name);
            case "name-desc":       return b.name.localeCompare(a.name);
            case "population-desc": return b.population - a.population;
            case "population-asc":  return a.population - b.population;
            case "area-desc":       return b.area - a.area;
            case "area-asc":        return a.area - b.area;
            case "idh-desc":        return b.idh - a.idh;
            case "idh-asc":         return a.idh - b.idh;
            case "continent-asc":   return a.continent.localeCompare(b.continent);
            case "continent-desc":  return b.continent.localeCompare(a.continent);
            default:                return a.name.localeCompare(b.name);
        }
    });
}

// alterna entre asc e desc ao clicar no header da tabela
let lastSort = "";
function setSort(asc, desc) {
    activeSort = lastSort === asc ? desc : asc;
    lastSort = activeSort;
    currentPage = 1;
    buildTable();
}

function changeSort() {
    activeSort = document.getElementById("sortSelect").value;
    currentPage = 1;
    buildTable();
}

function changeContinent() {
    activeContinent = document.getElementById("continentSelect").value;
    currentPage = 1;
    buildTable();
}

// --- POPULAR FILTRO DE CONTINENTE ---
function buildContinentFilter() {
    const select = document.getElementById("continentSelect");
    const continents = [...new Set(countries.map(c => c.continent))].sort();
    continents.forEach(cont => {
        const opt = document.createElement("option");
        opt.value = cont;
        opt.textContent = cont;
        select.appendChild(opt);
    });
}

// --- CONSTRUIR TABELA ---
function buildTable() {
    const body = document.getElementById("countriesBody");
    body.innerHTML = "";

    // filtrar por continente
    const filtered = activeContinent === "All"
        ? countries
        : countries.filter(c => 
            c.continent === activeContinent ||
            (c.transcontinental && c.continents.includes(activeContinent))
        );

    // ordenar
    const sorted = sortCountries(filtered);

    // paginação
    const totalPages = Math.ceil(sorted.length / PER_PAGE);
    const start      = (currentPage - 1) * PER_PAGE;
    const end        = Math.min(start + PER_PAGE, sorted.length);
    const slice      = sorted.slice(start, end);

    // construir linhas da tabela
    slice.forEach(country => {
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.onclick = () => {
            window.location.href = `country.html?iso=${country.iso}`;
        };

        // cor do IDH
        function idhColor(v) {
            if (v >= 0.8)  return "#006400";
            if (v >= 0.7)  return "#8B8000";
            if (v >= 0.55) return "#8B4500";
            return "#8B0000";
        }

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

        body.appendChild(tr);
    });

    // atualizar contagem
    document.getElementById("resultCount").textContent =
        `${filtered.length} countries`;
    document.getElementById("statusText").textContent =
        `Showing ${start + 1}–${end} of ${filtered.length} countries`;

    // construir paginação
    buildPagination(totalPages);
}

// --- PAGINAÇÃO ---
function buildPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    // botão anterior
    const prev = document.createElement("button");
    prev.className = "page-btn";
    prev.textContent = "← Prev";
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; buildTable(); };
    pagination.appendChild(prev);

    // botões de página
    // mostra no máximo 7 páginas
    let startPage = 1;
    let endPage   = totalPages;

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.className = "page-btn" + (i === currentPage ? " active" : "");
        btn.textContent = i;
        const page = i;
        btn.onclick = () => { currentPage = page; buildTable(); };
        pagination.appendChild(btn);
    }

    // botão seguinte
    const next = document.createElement("button");
    next.className = "page-btn";
    next.textContent = "Next →";
    next.disabled = currentPage === totalPages;
    next.onclick = () => { currentPage++; buildTable(); };
    pagination.appendChild(next);
}

// --- PESQUISA ---
function search() {
    const term = document.getElementById("searchInput").value.toLowerCase().trim();
    if (!term) {
        buildTable();
        return;
    }

    const results = countries.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.capital.name.toLowerCase().includes(term) ||
        c.demonym.toLowerCase().includes(term)
    );

    if (results.length === 1) {
        window.location.href = `country.html?iso=${results[0].iso}`;
        return;
    }

    const body = document.getElementById("countriesBody");
    body.innerHTML = "";

    results.forEach(country => {
        const tr = document.createElement("tr");
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
    document.getElementById("pagination").innerHTML = "";
}

// --- RANDOM ---
function randomCountry() {
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `country.html?iso=${random.iso}`;
}

// --- ARRANQUE ---
document.addEventListener("DOMContentLoaded", () => {
    buildContinentFilter();
    buildTable();

    document.getElementById("searchInput").addEventListener("input", search);
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    // --- HAMBURGER ---
    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("open");
    });
});
