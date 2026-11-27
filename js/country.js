// ============================================================
// country.js — lógica da página de detalhe de um país
//              (pages/country.html)
//
// Como funciona: o URL tem ?iso=xx (ex: ?iso=br para o Brasil).
// O JS lê esse parâmetro, procura o país no array countries[]
// e constrói toda a página dinamicamente com innerHTML.
// ============================================================


// ============================================================
// SEARCH BAR NA NAVBAR
// Nesta página a pesquisa não filtra — redireciona pra a home
// com o termo no URL (?search=...) pra a home fazer o filtro.
// ============================================================

// Enter no input → vai pra home com o termo de pesquisa
document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const term = document.getElementById("searchInput").value.trim();
        if (term) window.location.href = `../index.html?search=${encodeURIComponent(term)}`;
    }
});

// clique no botão Search → mesma coisa
document.querySelector(".navbar-search button").addEventListener("click", () => {
    const term = document.getElementById("searchInput").value.trim();
    if (term) window.location.href = `../index.html?search=${encodeURIComponent(term)}`;
});


// ============================================================
// randomCountry()
// Objetivo: navega pra um país aleatório do array.
// Parâmetros: nenhum
// Devolve: nada (redireciona a página)
// ============================================================
function randomCountry() {
    const random = countries[Math.floor(Math.random() * countries.length)];
    window.location.href = `country.html?iso=${random.iso}`;
}


// ============================================================
// LEITURA DO PARÂMETRO ISO DO URL
// URLSearchParams é uma API nativa do browser pra ler
// os parâmetros depois do "?" no URL.
// Ex: country.html?iso=pt → iso = "pt"
// ============================================================
const params  = new URLSearchParams(window.location.search);
const iso     = params.get("iso"); // lê o valor do parâmetro "iso"

// procura o país no array usando o código ISO como chave
const country = countries.find(c => c.iso === iso);

// se o ISO não existir no array mostra mensagem de erro
if (!country) {
    document.getElementById("windowTitle").textContent = "Country not found";
    document.getElementById("windowContent").innerHTML = `
        <p style="padding: 16px;">
            No country found with code "${iso}".
            <a href="countries.html">Go back to countries list.</a>
        </p>
    `;
// se existir constrói a página completa
} else {
    buildCountryPage();
}


