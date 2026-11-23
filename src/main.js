import "./style.css";

const app = document.querySelector("#app");

window.__demoMetrics = window.__demoMetrics || {};

app.innerHTML = `
  <div class="demo-page">

    <nav class="demo-menu">
      <button
        id="perspectiveBtn"
        class="demo-menu-btn"
      >
        Perspective
      </button>

      <button
        id="regularTableBtn"
        class="demo-menu-btn"
      >
        Regular Table
      </button>

      <button
        id="agGridBtn"
        class="demo-menu-btn"
      >
        AG Grid
      </button>

      <button
        id="hueyBtn"
        class="demo-menu-btn"
      >
        Huey
      </button>

      <button
        id="comparisonBtn"
        class="demo-menu-btn"
      >
        Comparison
      </button>
    </nav>

    <div id="demo-container">

      <section class="demo-welcome">

        <div class="welcome-kicker">
          DUCKDB-WASM DEMOS
        </div>

        <h1>
          Pivot Table Comparison
        </h1>

        <p class="welcome-description">
          Compare pivot and grid libraries using
          the same bike sales dataset in the browser.
        </p>

        <div class="welcome-cards">

          <button
            class="welcome-card"
            id="welcome-perspective"
          >
            <div class="welcome-card-icon">
              ◫
            </div>

            <div class="welcome-card-title">
              Perspective
            </div>

            <div class="welcome-card-description">
              Interactive native pivot analysis
              with grouping and split views.
            </div>
          </button>

          <button
            class="welcome-card"
            id="welcome-regular"
          >
            <div class="welcome-card-icon">
              ▦
            </div>

            <div class="welcome-card-title">
              Regular Table
            </div>

            <div class="welcome-card-description">
              Lightweight and high-performance
              virtualized data grid.
            </div>
          </button>

          <button
            class="welcome-card"
            id="welcome-aggrid"
          >
            <div class="welcome-card-icon">
              ▤
            </div>

            <div class="welcome-card-title">
              AG Grid
            </div>

            <div class="welcome-card-description">
              Advanced data grid with interactive
              filtering and pivot support.
            </div>
          </button>

          <button
            class="welcome-card"
            id="welcome-huey"
          >
            <div class="welcome-card-icon">
              ◈
            </div>

            <div class="welcome-card-title">
              Huey
            </div>

            <div class="welcome-card-description">
              DuckDB-WASM powered ROLAP
              and multidimensional pivot analysis.
            </div>
          </button>

        </div>

        <div class="welcome-comparison">

          <div>
            <span class="comparison-kicker">
              LIBRARY COMPARISON
            </span>

            <h2>
              Which solution fits which use case?
            </h2>

            <p>
              Compare pivot support, filtering,
              customization and browser-side
              analytical capabilities.
            </p>
          </div>

          <button
            id="welcome-comparison"
            class="comparison-open-btn"
          >
            View Comparison →
          </button>

        </div>

      </section>

    </div>

  </div>
`;

const demoContainer =
  document.querySelector(
    "#demo-container"
  );

const menuButtons =
  document.querySelectorAll(
    ".demo-menu-btn"
  );


// ==================================================
// ACTIVE MENU BUTTON
// ==================================================

function setActiveButton(
  activeButton
) {

  menuButtons.forEach(
    (button) => {

      button.classList.remove(
        "active"
      );

    }
  );

  activeButton.classList.add(
    "active"
  );

}


// ==================================================
// SCROLL TO TOP
// ==================================================

function scrollToTop() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ==================================================
// METRICS
// ==================================================

function saveMetric(
  name,
  startTime
) {

  const duration =
    performance.now() -
    startTime;

  window.__demoMetrics[name] =
    duration;

}


// ==================================================
// LOADING
// ==================================================

function showLoading(
  name
) {

  demoContainer.innerHTML = `
    <div class="demo-loading">
      ${name} loading...
    </div>
  `;

}


// ==================================================
// ERROR
// ==================================================

function showError(
  name,
  error
) {

  demoContainer.innerHTML = `
    <div class="demo-error">

      <strong>
        ${name} could not be loaded.
      </strong>

      <span>
        ${error.message}
      </span>

    </div>
  `;

}


// ==================================================
// PERSPECTIVE
// ==================================================

