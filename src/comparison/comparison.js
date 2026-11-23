function getMetric(library) {
  const value =
    window.__demoMetrics?.[library];

  if (typeof value !== "number") {
    return `
      <span class="metric-not-run">
        Not measured
      </span>
    `;
  }

  return `
    <span class="metric-value">
      ${value.toFixed(0)} ms
    </span>
  `;
}


function statusBadge(text, type = "neutral") {
  return `
    <span class="comparison-status ${type}">
      ${text}
    </span>
  `;
}


export function renderComparison(container) {
  container.innerHTML = `
    <main class="comparison-page">

      <!-- =========================================
           HEADER
      ========================================== -->

      <header class="comparison-header">

        <div>

          <div class="comparison-kicker">
            LIBRARY COMPARISON
          </div>

          <h1>
            Pivot & Data Grid Comparison
          </h1>

          <p>
            Compare four browser-based table and
            analytical solutions using the same
            Bike Sales dataset.
          </p>

        </div>

        <div class="comparison-engine-badge">
          4 Libraries · 1 Dataset
        </div>

      </header>


      <!-- =========================================
           COMPARISON TABLE
      ========================================== -->

      <section class="comparison-card">

        <div class="comparison-card-header">

          <div>

            <h2>
              Comparison Table
            </h2>

            <p>
              Common pivot:
              Bike Model × Store Location
              → AVG(Price)
            </p>

          </div>

        </div>


        <div class="comparison-table-wrap">

          <table class="comparison-table">

            <thead>

              <tr>

                <th>
                  Criteria
                </th>

                <th>
                  Perspective
                </th>

                <th>
                  Regular Table
                </th>

                <th>
                  AG Grid
                </th>

                <th>
                  Huey
                </th>

              </tr>

            </thead>


            <tbody>

              <tr>

                <td>
                  Main Focus
                </td>

                <td>
                  Interactive Pivot
                </td>

                <td>
                  Lightweight Grid
                </td>

                <td>
                  Advanced Data Grid
                </td>

                <td>
                  ROLAP Analysis
                </td>

              </tr>


              <tr>

                <td>
                  Raw Data Table
                </td>

                <td>
                  ${statusBadge(
                    "Yes",
                    "positive"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Excellent",
                    "positive"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Excellent",
                    "positive"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Yes",
                    "positive"
                  )}
                </td>

              </tr>


              <tr>

                <td>
                  Built-in Pivot
                </td>

                <td>
                  ${statusBadge(
                    "Yes",
                    "positive"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "No",
                    "negative"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Yes",
                    "positive"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Yes",
                    "positive"
                  )}
                </td>

              </tr>


              <tr>

                <td>
                  Pivot UI
                </td>

                <td>
                  Drag & Drop
                </td>

                <td>
                  <span class="comparison-dash">
                    —
                  </span>
                </td>

                <td>
                  Columns Tool Panel
                </td>

                <td>
                  Query Builder
                </td>

              </tr>


              <tr>

                <td>
                  Pivot / Group-by Flexibility
                </td>

                <td>
                  ${statusBadge(
                    "High",
                    "high"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Low",
                    "low"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "High",
                    "high"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "High",
                    "high"
                  )}
                </td>

              </tr>


              <tr>

                <td>
                  Filtering
                </td>

                <td>
                  Advanced
                </td>

                <td>
                  Basic / Custom
                </td>

                <td>
                  Advanced
                </td>

                <td>
                  Advanced
                </td>

              </tr>


              <tr>

                <td>
                  Setup Difficulty
                </td>

                <td>
                  ${statusBadge(
                    "Medium",
                    "medium"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Easy",
                    "easy"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Medium",
                    "medium"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    "Medium",
                    "medium"
                  )}
                </td>

              </tr>


              <tr>

                <td>
                  Visual / UX Quality
                </td>

                <td>
                  Clean & Analytical
                </td>

                <td>
                  Simple & Lightweight
                </td>

                <td>
                  Powerful & Feature-rich
                </td>

                <td>
                  Functional & Analytical
                </td>

              </tr>


              <tr>

                <td>
                  DuckDB-WASM Role
                </td>

                <td>
                  Query & Data Engine
                </td>

                <td>
                  Data Integration
                </td>

                <td>
                  Query & Data Engine
                </td>

                <td>
                  Core Engine
                </td>

              </tr>


              <tr>

                <td>
                  Common Pivot
                </td>

                <td>
                  <span class="common-pivot-value">
                    AVG(Price)
                  </span>
                </td>

                <td>
                  <span class="comparison-dash">
                    —
                  </span>
                </td>

                <td>
                  <span class="common-pivot-value">
                    AVG(Price)
                  </span>
                </td>

                <td>
                  <span class="common-pivot-value">
                    AVG(Price)
                  </span>
                </td>

              </tr>


              <tr class="metric-row">

                <td>
                  Demo Load / Render
                </td>

                <td>
                  ${getMetric(
                    "Perspective"
                  )}
                </td>

                <td>
                  ${getMetric(
                    "Regular Table"
                  )}
                </td>

                <td>
                  ${getMetric(
                    "AG Grid"
                  )}
                </td>

                <td>
                  ${getMetric(
                    "Huey"
                  )}
                </td>

              </tr>


              <tr>

                <td>
                  Best Fit
                </td>

                <td>
                  Interactive Analytics
                </td>

                <td>
                  Lightweight Tables
                </td>

                <td>
                  Feature-rich Data Apps
                </td>

                <td>
                  Browser ROLAP
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        <div class="comparison-warning">

          <span class="comparison-warning-icon">
            ◷
          </span>

          <p>
            Load/render values are simple measurements
            from the current browser session and should
            not be treated as a controlled performance
            benchmark.
          </p>

        </div>

      </section>

    </main>
  `;
}