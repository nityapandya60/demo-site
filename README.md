# EV/Insights — EV Market Analytics Website

A responsive, static portfolio website for the EV Market Analytics project by Nitya Pandya. Built with **HTML5, CSS3, and vanilla JavaScript**, with Chart.js for interactive demo charts. It is designed to be hosted on GitHub Pages.

## Features

- Responsive navigation and layouts for desktop, tablet, and mobile.
- Project overview and analytics workflow sections.
- Interactive data explorer with segment/year filters, dynamically updated KPI cards and charts.
- Downloadable demonstration CSV.
- Optional Tableau Public iframe embed.
- Repository links back to the original project.
- No build tools or backend server required.

## Important data note

The chart explorer currently uses a small **illustrative demo dataset**. It demonstrates front-end interactions only and must not be cited as actual EV market findings. Replace the sample values in `js/app.js` and `data/ev-demo-data.csv` with verified project data before presenting conclusions.

## Run locally

1. Download or clone the repository.
2. Open `index.html` in a browser. For the best local development experience, use VS Code with the Live Server extension.
3. The charts load Chart.js from jsDelivr, so the browser needs internet access for that library and Google Fonts.

## Included Tableau workbook

The provided packaged workbook is included at `downloads/Nitya-Pandya-EV-Market-Analytics.twbx` and linked from the Tableau section of the website. Visitors can download it and open it in Tableau Desktop. The browser cannot run a `.twbx` package as an interactive dashboard directly.

## Add your live Tableau dashboard

1. Open your workbook in Tableau Desktop or Tableau Public.
2. Publish it to **Tableau Public** and copy the URL of the specific published dashboard view. A `.twb` or `.twbx` file in GitHub cannot be embedded directly as an interactive web dashboard.
3. Open `js/app.js`.
4. Set the configuration near the top:

   ```js
   const TABLEAU_VIEW_URL = "https://public.tableau.com/views/WorkbookName/DashboardName";
   ```

5. Save and commit the change. The site will automatically render the Tableau view in the Tableau section.

Only a public Tableau URL is accepted by the embed helper. If you leave the setting blank, a setup placeholder remains visible.

## Publish with GitHub Pages

1. Upload all files and folders in this project to your GitHub repository. Keep `index.html` in the repository root.
2. Open **Settings → Pages** in GitHub.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`, then save.
5. Wait for the Pages deployment to finish. The URL will appear in the Pages settings.

## Project source

Original project repository: https://github.com/nityapandya60/nitya_pandya_ev_market_analytics

## Technology

- HTML5
- CSS3 (responsive layout, custom design system)
- Vanilla JavaScript
- Chart.js
- Tableau Public embed (optional)
- GitHub Pages hosting

## Customize

- Colors and responsive styling: `css/style.css`
- Interactions, demo data, Tableau URL: `js/app.js`
- Example dataset: `data/ev-demo-data.csv`
- Page content and sections: `index.html`
