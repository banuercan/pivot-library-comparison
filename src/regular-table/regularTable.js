import "regular-table";
import "regular-table/dist/css/material.css";
import "./regularTable.css";

export async function createRegularTable() {
  const wrapper = document.createElement("section");
  wrapper.className = "regular-demo";

  wrapper.innerHTML = `
    <div class="regular-demo-header">
      <div>
        <div class="regular-demo-kicker">
          REGULAR TABLE
        </div>

        <h2 class="regular-demo-title">
          Bike Sales Data Grid
        </h2>

        <p class="regular-demo-description">
          High-performance virtualized view of bike sales records.
        </p>
      </div>

      <div class="regular-engine-badge">
        regular-table
      </div>
    </div>

    <div class="regular-toolbar">
      <div class="regular-search-wrapper">
        <span class="regular-search-icon">⌕</span>

        <input
          id="regular-search"
          class="regular-search"
          type="text"
          placeholder="Search model, location or payment method..."
        />
      </div>

      <div
        class="regular-row-count"
        id="regular-row-count"
      >
        Loading...
      </div>
    </div>

    <div class="regular-table-card">
      <regular-table
        class="regular-table-demo"
      ></regular-table>
    </div>
  `;

  const table =
    wrapper.querySelector(".regular-table-demo");

  const searchInput =
    wrapper.querySelector("#regular-search");

  const rowCount =
    wrapper.querySelector("#regular-row-count");

  // ===============================
  // CSV LOAD
  // ===============================

  const response =
    await fetch("/data/bike_sales.csv");

  if (!response.ok) {
    throw new Error("bike_sales.csv bulunamadı.");
  }

  const csvText =
    await response.text();

  const lines =
    csvText
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split(","));

  // ===============================
  // COLUMNS
  // ===============================

  const originalHeaders =
    lines[0];

  const headers = [
    ...originalHeaders,
    "Total_Sales"
  ];

  const displayNames = {
    Sale_ID: "Sale ID",
    Date: "Date",
    Customer_ID: "Customer ID",
    Bike_Model: "Bike Model",
    Price: "Price",
    Quantity: "Quantity",
    Store_Location: "Store Location",
    Salesperson_ID: "Salesperson ID",
    Payment_Method: "Payment Method",
    Customer_Age: "Customer Age",
    Customer_Gender: "Customer Gender",
    Total_Sales: "Total Sales"
  };

  const numericColumns = [
    "Sale_ID",
    "Customer_ID",
    "Price",
    "Quantity",
    "Salesperson_ID",
    "Customer_Age",
    "Total_Sales"
  ];

  const priceIndex =
    originalHeaders.indexOf("Price");

  const quantityIndex =
    originalHeaders.indexOf("Quantity");

  const bikeModelIndex =
    headers.indexOf("Bike_Model");

  const locationIndex =
    headers.indexOf("Store_Location");

  const paymentIndex =
    headers.indexOf("Payment_Method");

  const totalSalesIndex =
    headers.indexOf("Total_Sales");

  // ===============================
  // ROWS
  // ===============================

  const originalRows =
    lines
      .slice(1)
      .map((row) => {
        const price =
          Number(row[priceIndex]);

        const quantity =
          Number(row[quantityIndex]);

        const totalSales =
          price * quantity;

        return [
          ...row,
          totalSales.toFixed(2)
        ];
      });

  let rows = [
    ...originalRows
  ];

  // ===============================
  // SORT STATE
  // ===============================

  let sortColumn = null;
  let sortDirection = "asc";

  // ===============================
  // HELPERS
  // ===============================

  function updateRowCount() {
    rowCount.textContent =
      `${rows.length.toLocaleString("en-US")} rows`;
  }

  function getMaxValue(columnIndex) {
    if (rows.length === 0) {
      return 0;
    }

    return Math.max(
      ...rows.map((row) =>
        Number(row[columnIndex])
      )
    );
  }

  // VERY LIGHT PINK ZEBRA
  function getRowBackground(rowIndex) {
    return rowIndex % 2 === 0
      ? "#fffafd"
      : "#fff3f8";
  }

  function formatCurrency(value) {
    return `$${Number(value).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )}`;
  }

  updateRowCount();

  // ===============================
  // DATA LISTENER
  // ===============================

  table.setDataListener(
    async (x0, y0, x1, y1) => {
      const data = [];

      for (
        let x = x0;
        x < Math.min(x1, headers.length);
        x++
      ) {
        const column = [];

        for (
          let y = y0;
          y < Math.min(y1, rows.length);
          y++
        ) {
          column.push(
            rows[y][x]
          );
        }

        data.push(column);
      }

      return {
        num_rows: rows.length,
        num_columns: headers.length,

        column_headers:
          headers
            .slice(x0, x1)
            .map((header, index) => {
              const realIndex =
                x0 + index;

              let title =
                displayNames[header] || header;

              if (
                sortColumn === realIndex
              ) {
                title +=
                  sortDirection === "asc"
                    ? " ▲"
                    : " ▼";
              }

              return [title];
            }),

        row_headers: [],

        data
      };
    }
  );

  // ===============================
  // STYLE LISTENER
  // ===============================

  table.addStyleListener(() => {
    const maxTotalSales =
      getMaxValue(totalSalesIndex);

    const maxQuantity =
      getMaxValue(quantityIndex);

    // ===============================
    // HEADER
    // ===============================

    const headerCells =
      table.querySelectorAll("th");

    headerCells.forEach((headerCell) => {
      const metadata =
        table.getMeta(headerCell);

      headerCell.style.fontFamily =
        '"Segoe UI", Arial, sans-serif';

      headerCell.style.fontSize =
        "12px";

      headerCell.style.fontWeight =
        "600";

      headerCell.style.fontVariantNumeric =
        "tabular-nums";

      headerCell.style.color =
        "#7e5a6a";

      // LIGHT PINK HEADER
      headerCell.style.background =
        "#fdebf4";

      headerCell.style.borderBottom =
        "1px solid #f3dce6";

      headerCell.style.padding =
        "10px 12px";

      headerCell.style.whiteSpace =
        "nowrap";

      headerCell.style.cursor =
        "pointer";

      if (
        metadata &&
        metadata.x != null
      ) {
        const columnName =
          headers[metadata.x];

        if (
          numericColumns.includes(
            columnName
          )
        ) {
          headerCell.style.textAlign =
            "right";
        }

        else if (
          columnName === "Date"
        ) {
          headerCell.style.textAlign =
            "center";
        }

        else {
          headerCell.style.textAlign =
            "left";
        }
      }
    });

    // ===============================
    // BODY
    // ===============================

    const cells =
      table.querySelectorAll("td");

    cells.forEach((cell) => {
      const metadata =
        table.getMeta(cell);

      if (!metadata) {
        return;
      }

      const columnName =
        headers[metadata.x];

      const rawValue =
        rows[metadata.y]?.[metadata.x];

      if (rawValue == null) {
        return;
      }

      const baseBackground =
        getRowBackground(metadata.y);

      cell.style.fontFamily =
        '"Segoe UI", Arial, sans-serif';

      cell.style.fontSize =
        "12px";

      cell.style.fontVariantNumeric =
        "tabular-nums";

      cell.style.padding =
        "8px 12px";

      cell.style.color =
        "#715e67";

      cell.style.background =
        baseBackground;

      cell.style.borderBottom =
        "1px solid #f8e9f0";

      cell.style.whiteSpace =
        "nowrap";

      cell.style.fontWeight =
        "400";

      cell.style.borderRadius =
        "0";

      // ===============================
      // ALIGNMENT
      // ===============================

      if (
        numericColumns.includes(
          columnName
        )
      ) {
        cell.style.textAlign =
          "right";
      }

      else if (
        columnName === "Date"
      ) {
        cell.style.textAlign =
          "center";
      }

      else {
        cell.style.textAlign =
          "left";
      }

      // ===============================
      // PRICE
      // ===============================

      if (
        columnName === "Price"
      ) {
        cell.textContent =
          formatCurrency(rawValue);

        cell.style.color =
          "#67545d";
      }

      // ===============================
      // QUANTITY - BLUE DATA BAR
      // ===============================

      if (
        columnName === "Quantity"
      ) {
        const value =
          Number(rawValue);

        const percentage =
          maxQuantity > 0
            ? Math.min(
                (value / maxQuantity) * 100,
                100
              )
            : 0;

        cell.style.background =
          `linear-gradient(
            to right,
            rgba(96, 165, 250, 0.24) 0%,
            rgba(96, 165, 250, 0.24) ${percentage}%,
            ${baseBackground} ${percentage}%,
            ${baseBackground} 100%
          )`;

        cell.style.color =
          "#2563eb";

        cell.style.fontWeight =
          "600";
      }

      // ===============================
      // TOTAL SALES - MINT
      // ===============================

      if (
        columnName === "Total_Sales"
      ) {
        const value =
          Number(rawValue);

        const percentage =
          maxTotalSales > 0
            ? Math.min(
                (value / maxTotalSales) * 100,
                100
              )
            : 0;

        cell.textContent =
          formatCurrency(value);

        cell.style.background =
          `linear-gradient(
            to right,
            rgba(110, 231, 183, 0.30) 0%,
            rgba(110, 231, 183, 0.30) ${percentage}%,
            ${baseBackground} ${percentage}%,
            ${baseBackground} 100%
          )`;

        cell.style.color =
          "#047857";

        cell.style.fontWeight =
          "600";
      }

      // ===============================
      // PAYMENT METHOD
      // ===============================

      if (
        columnName === "Payment_Method"
      ) {
        cell.style.fontSize =
          "11px";

        cell.style.fontWeight =
          "500";

        cell.style.textAlign =
          "center";

        cell.style.padding =
          "3px 8px";

        cell.style.borderRadius =
          "6px";

        if (
          rawValue === "Apple Pay"
        ) {
          cell.style.background =
            "#f8f4ff";

          cell.style.color =
            "#6959c7";
        }

        else if (
          rawValue === "PayPal"
        ) {
          cell.style.background =
            "#f3f7ff";

          cell.style.color =
            "#2563eb";
        }

        else if (
          rawValue === "Credit Card"
        ) {
          cell.style.background =
            "#faf5ff";

          cell.style.color =
            "#7c3aed";
        }

        else if (
          rawValue === "Debit Card"
        ) {
          cell.style.background =
            "#f1fbf8";

          cell.style.color =
            "#047857";
        }

        else if (
          rawValue === "Google Pay"
        ) {
          cell.style.background =
            "#f4fbf3";

          cell.style.color =
            "#15803d";
        }

        else if (
          rawValue === "Cash"
        ) {
          cell.style.background =
            "#fff5f9";

          cell.style.color =
            "#a76f87";
        }
      }

      // ===============================
      // CUSTOMER GENDER
      // ===============================

      if (
        columnName === "Customer_Gender"
      ) {
        const dotColor =
          rawValue === "Female"
            ? "#be185d"
            : "#1e40af";

        cell.innerHTML =
          `<span
            style="
              color:${dotColor};
              font-size:9px;
              margin-right:6px;
              vertical-align:middle;
            "
          >
            ●
          </span>
          <span>
            ${rawValue}
          </span>`;
      }
    });

    // ===============================
    // HOVER
    // ===============================

    const bodyRows =
      table.querySelectorAll("tbody tr");

    bodyRows.forEach((row) => {
      row.onmouseenter = () => {
        row
          .querySelectorAll("td")
          .forEach((cell) => {
            cell.style.filter =
              "brightness(0.98)";
          });
      };

      row.onmouseleave = () => {
        row
          .querySelectorAll("td")
          .forEach((cell) => {
            cell.style.filter =
              "";
          });
      };
    });
  });

  // ===============================
  // SORTING
  // ===============================

  table.addEventListener(
    "click",
    async (event) => {
      const headerCell =
        event.target.closest("th");

      if (!headerCell) {
        return;
      }

      const metadata =
        table.getMeta(headerCell);

      if (
        !metadata ||
        metadata.x == null
      ) {
        return;
      }

      const columnIndex =
        metadata.x;

      const columnName =
        headers[columnIndex];

      if (
        sortColumn === columnIndex
      ) {
        sortDirection =
          sortDirection === "asc"
            ? "desc"
            : "asc";
      }

      else {
        sortColumn =
          columnIndex;

        sortDirection =
          "asc";
      }

      rows.sort((a, b) => {
        let valueA =
          a[columnIndex];

        let valueB =
          b[columnIndex];

        // NUMBER
        if (
          numericColumns.includes(
            columnName
          )
        ) {
          valueA =
            Number(valueA);

          valueB =
            Number(valueB);

          return sortDirection === "asc"
            ? valueA - valueB
            : valueB - valueA;
        }

        // DATE
        if (
          columnName === "Date"
        ) {
          const parseDate =
            (value) => {
              const [
                day,
                month,
                year
              ] =
                value.split("-");

              return new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
              );
            };

          const dateA =
            parseDate(valueA);

          const dateB =
            parseDate(valueB);

          return sortDirection === "asc"
            ? dateA - dateB
            : dateB - dateA;
        }

        // TEXT
        return sortDirection === "asc"
          ? String(valueA)
              .localeCompare(
                String(valueB)
              )
          : String(valueB)
              .localeCompare(
                String(valueA)
              );
      });

      table.scrollTop =
        0;

      await table.draw();
    }
  );

  // ===============================
  // SEARCH
  // ===============================

  searchInput.addEventListener(
    "input",
    async () => {
      const searchValue =
        searchInput
          .value
          .trim()
          .toLowerCase();

      if (
        searchValue === ""
      ) {
        rows = [
          ...originalRows
        ];
      }

      else {
        rows =
          originalRows.filter(
            (row) => {
              const bikeModel =
                String(
                  row[bikeModelIndex]
                ).toLowerCase();

              const location =
                String(
                  row[locationIndex]
                ).toLowerCase();

              const payment =
                String(
                  row[paymentIndex]
                ).toLowerCase();

              return (
                bikeModel.includes(
                  searchValue
                ) ||
                location.includes(
                  searchValue
                ) ||
                payment.includes(
                  searchValue
                )
              );
            }
          );
      }

      sortColumn =
        null;
      sortDirection =
        "asc";

      updateRowCount();

      table.scrollTop =
        0;

      await table.draw();
    }
  );

  wrapper.draw =
    async () => {
      await table.draw();
    };

  return wrapper;
}