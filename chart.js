let chart;
let lastChartUpdateTime = -1;
let chartData = {
  labels: [],
  datasets: [
    {
      label: "سنگ",
      backgroundColor: "rgba(78,93,108,0.2)",
      borderColor: "#4e5d6c",
      fill: true,
      data: [],
    },
    {
      label: "کاغذ",
      backgroundColor: "rgba(184,216,186,0.2)",
      borderColor: "#b8d8ba",
      fill: true,
      data: [],
    },
    {
      label: "قیچی",
      backgroundColor: "rgba(224,122,95,0.2)",
      borderColor: "#e07a5f",
      fill: true,
      data: [],
    },
  ],
};

// ============ ساخت اولیه نمودار ============
window.addEventListener("load", () => {
  const ctx = document.getElementById("trendChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      animation: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: { display: true, text: "زمان (ثانیه)" },
        },
        y: {
          title: { display: true, text: "تعداد" },
          beginAtZero: true,
          suggestedMax: 90,
        },
      },
    },
  });
});

// ============ به‌روزرسانی داده‌ها ============
let chartUpdateInterval = 0;

function updateChartData() {
  if (typeof timer === "undefined" || typeof elements === "undefined") return;
  if (timer === lastChartUpdateTime) return;

  lastChartUpdateTime = timer;

  const time = timer;
  const counts = { rock: 0, paper: 0, scissors: 0 };
  for (let el of elements) counts[el.type]++;

  chartData.labels.push(time.toString());
  chartData.datasets[0].data.push(counts.rock);
  chartData.datasets[1].data.push(counts.paper);
  chartData.datasets[2].data.push(counts.scissors);

  if (chartData.labels.length > 30) {
    chartData.labels.shift();
    for (let ds of chartData.datasets) ds.data.shift();
  }

  chart.update();
}

