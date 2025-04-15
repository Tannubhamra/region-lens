# 🌍 Region Lens

**Region Lens** is a responsive Angular application that visualizes country-level data grouped by regions. It provides an interactive interface with D3.js-based charts to explore country statistics like population and land area.

---

## 🚀 Features

- 🔄 **Toggle Between Population and Area**  
  Switch the visualization metric using the top toggle – choose between **population** or **land area**.

- 📊 **Pack Chart Visualization**  
  D3-based bubble chart displays countries grouped by region. Bubbles dynamically scale based on the selected metric.

- 🧭 **Interactive Country Drawer**  
  Click on a country bubble to open a side drawer showing:
  - Country name
  - Population
  - Area
  - A direct **Wikipedia link** for more info

- 🟢 **Legend with Region Filters**  
  Color-coded **legends are clickable** – toggle region visibility in the chart dynamically.

- 🔍 **Zoom & Pan Support**
  - Move the chart freely with drag
  - Use **zoom in**, **zoom out**, and **reset zoom** controls to navigate

- ⚡ **Modern Angular Architecture**
  - Standalone Components
  - Angular Signals & Signal Store
  - Lazy loading for features
  - Tailwind CSS for responsive design

---

## 🧠 Smart Data Transformation

The `transformedData()` function processes incoming data in a **region-agnostic** way. That means:

> If the API sends new region data (e.g., Asia, Africa, etc.), the chart will **automatically extend and update** without needing any code changes.

This makes Region Lens highly **scalable** and **future-proof**.

---

## 🧰 Tech Stack

- Angular 17+
- TypeScript
- D3.js v7+
- Tailwind CSS
- Angular Signals 
- RxJS 

---

## ▶️ Getting Started

### Prerequisites

- Node.js >= 18
- Angular CLI >= 17

### Installation

```bash
git clone https://github.com/Tannubhamra/region-lens.git
cd region-lens
npm install
ng serve


# RegionLens

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
