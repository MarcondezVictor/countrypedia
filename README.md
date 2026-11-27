# Countrypedia

### The country encyclopedia — every nation, one click away.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

🔗 **Live site:** [marcondezvictor.github.io/countrypedia](https://marcondezvictor.github.io/countrypedia/)

| Home | Country profile |
|:---:|:---:|
| ![Home — all 197 countries with flags, search and continent tabs](docs/screenshots/home.png) | ![Country profile — Japan](docs/screenshots/country.png) |
| **Continents** | **Compare countries** |
| ![Continents overview with stats per continent](docs/screenshots/continents.png) | ![Comparing Brazil and Moldova](docs/screenshots/compare.png) |

---

## What it does

Countrypedia brings the key facts of **197 countries** into a single, fast, retro-styled site inspired by the Windows 95 look.

- **Countries** — searchable, sortable list with flags for every country
- **Country page** — capital, population, languages, currency, government, GDP per capita, HDI, borders, cuisine, famous places and more
- **Continents** — browse countries continent by continent
- **Rankings** — top countries by population, area, GDP and HDI
- **Compare** — put two countries side by side; the better value is highlighted
- **Random** — jump to a random country and discover something new
- **Responsive** — works on desktop and mobile

## Tech stack

Pure **HTML, CSS and JavaScript** — no frameworks, no build step, no backend.
All country data lives in a single JavaScript dataset, and flags are local SVG files.

## Run locally

```bash
git clone https://github.com/MarcondezVictor/countrypedia.git
cd countrypedia
```

Then open `index.html` in your browser — or serve the folder for cleaner paths:

```bash
npx serve .
```

## Project structure

```
index.html        # Home — country grid with search and sorting
pages/            # countries, country, continents, stats (rankings), compare
js/               # page logic (one file per page)
script.js         # country dataset
style.css         # all styles (Win95-inspired theme)
flags/            # SVG flags by ISO code (e.g. pt.svg)
images/           # logo and continent images
```

## What I learned

- Structuring a multi-page site without a framework, sharing one dataset across pages
- Building dynamic UIs with the DOM API (rendering, filtering, sorting, comparisons)
- Responsive layouts with Flexbox and CSS Grid
- Designing a data model and keeping a large dataset consistent

---

**Victor Hugo Lopes** — [github.com/MarcondezVictor](https://github.com/MarcondezVictor)

_Built as the final project for the Internet Technologies course at Polytechnic University of Tomar._
