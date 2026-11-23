import * as duckdb from "@duckdb/duckdb-wasm";

import perspective from "@perspective-dev/client";
import perspectiveViewer from "@perspective-dev/viewer";

import "@perspective-dev/viewer-datagrid";
import "@perspective-dev/viewer/dist/css/themes.css";
import "@perspective-dev/viewer/dist/css/pro.css";

import SERVER_WASM from
  "@perspective-dev/server/dist/wasm/perspective-server.wasm?url";

import CLIENT_WASM from
  "@perspective-dev/viewer/dist/wasm/perspective-viewer.wasm?url";

import {
  DuckDBHandler,
} from "@perspective-dev/client/dist/esm/virtual_servers/duckdb.js";

import "./perspective.css";


export async function renderPerspective(container) {

  try {

    // ==================================================
    // 1. PERSPECTIVE WASM
    // ==================================================

    await Promise.all([

      perspective.init_server(
        fetch(SERVER_WASM)
      ),

      perspectiveViewer.init_client(
        fetch(CLIENT_WASM)
      ),

    ]);


    console.log(
      "Perspective WASM hazır."
    );


    // ==================================================
    // 2. HTML
    // ==================================================

    container.innerHTML = `
      <main class="container">

        <header class="dashboard-header">

          <div class="header-text">

            <div class="dashboard-kicker">
              SALES INTELLIGENCE
            </div>

            <h1>
              Bike Sales Analytics
            </h1>

            <p>
              Explore and analyze 100,000 bike sales records
              directly in your browser.
            </p>

          </div>

          <div class="engine-badge">
            Perspective + DuckDB-WASM
          </div>

        </header>


        <!-- =========================================
             QUICK ANALYSIS
        ========================================== -->

        <section class="quick-analysis">

          <div class="quick-analysis-header">

            <div>

              <div class="quick-title">
                Quick Analysis
              </div>

              <div class="quick-description">
                Switch between raw data and
                the common pivot view
              </div>

            </div>

            <div class="dataset-chip">
              bike_sales.csv
            </div>

          </div>


          <div class="analysis-buttons">

            <button
              class="analysis-btn"
              id="btn-reset"
            >
              All Data
            </button>

            <button
              class="analysis-btn active"
              id="btn-common-pivot"
            >
              Common Pivot
            </button>

          </div>

        </section>


        <!-- =========================================
             PERSPECTIVE VIEWER
        ========================================== -->

        <section class="viewer-card">

          <div class="viewer-header">

            <div>

              <h2 class="viewer-title">
                Interactive Pivot Analysis
              </h2>

              <div
                class="viewer-description"
                id="viewer-description"
              >
                Bike Model × Store Location
                → AVG(Price)
              </div>

            </div>


            <div class="viewer-header-actions">

              <button
                class="configure-btn"
                id="btn-configure"
              >
                Configure View
              </button>


              <div class="live-badge">

                <span class="live-dot"></span>

                100K rows loaded

              </div>

            </div>

          </div>


          <perspective-viewer
            id="viewer"
            theme="Pro Light"
          >
          </perspective-viewer>

        </section>

      </main>
    `;


    // ==================================================
    // 3. DUCKDB-WASM
    // ==================================================

    const bundles =
      duckdb.getJsDelivrBundles();


    const bundle =
      await duckdb.selectBundle(
        bundles
      );


    const workerUrl =
      URL.createObjectURL(

        new Blob(

          [
            `importScripts("${bundle.mainWorker}");`
          ],

          {
            type:
              "text/javascript"
          }

        )

      );


    const worker =
      new Worker(
        workerUrl
      );


    const logger =
      new duckdb.ConsoleLogger();


    const db =
      new duckdb.AsyncDuckDB(
        logger,
        worker
      );


    await db.instantiate(
      bundle.mainModule,
      bundle.pthreadWorker
    );


    URL.revokeObjectURL(
      workerUrl
    );


    console.log(
      "DuckDB-WASM hazır."
    );


    // ==================================================
    // 4. CONNECTION
    // ==================================================

    const connection =
      await db.connect();


    await connection.query(`
      SET default_null_order =
      NULLS_FIRST_ON_ASC_LAST_ON_DESC;
    `);


    // ==================================================
    // 5. CSV LOAD
    // ==================================================

    const response =
      await fetch(
        "/data/bike_sales.csv"
      );


    if (!response.ok) {

      throw new Error(
        "bike_sales.csv bulunamadı."
      );

    }


    const csvText =
      await response.text();


    await db.registerFileText(
      "bike_sales.csv",
      csvText
    );


    // ==================================================
    // 6. DUCKDB TABLE
    // ==================================================

    await connection.query(`
      CREATE TABLE bike_sales AS

      SELECT

        CAST(
          Sale_ID AS INTEGER
        ) AS Sale_ID,

        Date,

        CAST(
          Customer_ID AS INTEGER
        ) AS Customer_ID,

        Bike_Model,

        CAST(
          Price AS DOUBLE
        ) AS Price,

        CAST(
          Quantity AS INTEGER
        ) AS Quantity,

        Store_Location,

        CAST(
          Salesperson_ID AS INTEGER
        ) AS Salesperson_ID,

        Payment_Method,

        CAST(
          Customer_Age AS INTEGER
        ) AS Customer_Age,

        Customer_Gender,

        CAST(
          Price * Quantity
          AS DOUBLE
        ) AS Total_Sales

      FROM read_csv_auto(
        'bike_sales.csv'
      );
    `);


    console.log(
      "bike_sales tablosu oluşturuldu."
    );


    // ==================================================
    // 7. DUCKDB -> PERSPECTIVE
    // ==================================================

    const handler =
      new DuckDBHandler(
        connection
      );


    const messageHandler =
      perspective
        .createMessageHandler(
          handler
        );


    const client =
      await perspective.worker(
        messageHandler
      );


    console.log(
      "Perspective virtual server hazır."
    );


    // ==================================================
    // 8. VIEWER
    // ==================================================

    const viewer =
      container.querySelector(
        "#viewer"
      );


    await viewer.load(
      client
    );


    const tableName =
      "memory.bike_sales";


    // ==================================================
    // 9. ALL COLUMNS
    // ==================================================

    const allColumns = [

      "Sale_ID",
      "Date",
      "Customer_ID",
      "Bike_Model",
      "Price",
      "Quantity",
      "Store_Location",
      "Salesperson_ID",
      "Payment_Method",
      "Customer_Age",
      "Customer_Gender",
      "Total_Sales",

    ];


    // ==================================================
    // 10. DATAGRID COLUMN STYLES
    // ==================================================

    const baseFormat = {

      Sale_ID: {

        fixed:
          0,

        number_fg_mode:
          "color",

        pos_fg_color:
          "#715e67",

        neg_fg_color:
          "#715e67",

      },


      Customer_ID: {

        fixed:
          0,

        number_fg_mode:
          "color",

        pos_fg_color:
          "#715e67",

        neg_fg_color:
          "#715e67",

      },


      Salesperson_ID: {

        fixed:
          0,

        number_fg_mode:
          "color",

        pos_fg_color:
          "#715e67",

        neg_fg_color:
          "#715e67",

      },


      Customer_Age: {

        fixed:
          0,

        number_fg_mode:
          "color",

        pos_fg_color:
          "#715e67",

        neg_fg_color:
          "#715e67",

      },


      Quantity: {

        fixed:
          0,

        number_fg_mode:
          "color",

        pos_fg_color:
          "#2563eb",

        neg_fg_color:
          "#2563eb",

        number_bg_mode:
          "gradient",

        pos_bg_color:
          "#93c5fd",

        neg_bg_color:
          "#93c5fd",

        gradient:
          5,

      },


      Price: {

        fixed:
          2,

        number_fg_mode:
          "color",

        pos_fg_color:
          "#67545d",

        neg_fg_color:
          "#67545d",

      },


      Total_Sales: {

        fixed:
          2,

        number_fg_mode:
          "color",

        pos_fg_color:
          "#047857",

        neg_fg_color:
          "#047857",

        number_bg_mode:
          "gradient",

        pos_bg_color:
          "#6ee7b7",

        neg_bg_color:
          "#6ee7b7",

        gradient:
          15000,

      },

    };


    // ==================================================
    // 11. PLUGIN CONFIG
    // ==================================================

    function getPluginConfig() {

      return {

        columns:
          baseFormat,

      };

    }


    // ==================================================
    // 12. COMMON PIVOT
    //
    // ROWS:
    // Bike_Model
    //
    // COLUMNS:
    // Store_Location
    //
    // VALUE:
    // AVG(Price)
    // ==================================================

    function getCommonPivotConfig() {

      return {

        table:
          tableName,

        plugin:
          "Datagrid",

        group_by: [
          "Bike_Model"
        ],

        split_by: [
          "Store_Location"
        ],

        columns: [
          "Price"
        ],

        aggregates: {

          Price:
            "avg",

        },

        plugin_config:
          getPluginConfig(),

      };

    }


    // ==================================================
    // 13. DEFAULT VIEW = COMMON PIVOT
    // ==================================================

    await viewer.restore(
      getCommonPivotConfig()
    );


    console.log(
      "Perspective Common Pivot hazır."
    );


    // ==================================================
    // 14. BUTTONS
    // ==================================================

    const allDataButton =
      container.querySelector(
        "#btn-reset"
      );


    const commonPivotButton =
      container.querySelector(
        "#btn-common-pivot"
      );


    const viewerDescription =
      container.querySelector(
        "#viewer-description"
      );


    const buttons =
      container.querySelectorAll(
        ".analysis-btn"
      );


    // ==================================================
    // 15. ACTIVE BUTTON
    // ==================================================

    function setActiveButton(
      activeButton
    ) {

      buttons.forEach(
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
    // 16. ALL DATA
    // ==================================================

    allDataButton.addEventListener(
      "click",
      async (event) => {

        setActiveButton(
          event.currentTarget
        );


        viewerDescription.textContent =
          "Raw Bike Sales Dataset";


        await viewer.restore({

          table:
            tableName,

          plugin:
            "Datagrid",

          columns:
            allColumns,

          group_by:
            [],

          split_by:
            [],

          plugin_config:
            getPluginConfig(),

        });

      }
    );


    // ==================================================
    // 17. COMMON PIVOT
    // ==================================================

    commonPivotButton.addEventListener(
      "click",
      async (event) => {

        setActiveButton(
          event.currentTarget
        );


        viewerDescription.textContent =
          "Bike Model × Store Location → AVG(Price)";


        await viewer.restore(
          getCommonPivotConfig()
        );

      }
    );


    // ==================================================
    // 18. CONFIGURE VIEW
    // ==================================================

    container
      .querySelector(
        "#btn-configure"
      )
      .addEventListener(
        "click",
        async () => {

          await viewer.toggleConfig();

        }
      );


  }
  catch (error) {

    console.error(
      "Perspective hatası:",
      error
    );


    container.innerHTML += `
      <div class="error-message">

        <strong>
          Hata:
        </strong>

        ${error.message}

      </div>
    `;

  }

}