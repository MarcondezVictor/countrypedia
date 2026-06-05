// ============================================================
// country.js — logica da pagina de cada pais
// ============================================================

// --- SEARCH BAR --- //

// pesquisa na navbar redireciona pra home
document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const term = document.getElementById("searchInput").value.trim();
        if (term) window.location.href = `../index.html?search=${encodeURIComponent(term)}`;
    }
});

document.querySelector(".navbar-search button").addEventListener("click", () => {
    const term = document.getElementById("searchInput").value.trim();
    if (term) window.location.href = `../index.html?search=${encodeURIComponent(term)}`;
});


// --- RANDOM ---
function randomCountry() {
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `country.html?iso=${random.iso}`;
}

// --- GERA A PAGINA PELO ISO --- //

// le o parametro ?iso=xx do URL
// URLSearchParams eh uma API nativa do browser para ler parametros
const params = new URLSearchParams(window.location.search);
const iso = params.get("iso");

// procura o país no array pelo iso
const country = countries.find(c => c.iso === iso);

// se o iso não existir no array mostra mensagem de erro
if (!country) {
    document.getElementById("windowTitle").textContent = "Country not found";
    document.getElementById("windowContent").innerHTML = `
        <p style="padding: 16px;">
            No country found with code "${iso}".
            <a href="countries.html">Go back to countries list.</a>
        </p>
    `;
// se existir constroi a pagina
} else {
    buildCountryPage();
}

function buildCountryPage() {
    // atualiza o título da aba do browser
    document.title = `${country.name} — world.com`;

    // atualiza a barra de título da janela Win95
    document.getElementById("windowTitle").textContent = 
        `${country.name} — Country Profile`;

    // calcula anos de independência
    const yearsIndependent = new Date().getFullYear() - country.independence_year;

    // constrói o HTML do conteúdo
    document.getElementById("windowContent").innerHTML = `

        <!-- TOPO — bandeira e info principal -->
        <div class="country-header">
            <img 
                src="../flags/${country.iso}.svg" 
                alt="${country.name} flag"
                class="country-flag-large"
            >
            <div class="country-header-info">
                <h1 class="country-name">${country.name}</h1>
                <p class="country-demonym">${country.demonym}</p>
                <div class="country-tags">
                    <span class="tag">${country.continent}</span>
                    <span class="tag">${country.capital.name}</span>
                    <span class="tag">${country.government}</span>
                </div>
            </div>
        </div>

        <!-- CONTEÚDO EM DUAS COLUNAS -->
        <div class="country-columns">

            <!-- COLUNA ESQUERDA -->
            <div class="country-col-left">

                <!-- Pessoas famosas -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Famous People</span>
                    </div>
                    <ul class="country-list">
                        ${country.famous_people.map(p => `<li>${p}</li>`).join("")}
                    </ul>
                </div>

                <!-- Lugares famosos -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Famous Places</span>
                    </div>
                    <ul class="country-list">
                        ${country.famous_places.map(p => `<li>${p}</li>`).join("")}
                    </ul>
                </div>

                <!-- Culinária -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Cuisine</span>
                    </div>
                    <ul class="country-list">
                        ${country.cuisine.map(c => `<li>${c}</li>`).join("")}
                    </ul>
                </div>

                <!-- Principais cidades -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Main Cities</span>
                    </div>
                    <ul class="country-list">
                        ${country.main_cities.map(c => `<li>${c}</li>`).join("")}
                    </ul>
                </div>

                <!-- Principais produtos -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Main Products</span>
                    </div>
                    <ul class="country-list">
                        ${country.main_products.map(p => `<li>${p}</li>`).join("")}
                    </ul>
                </div>

            </div>

            <!-- COLUNA DIREITA -->
            <div class="country-col-right">

                <!-- Dados gerais -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>General Data</span>
                    </div>
                    <table class="country-table">
                        <tr><td>Capital</td><td>${country.capital.name}</td></tr>
                        <tr><td>Capital population</td><td>${country.capital.population.toLocaleString()}</td></tr>
                        <tr><td>Country population</td><td>${country.population.toLocaleString()}</td></tr>
                        <tr><td>Area</td><td>${country.area.toLocaleString()} km²</td></tr>
                        <tr><td>GDP per capita</td><td>$${country.gdp_per_capita.toLocaleString()}</td></tr>
                        <tr><td>HDI</td><td>${country.idh}</td></tr>
                        <tr><td>Currency</td><td>${country.currency}</td></tr>
                        <tr><td>Anthem</td><td>${country.anthem}</td></tr>
                        <tr><td>Internet code</td><td>${country.internet_code}</td></tr>
                        <tr><td>Phone code</td><td>${country.phone_code}</td></tr>
                        <tr><td>Independence</td><td>${country.independence_year} (${yearsIndependent} years)</td></tr>
                        <tr><td>National animal</td><td>${country.national_animal}</td></tr>
                        <tr><td>Timezones</td><td>${country.timezone.join(", ")}</td></tr>
                    </table>
                </div>

                <!-- Línguas -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Languages</span>
                    </div>
                    <ul class="country-list">
                        ${country.languages.map(l => `<li>${l}</li>`).join("")}
                    </ul>
                </div>

                <!-- Religiões -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Religions</span>
                    </div>
                    <ul class="country-list">
                        ${country.religion.map(r => `<li>${r}</li>`).join("")}
                    </ul>
                </div>

                <!-- Fronteiras -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Borders</span>
                    </div>
                    <div class="country-borders">
                        ${country.borders.length === 0 
                            ? "<p>No land borders</p>"
                            : country.borders.map(b => {
                                const neighbor = countries.find(c => c.iso === b);
                                return neighbor 
                                    ? `<a href="country.html?iso=${b}" class="border-link">
                                            <img src="../flags/${b}.svg" alt="${neighbor.name}">
                                            ${neighbor.name}
                                       </a>`
                                    : "";
                              }).join("")
                        }
                    </div>
                </div>

                <!-- Subdivisões -->
                <div class="country-section">
                    <div class="window-titlebar">
                        <span>Subdivisions</span>
                    </div>
                    <ul class="country-list country-list-small">
                        ${country.subdivisions.map(s => `<li>${s}</li>`).join("")}
                    </ul>
                </div>

            </div>
        </div>

        <div style="padding: 6px 8px; border-top: 1px solid var(--border-dark);">
            <button class="raised" onclick="shareCountry()" 
                style="padding: 3px 12px; font-size: var(--text-sm); background: var(--bg);">
                Share this country
            </button>
            <span id="shareMsg" style="font-size: var(--text-sm); margin-left: 8px; color: var(--text-muted);"></span>
        </div>

        <!-- STATUS BAR -->
        <div class="statusbar">
            <span class="statusbar-item">${country.name} — ${country.continent}</span>
            <span class="statusbar-item">Population: ${country.population.toLocaleString()}</span>
            <span class="statusbar-item">
                ${country.contributions > 0 
                    ? `Community contributions: ${country.contributions}` 
                    : "Be the first to contribute!"}
            </span>
        </div>
    `;
}

function shareCountry() {
    // copia o URL atual para a clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
        // mostra mensagem de confirmação
        const msg = document.getElementById("shareMsg");
        msg.textContent = "Link copied to clipboard!";

        // apaga a mensagem depois de 3 segundos
        setTimeout(() => { msg.textContent = ""; }, 3000);
    }).catch(() => {
        // fallback se a clipboard não funcionar
        const msg = document.getElementById("shareMsg");
        msg.textContent = "Copy this link: " + window.location.href;
    });
}

// --- HAMBURGER ---
document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
});