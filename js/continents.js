// ============================================================
// continents.js — lógica da página de continentes
// ============================================================

// imagens de cada continente
const continentImage = {
    "Africa":        "../images/africa.png",
    "Asia":          "../images/asia.png",
    "Europe":        "../images/europe.png",
    "North America": "../images/north-america.png",
    "South America": "../images/south-america.png",
    "Oceania":       "../images/oceania.png"
};

// --- CONSTRUIR CARDS DE CONTINENTES ---
function buildContinents() {
    const grid = document.getElementById("continentsGrid");
    grid.innerHTML = "";

    // obter continentes únicos
    const continents = [...new Set(countries.map(c => c.continent))].sort();

    continents.forEach(cont => {
        // países deste continente
        const contCountries = countries.filter(c => 
            c.continent === cont ||
            (c.transcontinental && c.continents.includes(cont))
        );

        // calcular stats
        const totalPop     = contCountries.reduce((sum, c) => sum + c.population, 0);
        const totalArea    = contCountries.reduce((sum, c) => sum + c.area, 0);
        const mostPopulous = contCountries.reduce((max, c) => c.population > max.population ? c : max, contCountries[0]);
        const largest      = contCountries.reduce((max, c) => c.area > max.area ? c : max, contCountries[0]);
        const highestIDH   = contCountries.reduce((max, c) => c.idh > max.idh ? c : max, contCountries[0]);

        const card = document.createElement("div");
        card.className = "continent-card raised";
        card.onclick = () => openContinent(cont);

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

// --- ABRIR CONTINENTE ---
    function openContinent(cont) {
        const contCountries = countries
            .filter(c => 
                c.continent === cont ||
                (c.transcontinental && c.continents.includes(cont))
            )
            .sort((a, b) => a.name.localeCompare(b.name));

    const grid = document.getElementById("continentCountriesGrid");
    grid.innerHTML = "";

    contCountries.forEach(country => {
        const card = document.createElement("a");
        card.className = "country-card";
        card.href = `country.html?iso=${country.iso}`;
        card.innerHTML = `
            <img src="../flags/${country.iso}.svg" alt="${country.name} flag">
            <span>${country.name}</span>
        `;
        grid.appendChild(card);
    });

document.getElementById("continentWindowTitle").textContent = cont;
    document.getElementById("continentStatusText").textContent =
        `${contCountries.length} countries`;

    // mostrar janela e fazer scroll
    const win = document.getElementById("continentWindow");
    win.style.display = "block";
    win.scrollIntoView({ behavior: "smooth" });
}

// --- FECHAR JANELA ---
function closeContinentWindow() {
    document.getElementById("continentWindow").style.display = "none";
}

// --- FORMATAR NÚMEROS ---
function formatNum(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
    return n;
}

// --- PESQUISA ---
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
        return;
    }

    if (results.length > 1) {
        window.location.href = `countries.html?search=${encodeURIComponent(term)}`;
    }
}

// --- RANDOM ---
function randomCountry() {
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `country.html?iso=${random.iso}`;
}

// --- ARRANQUE ---
document.addEventListener("DOMContentLoaded", () => {
    buildContinents();

    const params = new URLSearchParams(window.location.search);
    const preselected = params.get("continent");
    if (preselected) openContinent(preselected);

    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("open");
    });
});
