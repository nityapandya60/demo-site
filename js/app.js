/*
 * EV/INSIGHTS — front-end interactions
 * Tableau setup:
 * 1. Publish your workbook to Tableau Public.
 * 2. Copy the URL for the exact published view.
 * 3. Paste it into TABLEAU_VIEW_URL below.
 * 4. Commit the change to GitHub.
 *
 * Example format: https://public.tableau.com/views/WorkbookName/DashboardName
 * Only public.tableau.com URLs are accepted for safety.
 */
const TABLEAU_VIEW_URL = "";

const DEMO_DATA = [
  {year:2022, model:"Pulse Mini", segment:"Two-wheeler", range:105, battery:3.2, records:120},
  {year:2022, model:"Urban One", segment:"Passenger", range:285, battery:42, records:90},
  {year:2022, model:"Cargo E", segment:"Commercial", range:160, battery:28, records:55},
  {year:2023, model:"Pulse Mini", segment:"Two-wheeler", range:118, battery:3.6, records:145},
  {year:2023, model:"Urban One", segment:"Passenger", range:310, battery:46, records:130},
  {year:2023, model:"Cargo E", segment:"Commercial", range:178, battery:31, records:78},
  {year:2024, model:"Pulse Mini", segment:"Two-wheeler", range:132, battery:4.1, records:180},
  {year:2024, model:"Urban One", segment:"Passenger", range:338, battery:51, records:170},
  {year:2024, model:"Cargo E", segment:"Commercial", range:195, battery:35, records:100},
  {year:2025, model:"Pulse Mini", segment:"Two-wheeler", range:145, battery:4.5, records:205},
  {year:2025, model:"Urban One", segment:"Passenger", range:360, battery:55, records:225},
  {year:2025, model:"Cargo E", segment:"Commercial", range:215, battery:38, records:128}
];
const CHART_GREEN = "#a9f36d";
const CHART_MINT = "#67d9ad";
const CHART_PALE = "#d4e8b7";
const CHART_GRID = "rgba(178,211,187,.10)";
const CHART_TEXT = "#8da998";
let trendChart, segmentChart, rangeChart;

