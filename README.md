# Pivot Library Comparison

A web-based project for comparing different pivot table and data grid libraries using the same dataset and a DuckDB-WASM-based data processing environment.

The project compares **Perspective**, **Regular Table**, **AG Grid**, and **Huey** in terms of pivot capabilities, performance, integration, and user experience.

## Features

- Comparison of four data visualization and table libraries
- Pivot table functionality
- Browser-based data processing with DuckDB-WASM
- Common dataset for consistent comparison
- Average price analysis
- Interactive data exploration
- Dedicated interface for each library
- Comparison page summarizing the differences between the libraries

## Technologies

- JavaScript
- Vite
- DuckDB-WASM
- Perspective
- Regular Table
- AG Grid
- Huey
- HTML
- CSS

## Libraries Compared

### Perspective

Provides built-in pivot functionality and an interactive configuration interface for grouping and aggregating data.

### Regular Table

A lightweight and flexible table rendering library. It does not provide native pivot functionality and therefore requires additional logic for advanced analytical operations.

### AG Grid

Provides advanced grid functionality, including grouping and pivot operations. Pivot functionality and its side panel are configured programmatically.

### Huey

Provides an analytical query interface based on DuckDB and supports pivot-style data exploration through its query-building interface.

## Dataset

The project uses the `bike_sales.csv` dataset.

The same dataset is used across the different libraries to make the comparison consistent.

## Installation

Clone the repository:

```bash
git clone https://github.com/banuercan/pivot-library-comparison.git
```

Navigate to the project directory:

```bash
cd pivot-library-comparison
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local development URL displayed in the terminal.

## Purpose

The purpose of this project is to evaluate different JavaScript libraries for pivot-based data analysis and visualization.

The libraries are compared based on:

- Pivot capabilities
- Performance
- Integration complexity
- User experience
- Customization possibilities

DuckDB-WASM is used to enable analytical data processing directly in the browser.