// ============================================================
// buildCountryPage()
// Objetivo: constrói toda a página de detalhe do país —
//           cabeçalho, tabelas, listas, mapa, fronteiras, etc.
//           Usa innerHTML pra injetar o HTML no #windowContent.
// Parâmetros: nenhum (usa a variável country definida acima)
// Devolve: nada
// ============================================================
function buildCountryPage() {
    // atualiza o <title> do browser e a barra de título da janela
    document.title = `${country.name} — Countrypedia`;
    document.getElementById("windowTitle").textContent =
        `${country.name} — Country Profile`;

    // calcula há quantos anos o país é independente
    const yearsIndependent = new Date().getFullYear() - country.independence_year;

    // injeta todo o HTML da página no container #windowContent
    document.getElementById("windowContent").innerHTML = `

        <!-- CABEÇALHO DO PAÍS — Flexbox: bandeira + info lado a lado -->
        <div class="country-header">

            <!-- <img> — bandeira grande do país com caminho relativo -->
            <img
                src="../flags/${country.iso}.svg"
                alt="${country.name} flag"
                class="country-flag-large"
            >

            <!-- info: nome, gentílico e tags -->
            <div class="country-header-info">
                <!-- <h1> — título principal da página -->
                <h1 class="country-name">${country.name}</h1>
                <p class="country-demonym">${country.demonym}</p>

                <!-- TAGS — continente, capital e tipo de governo.
                     Continente é um <span> simples (só texto, sem link). -->
                <div class="country-tags">
                    ${country.transcontinental
                        ? country.continents.map(c => `<span class="tag">${c}</span>`).join("")
                        : `<span class="tag">${country.continent}</span>`
                    }
                    <span class="tag">${country.capital.name}</span>
                    <span class="tag">${country.government}</span>
                </div>
            </div>
        </div>

        <!-- LAYOUT DUAS COLUNAS — Flexbox: coluna esquerda + coluna direita -->
        <div class="country-columns">

            <!-- COLUNA ESQUERDA — listas de pessoas, lugares, culinária, cidades, produtos -->
            <div class="country-col-left">

                <!-- PESSOAS FAMOSAS — <ul> com <li> pra cada nome -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Famous People</span></div>
                    <ul class="country-list">
                        ${country.famous_people.map(p => `<li>${p}</li>`).join("")}
                    </ul>
                </div>

                <!-- LUGARES FAMOSOS — <ul> com <li> pra cada lugar -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Famous Places</span></div>
                    <ul class="country-list">
                        ${country.famous_places.map(p => `<li>${p}</li>`).join("")}
                    </ul>
                </div>

                <!-- CULINÁRIA — <ul> com <li> pra cada prato típico -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Cuisine</span></div>
                    <ul class="country-list">
                        ${country.cuisine.map(c => `<li>${c}</li>`).join("")}
                    </ul>
                </div>

                <!-- CIDADES PRINCIPAIS — <ul> com <li> pra cada cidade -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Main Cities</span></div>
                    <ul class="country-list">
                        ${country.main_cities.map(c => `<li>${c}</li>`).join("")}
                    </ul>
                </div>

                <!-- PRODUTOS PRINCIPAIS — <ul> com <li> pra cada produto -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Main Products</span></div>
                    <ul class="country-list">
                        ${country.main_products.map(p => `<li>${p}</li>`).join("")}
                    </ul>
                </div>

            </div>

            <!-- COLUNA DIREITA — mapa, dados gerais, idiomas, religiões, fronteiras, subdivisões -->
            <div class="country-col-right">

                <!-- DADOS GERAIS — <table> com duas colunas: label | valor
                     <table> é adequada aqui porque são pares chave-valor -->
                <div class="country-section">
                    <div class="window-titlebar"><span>General Data</span></div>
                    <table class="country-table">
                        <!-- <tr> linha, <td> célula de dados -->
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
                        <tr><td>Continent</td><td>${country.transcontinental ? country.continents.join(" / ") : country.continent}</td></tr>
                    </table>
                </div>

                <!-- IDIOMAS — <ul> com <li> pra cada língua oficial -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Languages</span></div>
                    <ul class="country-list">
                        ${country.languages.map(l => `<li>${l}</li>`).join("")}
                    </ul>
                </div>

                <!-- RELIGIÕES — <ul> com <li> pra cada religião -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Religions</span></div>
                    <ul class="country-list">
                        ${country.religion.map(r => `<li>${r}</li>`).join("")}
                    </ul>
                </div>

                <!-- FRONTEIRAS — links <a> pra países vizinhos com bandeira.
                     Se o array borders[] estiver vazio é uma ilha (no borders). -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Borders</span></div>
                    <div class="country-borders">
                        ${country.borders.length === 0
                            ? "<p style='padding:8px;font-size:var(--text-sm);'>Island Nation</p>"
                            : country.borders.map(b => {
                                const neighbor = countries.find(c => c.iso === b);
                                // <a> — hiperligação pra a página do país vizinho
                                // <img> — bandeira pequena do vizinho com caminho relativo
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

                <!-- SUBDIVISÕES — <ul> menor pra estados/províncias (pode ser longa) -->
                <div class="country-section">
                    <div class="window-titlebar"><span>Subdivisions</span></div>
                    <ul class="country-list country-list-small">
                        ${country.subdivisions.map(s => `<li>${s}</li>`).join("")}
                    </ul>
                </div>

                <!-- TERRITÓRIOS — só aparece se o país tiver territórios no array -->
                ${country.territories.length > 0 ? `
                    <div class="country-section">
                        <div class="window-titlebar"><span>Territories</span></div>
                        <ul class="country-list">
                            ${country.territories.map(t => `<li>${t}</li>`).join("")}
                        </ul>
                    </div>
                ` : ""}

            </div>
        </div>

        <!-- STATUS BAR — informação resumida do país no rodapé da janela -->
        <div class="statusbar">
            <span class="statusbar-item">${country.name} — ${country.transcontinental ? country.continents.join(" / ") : country.continent}</span>
            <span class="statusbar-item">Population: ${country.population.toLocaleString()}</span>
        </div>
    `;
}


// --- HAMBURGER ---
// alterna o menu mobile ao clicar no botão hamburger
document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
});