function getFilteredData() {
  const segment = document.getElementById("segment-filter")?.value || "all";
  const year = document.getElementById("year-filter")?.value || "all";
  return DEMO_DATA.filter(row => (segment === "all" || row.segment === segment) && (year === "all" || String(row.year) === year));
}
function average(rows, key) {
  return rows.length ? rows.reduce((sum, row) => sum + row[key], 0) / rows.length : 0;
}
function fmt(value, digits = 0) {
  return new Intl.NumberFormat("en-US", {maximumFractionDigits: digits, minimumFractionDigits: digits}).format(value);
}
function makeChartOptions() {
  return {
    responsive: true, maintainAspectRatio: false, animation: {duration: 450},
    plugins: {legend: {display: false}, tooltip: {backgroundColor: "#071712", borderColor: "#315441", borderWidth: 1, titleColor: "#e9f5e9", bodyColor: "#b6cbb9", padding: 11}},
    scales: {
      x: {grid: {display: false}, ticks: {color: CHART_TEXT, font: {family: "DM Mono", size: 9}}, border: {color: CHART_GRID}},
      y: {beginAtZero: true, grid: {color: CHART_GRID}, ticks: {color: CHART_TEXT, font: {family: "DM Mono", size: 9}}, border: {display: false}}
    }
  };
}
function initCharts() {
  if (!window.Chart) return;
  const trendCtx = document.getElementById("trend-chart");
  const segmentCtx = document.getElementById("segment-chart");
  const rangeCtx = document.getElementById("range-chart");
  const common = makeChartOptions();
  trendChart = new Chart(trendCtx, {type: "line", data: {labels: [], datasets: [{label: "Illustrative records", data: [], borderColor: CHART_GREEN, backgroundColor: "rgba(169,243,109,.10)", fill: true, tension: .35, pointRadius: 3, pointBackgroundColor: CHART_GREEN, borderWidth: 2}]}, options: common});
  segmentChart = new Chart(segmentCtx, {type: "doughnut", data: {labels: [], datasets: [{data: [], backgroundColor: [CHART_GREEN, CHART_MINT, CHART_PALE], borderColor: "#0b2119", borderWidth: 4, hoverOffset: 6}]}, options: {responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: {legend: {display: false}, tooltip: common.plugins.tooltip}}});
  rangeChart = new Chart(rangeCtx, {type: "bar", data: {labels: [], datasets: [{label: "Average range", data: [], backgroundColor: [CHART_GREEN, CHART_MINT, CHART_PALE], borderRadius: 5, maxBarThickness: 48}]}, options: {...common, scales: {...common.scales, y: {...common.scales.y, title: {display: true, text: "KM / CHARGE", color: CHART_TEXT, font: {size: 8, family: "DM Mono"}}}}}});
}
function updateDashboard() {
  const rows = getFilteredData();
  const totalRecords = rows.reduce((sum, row) => sum + row.records, 0);
  const segments = [...new Set(rows.map(row => row.segment))];
  document.getElementById("kpi-records").textContent = fmt(totalRecords);
  document.getElementById("kpi-range").textContent = rows.length ? fmt(average(rows, "range")) : "—";
  document.getElementById("kpi-battery").textContent = rows.length ? fmt(average(rows, "battery"), 1) : "—";
  document.getElementById("kpi-segments").textContent = segments.length;
  if (!window.Chart || !trendChart) return;
  const years = [...new Set(rows.map(row => row.year))].sort();
  trendChart.data.labels = years;
  trendChart.data.datasets[0].data = years.map(year => rows.filter(row => row.year === year).reduce((sum, row) => sum + row.records, 0));
  trendChart.update();
  const segs = ["Passenger", "Two-wheeler", "Commercial"].filter(s => rows.some(r => r.segment === s));
  segmentChart.data.labels = segs;
  segmentChart.data.datasets[0].data = segs.map(s => rows.filter(r => r.segment === s).reduce((sum, row) => sum + row.records, 0));
  segmentChart.data.datasets[0].backgroundColor = segs.map(s => ({Passenger: CHART_GREEN, "Two-wheeler": CHART_MINT, Commercial: CHART_PALE})[s]);
  segmentChart.update();
  document.getElementById("segment-legend").innerHTML = segs.map(s => {
    const color = ({Passenger: CHART_GREEN, "Two-wheeler": CHART_MINT, Commercial: CHART_PALE})[s];
    return `<span><i style="background:${color}"></i>${s}</span>`;
  }).join("");
  const models = [...new Set(rows.map(r => r.model))];
  rangeChart.data.labels = models;
  rangeChart.data.datasets[0].data = models.map(model => average(rows.filter(r => r.model === model), "range"));
  rangeChart.data.datasets[0].backgroundColor = models.map((_, i) => [CHART_GREEN, CHART_MINT, CHART_PALE][i % 3]);
  rangeChart.update();
}
function makeTableauEmbedUrl(viewUrl) {
  if (!viewUrl) return "";
  try {
    const url = new URL(viewUrl);
    if (url.hostname !== "public.tableau.com" && url.hostname !== "www.public.tableau.com") return "";
    url.searchParams.set(":showVizHome", "no");
    url.searchParams.set(":embed", "yes");
    return url.toString();
  } catch { return ""; }
}
function mountTableau() {
  const container = document.getElementById("tableau-container");
  const embedUrl = makeTableauEmbedUrl(TABLEAU_VIEW_URL);
  if (!container || !embedUrl) return;
  const iframe = document.createElement("iframe");
  iframe.className = "tableau-embed";
  iframe.src = embedUrl;
  iframe.title = "Interactive EV Market Analytics Tableau dashboard";
  iframe.loading = "lazy";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  container.replaceChildren(iframe);
}
function downloadDemoCSV() {
  const header = "year,model,segment,range_km,battery_kwh,illustrative_records";
  const lines = DEMO_DATA.map(r => [r.year, r.model, r.segment, r.range, r.battery, r.records].join(","));
  const blob = new Blob([[header, ...lines].join("\n")], {type: "text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "ev-demo-data.csv"; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }));
}
document.addEventListener("DOMContentLoaded", () => {
  initCharts();
  updateDashboard();
  mountTableau();
  setupMenu();
  document.getElementById("segment-filter")?.addEventListener("change", updateDashboard);
  document.getElementById("year-filter")?.addEventListener("change", updateDashboard);
  document.getElementById("reset-filters")?.addEventListener("click", () => {
    document.getElementById("segment-filter").value = "all";
    document.getElementById("year-filter").value = "all";
    updateDashboard();
  });
  document.getElementById("download-csv")?.addEventListener("click", downloadDemoCSV);
});