async function loadPerspective(
  event
) {

  setActiveButton(
    event.currentTarget
  );

  scrollToTop();

  showLoading(
    "Perspective"
  );

  const startTime =
    performance.now();

  try {

    const {
      renderPerspective
    } = await import(
      "./perspective/perspective.js"
    );

    await renderPerspective(
      demoContainer
    );

    saveMetric(
      "Perspective",
      startTime
    );

  }
  catch (error) {

    console.error(
      "Perspective yükleme hatası:",
      error
    );

    showError(
      "Perspective",
      error
    );

  }

}


// ==================================================
// REGULAR TABLE
// ==================================================

async function loadRegularTable(
  event
) {

  setActiveButton(
    event.currentTarget
  );

  scrollToTop();

  showLoading(
    "Regular Table"
  );

  const startTime =
    performance.now();

  try {

    const {
      createRegularTable
    } = await import(
      "./regular-table/regularTable.js"
    );

    const regularTable =
      await createRegularTable();

    demoContainer.replaceChildren(
      regularTable
    );

    if (
      typeof regularTable.draw ===
      "function"
    ) {

      await regularTable.draw();

    }

    saveMetric(
      "Regular Table",
      startTime
    );

  }
  catch (error) {

    console.error(
      "Regular Table yükleme hatası:",
      error
    );

    showError(
      "Regular Table",
      error
    );

  }

}


// ==================================================
// AG GRID
// ==================================================

async function loadAgGrid(
  event
) {

  setActiveButton(
    event.currentTarget
  );

  scrollToTop();

  showLoading(
    "AG Grid"
  );

  const startTime =
    performance.now();

  try {

    const {
      createAgGrid
    } = await import(
      "./ag-grid/agGrid.js"
    );

    const grid =
      await createAgGrid();

    demoContainer.replaceChildren(
      grid
    );

    saveMetric(
      "AG Grid",
      startTime
    );

  }
  catch (error) {

    console.error(
      "AG Grid yükleme hatası:",
      error
    );

    showError(
      "AG Grid",
      error
    );

  }

}


// ==================================================
// HUEY
// ==================================================

async function loadHuey(
  event
) {

  setActiveButton(
    event.currentTarget
  );

  scrollToTop();

  showLoading(
    "Huey"
  );

  const startTime =
    performance.now();

  try {

    const {
      renderHuey
    } = await import(
      "../public/huey/huey.js"
    );

    await renderHuey(
      demoContainer
    );

    saveMetric(
      "Huey",
      startTime
    );

  }
  catch (error) {

    console.error(
      "Huey yükleme hatası:",
      error
    );

    showError(
      "Huey",
      error
    );

  }

}


// ==================================================
// COMPARISON
// ==================================================

async function loadComparison(
  event
) {

  setActiveButton(
    event.currentTarget
  );

  scrollToTop();

  showLoading(
    "Comparison"
  );

  try {

    const {
      renderComparison
    } = await import(
      "./comparison/comparison.js"
    );

    renderComparison(
      demoContainer
    );

  }
  catch (error) {

    console.error(
      "Comparison yükleme hatası:",
      error
    );

    showError(
      "Comparison",
      error
    );

  }

}


// ==================================================
// TOP MENU EVENTS
// ==================================================

document
  .querySelector(
    "#perspectiveBtn"
  )
  .addEventListener(
    "click",
    loadPerspective
  );


document
  .querySelector(
    "#regularTableBtn"
  )
  .addEventListener(
    "click",
    loadRegularTable
  );


document
  .querySelector(
    "#agGridBtn"
  )
  .addEventListener(
    "click",
    loadAgGrid
  );


document
  .querySelector(
    "#hueyBtn"
  )
  .addEventListener(
    "click",
    loadHuey
  );


document
  .querySelector(
    "#comparisonBtn"
  )
  .addEventListener(
    "click",
    loadComparison
  );


// ==================================================
// WELCOME CARD EVENTS
// ==================================================

document
  .querySelector(
    "#welcome-perspective"
  )
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(
          "#perspectiveBtn"
        )
        .click();

    }
  );


document
  .querySelector(
    "#welcome-regular"
  )
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(
          "#regularTableBtn"
        )
        .click();

    }
  );


document
  .querySelector(
    "#welcome-aggrid"
  )
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(
          "#agGridBtn"
        )
        .click();

    }
  );


document
  .querySelector(
    "#welcome-huey"
  )
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(
          "#hueyBtn"
        )
        .click();

    }
  );


document
  .querySelector(
    "#welcome-comparison"
  )
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(
          "#comparisonBtn"
        )
        .click();

    }
  );