import * as duckdb from "@duckdb/duckdb-wasm";

import {
  createGrid,
  ModuleRegistry
} from "ag-grid-community";

import {
  AllEnterpriseModule
} from "ag-grid-enterprise";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "./agGrid.css";


ModuleRegistry.registerModules([
  AllEnterpriseModule
]);


export async function createAgGrid() {

  const wrapper =
    document.createElement(
      "section"
    );


  wrapper.className =
    "ag-demo";


  // ==================================================
  // HTML
  // ==================================================

  wrapper.innerHTML = `
    <div class="ag-demo-header">

      <div>

        <div class="ag-demo-kicker">
          AG GRID
        </div>

        <h2 class="ag-demo-title">
          Bike Sales Data Grid
        </h2>

        <p class="ag-demo-description">
          Interactive grid and pivot analysis
          using data queried through DuckDB-WASM.
        </p>

      </div>

      <div class="ag-engine-badge">
        AG Grid + DuckDB-WASM
      </div>

    </div>


    <div class="ag-view-switcher">

      <button
        id="ag-raw-btn"
        class="ag-view-btn active"
      >
        Raw Data
      </button>

      <button
        id="ag-pivot-btn"
        class="ag-view-btn"
      >
        Pivot View
      </button>

    </div>


    <div class="ag-toolbar">

      <div class="ag-search-wrapper">

        <span class="ag-search-icon">
          ⌕
        </span>

        <input
          id="ag-search"
          class="ag-search"
          type="text"
          placeholder="Search bike model, location or payment..."
        />

      </div>


      <div
        class="ag-row-count"
        id="ag-row-count"
      >
        Loading...
      </div>

    </div>


    <div
      id="ag-grid-container"
      class="ag-theme-quartz ag-grid-container"
    >
    </div>
  `;


  const gridElement =
    wrapper.querySelector(
      "#ag-grid-container"
    );


  const searchInput =
    wrapper.querySelector(
      "#ag-search"
    );


  const rowCount =
    wrapper.querySelector(
      "#ag-row-count"
    );


  const rawButton =
    wrapper.querySelector(
      "#ag-raw-btn"
    );


  const pivotButton =
    wrapper.querySelector(
      "#ag-pivot-btn"
    );


  // ==================================================
  // DUCKDB-WASM
  // ==================================================

  rowCount.textContent =
    "DuckDB-WASM loading...";


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


  // ==================================================
  // CONNECTION
  // ==================================================

  const connection =
    await db.connect();


  // ==================================================
  // CSV LOAD
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
  // DUCKDB QUERY
  // ==================================================

  const result =
    await connection.query(`
      SELECT

        CAST(
          Sale_ID AS INTEGER
        ) AS Sale_ID,

        CAST(
          Date AS VARCHAR
        ) AS Date,

        CAST(
          Customer_ID AS INTEGER
        ) AS Customer_ID,

        CAST(
          Bike_Model AS VARCHAR
        ) AS Bike_Model,

        CAST(
          Price AS DOUBLE
        ) AS Price,

        CAST(
          Quantity AS INTEGER
        ) AS Quantity,

        CAST(
          Store_Location AS VARCHAR
        ) AS Store_Location,

        CAST(
          Salesperson_ID AS INTEGER
        ) AS Salesperson_ID,

        CAST(
          Payment_Method AS VARCHAR
        ) AS Payment_Method,

        CAST(
          Customer_Age AS INTEGER
        ) AS Customer_Age,

        CAST(
          Customer_Gender AS VARCHAR
        ) AS Customer_Gender,

        CAST(
          Price AS DOUBLE
        )
        *
        CAST(
          Quantity AS INTEGER
        )
        AS Total_Sales

      FROM read_csv_auto(
        'bike_sales.csv'
      );
    `);


  // ==================================================
  // DUCKDB RESULT -> AG GRID
  // ==================================================

  const rowData =
    result
      .toArray()
      .map(
        (row) => ({

          Sale_ID:
            Number(
              row.Sale_ID
            ),

          Date:
            String(
              row.Date ?? ""
            ),

          Customer_ID:
            Number(
              row.Customer_ID
            ),

          Bike_Model:
            String(
              row.Bike_Model ?? ""
            ),

          Price:
            Number(
              row.Price
            ),

          Quantity:
            Number(
              row.Quantity
            ),

          Store_Location:
            String(
              row.Store_Location ?? ""
            ),

          Salesperson_ID:
            Number(
              row.Salesperson_ID
            ),

          Payment_Method:
            String(
              row.Payment_Method ?? ""
            ),

          Customer_Age:
            Number(
              row.Customer_Age
            ),

          Customer_Gender:
            String(
              row.Customer_Gender ?? ""
            ),

          Total_Sales:
            Number(
              row.Total_Sales
            )

        })
      );


  // ==================================================
  // HELPERS
  // ==================================================

  function formatCurrency(
    value
  ) {

    return `$${Number(
      value
    ).toLocaleString(
      "en-US",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2
      }
    )}`;

  }


  function currencyFormatter(
    params
  ) {

    if (
      params.value == null
    ) {

      return "";

    }


    return formatCurrency(
      params.value
    );

  }


  const maxTotalSales =
    Math.max(
      ...rowData.map(
        (row) =>
          row.Total_Sales
      )
    );


  // ==================================================
  // COLUMN DEFINITIONS
  // ==================================================

  const columnDefs = [

    {
      field:
        "Sale_ID",

      headerName:
        "Sale ID",

      type:
        "numericColumn",

      filter:
        "agNumberColumnFilter"
    },


    {
      field:
        "Date",

      headerName:
        "Date",

      filter:
        true
    },


    {
      field:
        "Customer_ID",

      headerName:
        "Customer ID",

      type:
        "numericColumn",

      filter:
        "agNumberColumnFilter"
    },


    {
      field:
        "Bike_Model",

      headerName:
        "Bike Model",

      filter:
        true,

      enableRowGroup:
        true,

      enablePivot:
        true
    },


    {
      field:
        "Price",

      headerName:
        "Price",

      type:
        "numericColumn",

      filter:
        "agNumberColumnFilter",

      valueFormatter:
        currencyFormatter,

      enableValue:
        true
    },


    {
      field:
        "Quantity",

      headerName:
        "Quantity",

      type:
        "numericColumn",

      filter:
        "agNumberColumnFilter",

      enableValue:
        true,

      cellStyle:
        (params) => {

          if (
            params.node?.group
          ) {

            return null;

          }


          const value =
            Number(
              params.value
            );


          if (
            Number.isNaN(
              value
            )
          ) {

            return null;

          }


          const percentage =
            Math.min(
              value / 5,
              1
            ) * 100;


          return {

            fontWeight:
              "600",

            color:
              "#2563eb",

            background:
              `linear-gradient(
                to right,
                rgba(96, 165, 250, 0.24) 0%,
                rgba(96, 165, 250, 0.24) ${percentage}%,
                transparent ${percentage}%,
                transparent 100%
              )`

          };

        }
    },


    {
      field:
        "Store_Location",

      headerName:
        "Store Location",

      filter:
        true,

      enableRowGroup:
        true,

      enablePivot:
        true
    },


    {
      field:
        "Salesperson_ID",

      headerName:
        "Salesperson ID",

      type:
        "numericColumn",

      filter:
        "agNumberColumnFilter"
    },


    {
      field:
        "Payment_Method",

      headerName:
        "Payment Method",

      filter:
        true,

      enableRowGroup:
        true,

      enablePivot:
        true
    },


    {
      field:
        "Customer_Age",

      headerName:
        "Customer Age",

      type:
        "numericColumn",

      filter:
        "agNumberColumnFilter",

      enableValue:
        true
    },


    {
      field:
        "Customer_Gender",

      headerName:
        "Customer Gender",

      filter:
        true,

      enableRowGroup:
        true,

      enablePivot:
        true
    },


    {
      field:
        "Total_Sales",

      headerName:
        "Total Sales",

      type:
        "numericColumn",

      filter:
        "agNumberColumnFilter",

      valueFormatter:
        currencyFormatter,

      enableValue:
        true,

      cellStyle:
        (params) => {

          if (
            params.node?.group
          ) {

            return null;

          }


          const value =
            Number(
              params.value
            );


          if (
            Number.isNaN(
              value
            )
          ) {

            return null;

          }


          const percentage =
            Math.min(
              value /
              maxTotalSales,
              1
            ) * 100;


          return {

            fontWeight:
              "600",

            color:
              "#047857",

            background:
              `linear-gradient(
                to right,
                rgba(110, 231, 183, 0.30) 0%,
                rgba(110, 231, 183, 0.30) ${percentage}%,
                transparent ${percentage}%,
                transparent 100%
              )`

          };

        }
    }

  ];


  // ==================================================
  // GRID OPTIONS
  // ==================================================

  const gridOptions = {

    columnDefs,

    rowData,


    defaultColDef: {

      sortable:
        true,

      filter:
        true,

      resizable:
        true,

      minWidth:
        110,

      flex:
        1,

      enableRowGroup:
        true,

      enablePivot:
        true,

      enableValue:
        true

    },


    rowHeight:
      38,

    headerHeight:
      42,


    animateRows:
      true,


    sideBar: {

      toolPanels: [

        {
          id:
            "columns",

          labelDefault:
            "Columns",

          labelKey:
            "columns",

          iconKey:
            "columns",

          toolPanel:
            "agColumnsToolPanel",

          toolPanelParams: {

            suppressRowGroups:
              false,

            suppressValues:
              false,

            suppressPivots:
              false,

            suppressPivotMode:
              false

          }

        }

      ],

      defaultToolPanel:
        undefined

    },


    pivotMode:
      false,


    suppressAggFuncInHeader:
      false,


    autoGroupColumnDef: {

      headerName:
        "Bike Model",

      minWidth:
        190

    },


    onFilterChanged:
      (event) => {

        let count =
          0;


        event.api
          .forEachNodeAfterFilter(
            () => {

              count++;

            }
          );


        if (
          !event.api.getGridOption(
            "pivotMode"
          )
        ) {

          rowCount.textContent =
            `${count.toLocaleString(
              "en-US"
            )} rows`;

        }

      }

  };


  // ==================================================
  // CREATE GRID
  // ==================================================

  const gridApi =
    createGrid(
      gridElement,
      gridOptions
    );


  rowCount.textContent =
    `${rowData.length.toLocaleString(
      "en-US"
    )} rows`;


  gridApi.setSideBarVisible(
    false
  );


  // ==================================================
  // ACTIVE VIEW BUTTON
  // ==================================================

  function setViewButton(
    activeButton
  ) {

    rawButton
      .classList
      .remove(
        "active"
      );


    pivotButton
      .classList
      .remove(
        "active"
      );


    activeButton
      .classList
      .add(
        "active"
      );

  }


  // ==================================================
  // CLEAR PIVOT
  // ==================================================

  function clearPivotState() {

    gridApi.applyColumnState({

      defaultState: {

        rowGroup:
          false,

        pivot:
          false,

        aggFunc:
          null

      }

    });

  }


  // ==================================================
  // RAW DATA
  // ==================================================

  function showRawData() {

    setViewButton(
      rawButton
    );


    gridApi.closeToolPanel();


    gridApi.setSideBarVisible(
      false
    );


    gridApi.setGridOption(
      "pivotMode",
      false
    );


    clearPivotState();


    gridApi.setColumnsVisible(
      columnDefs.map(
        (column) =>
          column.field
      ),
      true
    );


    searchInput.disabled =
      false;


    searchInput.placeholder =
      "Search bike model, location or payment...";


    gridApi.setGridOption(
      "quickFilterText",
      searchInput.value
    );


    rowCount.textContent =
      `${rowData.length.toLocaleString(
        "en-US"
      )} rows`;

  }


  // ==================================================
  // COMMON PIVOT
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

  function showPivotView() {

    setViewButton(
      pivotButton
    );


    searchInput.value =
      "";


    gridApi.setGridOption(
      "quickFilterText",
      ""
    );


    searchInput.disabled =
      true;


    searchInput.placeholder =
      "Common Pivot: Bike Model × Store Location";


    gridApi.setGridOption(
      "pivotMode",
      true
    );


    clearPivotState();


    gridApi.applyColumnState({

      state: [

        {
          colId:
            "Bike_Model",

          rowGroup:
            true,

          rowGroupIndex:
            0
        },


        {
          colId:
            "Store_Location",

          pivot:
            true,

          pivotIndex:
            0
        },


        {
          colId:
            "Price",

          aggFunc:
            "avg"
        }

      ],


      defaultState: {

        rowGroup:
          false,

        pivot:
          false,

        aggFunc:
          null

      }

    });


    gridApi.setSideBarVisible(
      true
    );


    gridApi.openToolPanel(
      "columns"
    );


    rowCount.textContent =
      "Bike Model × Store Location · AVG(Price)";

  }


  // ==================================================
  // BUTTON EVENTS
  // ==================================================

  rawButton.addEventListener(
    "click",
    () => {

      showRawData();

    }
  );


  pivotButton.addEventListener(
    "click",
    () => {

      showPivotView();

    }
  );


  // ==================================================
  // SEARCH
  // ==================================================

  searchInput.addEventListener(
    "input",
    () => {

      if (
        searchInput.disabled
      ) {

        return;

      }


      gridApi.setGridOption(
        "quickFilterText",
        searchInput.value
      );

    }
  );


  return wrapper;
}