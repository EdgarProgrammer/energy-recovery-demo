const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const truckContainer = document.getElementById('truckContainer');
const totalEnergyDisplay = document.getElementById('totalEnergy');
const truckCountInput = document.getElementById('truckCount');
const truckWeightInput = document.getElementById('truckWeight');
const truckSpeedInput = document.getElementById('truckSpeed');

let trucks = [];
let totalEnergy = 0;
let chart;
let chartData = [];

function createTrucks() {
  truckContainer.innerHTML = '';
  trucks = [];
  const count = parseInt(truckCountInput.value);
  for (let i = 0; i < count; i++) {
    const truck = document.createElement('div');
    truck.className = 'truck';
    truck.style.left = `${-i*70}px`;
    truckContainer.appendChild(truck);
    trucks.push(truck);
  }
}

function simulateEnergy() {
  const weight = parseFloat(truckWeightInput.value);
  const speed = parseFloat(truckSpeedInput.value);
  const efficiency = 0.05; // 5% energy recovery factor
  let positionIncrement = 5; // px per tick

  const interval = setInterval(() => {
    trucks.forEach((truck, index) => {
      let currentLeft = parseFloat(truck.style.left);
      truck.style.left = currentLeft + positionIncrement + 'px';

      if (currentLeft + 50 >= 800) { // road width
        // truck exits road -> recover energy
        const energyRecovered = weight * speed * efficiency;
        totalEnergy += energyRecovered;
        totalEnergyDisplay.textContent = totalEnergy.toFixed(2);

        // log data for chart
        chartData.push(totalEnergy.toFixed(2));
        updateChart();

        // reset truck
        truck.style.left = '-60px';
      }
    });
  }, 100);
}

function setupChart() {
  const ctx = document.getElementById('energyChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Total Energy Recovered (kWh)',
        data: [],
        borderColor: 'green',
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Truck Passes' } },
        y: { title: { display: true, text: 'Energy (kWh)' } }
      }
    }
  });
}

function updateChart() {
  chart.data.labels.push(chart.data.labels.length + 1);
  chart.data.datasets[0].data.push(totalEnergy.toFixed(2));
  chart.update();
}

// Event listeners
startBtn.addEventListener('click', () => {
  createTrucks();
  totalEnergy = 0;
  chartData = [];
  totalEnergyDisplay.textContent = '0';
  simulateEnergy();
});

resetBtn.addEventListener('click', () => {
  trucks.forEach(truck => truck.style.left = '-60px');
  totalEnergy = 0;
  totalEnergyDisplay.textContent = '0';
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
});

// Initialize chart
setupChart();
