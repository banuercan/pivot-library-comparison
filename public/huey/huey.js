const HUEY_PATH =
  "/huey/src/index.html";

function injectHueyTheme(
  iframe
) {
  try {
    const doc =
      iframe.contentDocument;

    if (!doc) {
      return;
    }

    if (
      doc.querySelector(
        "#bike-sales-huey-theme"
      )
    ) {
      return;
    }

    const style =
      doc.createElement(
        "style"
      );

    style.id =
      "bike-sales-huey-theme";

    style.textContent = `
      html,
      body {
        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif !important;
      }

      body {
        background:
          #fffafb !important;
      }

      button,
      select,
      input,
      textarea {
        border-radius:
          8px !important;
      }

      dialog {
        border-radius:
          16px !important;

        border:
          1px solid
          rgba(172, 76, 101, 0.16) !important;

        box-shadow:
          0 20px 50px
          rgba(86, 40, 54, 0.16) !important;
      }

      header,
      nav,
      [role="toolbar"] {
        background-color:
          #fff7f9;
      }

      ::selection {
        background:
          #f5cbd6;
        color:
          #5f2635;
      }
    `;

    doc.head.appendChild(
      style
    );
  }
  catch (error) {
    console.warn(
      "Huey theme could not be injected:",
      error
    );
  }
}

export async function renderHuey(
  container
) {
  container.innerHTML = `
    <main class="container huey-page">

      <header class="dashboard-header">

        <div class="header-text">

          <div class="dashboard-kicker">
            HUEY / ROLAP ANALYSIS
          </div>

          <h1>
            Bike Sales Analysis
          </h1>

          <p>
            Explore the Bike Sales dataset using
            Huey's DuckDB-WASM powered
            multidimensional analysis interface.
          </p>

        </div>

        <div class="engine-badge">
          Huey + DuckDB-WASM
        </div>

      </header>


      <section class="analysis-scenario">

        <div class="analysis-scenario-title">
          Common Analysis Scenario
        </div>

        <div class="analysis-scenario-flow">

          <div class="scenario-item">
            <span>
              Rows
            </span>
            <strong>
              Bike_Model
            </strong>
          </div>

          <div class="scenario-arrow">
            ×
          </div>

          <div class="scenario-item">
            <span>
              Columns
            </span>
            <strong>
              Store_Location
            </strong>
          </div>

          <div class="scenario-arrow">
            →
          </div>

          <div class="scenario-item">
            <span>
              Value
            </span>
            <strong>
              AVG(Price)
            </strong>
          </div>

        </div>

      </section>


      <section class="viewer-card">

        <div class="viewer-header">

          <div>

            <h2 class="viewer-title">
              Interactive ROLAP Analysis
            </h2>

            <div class="viewer-description">
              Bike Model × Store Location
              → AVG(Price)
            </div>

          </div>

          <div class="viewer-header-actions">

            <button
              id="openHueyNewTab"
              class="configure-btn"
            >
              Open Full Screen ↗
            </button>

            <div class="live-badge">
              <span class="live-dot"></span>
              <span id="hueyStatus">
                Loading Huey...
              </span>
            </div>

          </div>

        </div>

        <div class="huey-frame-wrap">
          <iframe
            id="hueyFrame"
            class="huey-frame"
            src="${HUEY_PATH}"
            title="Huey Bike Sales Analysis"
          >
          </iframe>
        </div>

      </section>


      <section class="comparison-note-card">

        <strong>
          Note
        </strong>

        <p>
          In Huey, set the common pivot as:
          <strong>Rows = Bike_Model</strong>,
          <strong>Columns = Store_Location</strong>,
          <strong>Cells = average of Price</strong>.
        </p>

      </section>

    </main>
  `;

  const iframe =
    container.querySelector(
      "#hueyFrame"
    );

  const status =
    container.querySelector(
      "#hueyStatus"
    );

  container
    .querySelector(
      "#openHueyNewTab"
    )
    .addEventListener(
      "click",
      () => {
        window.open(
          HUEY_PATH,
          "_blank",
          "noopener,noreferrer"
        );
      }
    );

  iframe.addEventListener(
    "load",
    () => {
      status.textContent =
        "Huey ready";

      injectHueyTheme(
        iframe
      );

      setTimeout(
        () => {
          injectHueyTheme(
            iframe
          );
        },
        1000
      );
    },
    { once: true }
  );
}