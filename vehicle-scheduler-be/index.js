require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { logger, requestLogger } = require("../logging-middleware/index");

const app = express();
const SERVICE = process.env.SERVICE_NAME || "vehicle-scheduler";
const PORT = process.env.PORT || 3001;
const API_BASE = process.env.API_BASE;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

app.use(express.json());
app.use(requestLogger(SERVICE));

function knapsack(vehicles, maxHours) {
  
  const n = vehicles.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(maxHours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = vehicles[i - 1];
    for (let w = 0; w <= maxHours; w++) {
      dp[i][w] = dp[i - 1][w];
      if (Duration <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - Duration] + Impact);
      }
    }
  }

  const selected = [];
  let w = maxHours;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(vehicles[i - 1]);
      w -= vehicles[i - 1].Duration;
    }
  }

  return { maxImpact: dp[n][maxHours], selectedVehicles: selected };
}

app.get("/schedule", async (req, res) => {
  try {
    logger.info(SERVICE, "Fetching depots and vehicles from API");

    const headers = { Authorization: `Bearer ${AUTH_TOKEN}` };

    const [depotsRes, vehiclesRes] = await Promise.all([
      axios.get(`${API_BASE}/depots`, { headers }),
      axios.get(`${API_BASE}/vehicles`, { headers }),
    ]);

    const depots = depotsRes.data.depots;
    const vehicles = vehiclesRes.data.vehicles;

    logger.info(SERVICE, `Fetched ${depots.length} depots, ${vehicles.length} vehicles`);

    const results = depots.map((depot) => {
      logger.info(SERVICE, `Running scheduler for depot ${depot.ID}`, {
        mechanicHours: depot.MechanicHours,
      });

      // Ensure MechanicHours is an integer to prevent Array length errors
      const safeMechanicHours = Math.floor(depot.MechanicHours);
      const { maxImpact, selectedVehicles } = knapsack(vehicles, safeMechanicHours);
      
      const totalHoursUsed = selectedVehicles.reduce((s, v) => s + v.Duration, 0);

      logger.info(SERVICE, `Depot ${depot.ID} result`, {
        maxImpact,
        selectedCount: selectedVehicles.length,
        totalDuration: totalHoursUsed,
      });

      return {
        depotID: depot.ID,
        mechanicHoursBudget: safeMechanicHours,
        maxImpactAchieved: maxImpact,
        totalHoursUsed,
        selectedVehicles,
      };
    });

    res.json({ success: true, results });
  } catch (err) {
    logger.error(SERVICE, "Failed to run schedule", { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  logger.info(SERVICE, `Vehicle Scheduler running on port ${PORT}`);
  console.log(`Vehicle Scheduler running on http://localhost:${PORT}`);
});