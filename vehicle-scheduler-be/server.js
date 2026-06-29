const express = require("express");
const cors = require("cors");

const schedulerRoute = require("./routes/scheduler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/schedule", schedulerRoute);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});