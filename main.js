// Datu struktūra ar komandas dalībniekiem
const teamMembers = [
  {
    name: "Rihards",
    age: 67,
    gender: "vīrietis",
    hobby: "volejbols",
  },
  {
    name: "Ralfs",
    age: 20,
    gender: "vīrietis",
    hobby: "basketbols",
  },
  {
    name: "Jānis",
    age: 22,
    gender: "vīrietis",
    hobby: "kuģis",
  },
];

function renderTeamMembers() {
  const container = document.getElementById("team-members");
  if (!container) return;

  teamMembers.forEach((member) => {
    const div = document.createElement("div");
    div.className = "team-member";
    div.textContent =
      "Vārds: " +
      member.name +
      ", vecums: " +
      member.age +
      ", dzimums: " +
      member.gender +
      ", hobijs: " +
      member.hobby;
    container.appendChild(div);
  });
}

async function loadTemperatureData() {
  const response = await fetch(
    "Weather Data - Digital Transformation II (1).csv"
  );
  const text = await response.text();

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return [];
  }

  const header = lines[0].split(",");
  const yearIndex = header.indexOf("Year");
  const globIndex = header.indexOf("Glob");

  if (yearIndex === -1 || globIndex === -1) {
    return [];
  }

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(",");
    const year = parseInt(columns[yearIndex], 10);
    const glob = parseFloat(columns[globIndex]);

    if (!Number.isNaN(year) && !Number.isNaN(glob)) {
      rows.push({ year, glob });
    }
  }

  return rows;
}

async function createCharts() {
  const ctx1 = document.getElementById("chartExample1");
  const ctx2 = document.getElementById("chartExample2");

  if (!window.Chart || (!ctx1 && !ctx2)) {
    return;
  }

  const data = await loadTemperatureData();
  if (!data.length) {
    return;
  }

  const allYears = data.map((row) => row.year);
  const allGlobValues = data.map((row) => row.glob);

  const recentData = data.filter((row) => row.year >= 2000);
  const recentYears = recentData.map((row) => row.year);
  const recentGlobValues = recentData.map((row) => row.glob);

  if (ctx1) {
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: allYears,
        datasets: [
          {
            label: "Globālā temperatūras novirze (°C)",
            data: allGlobValues,
            borderColor: "rgba(231, 76, 60, 0.9)",
            backgroundColor: "rgba(231, 76, 60, 0.3)",
            fill: true,
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Gads",
            },
          },
          y: {
            title: {
              display: true,
              text: "Novirze (°C)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  if (ctx2 && recentData.length) {
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: recentYears,
        datasets: [
          {
            label: "Globālā temperatūras novirze (°C)",
            data: recentGlobValues,
            backgroundColor: "rgba(52, 152, 219, 0.7)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Gads",
            },
          },
          y: {
            title: {
              display: true,
              text: "Novirze (°C)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderTeamMembers();
  createCharts();
});
