const Log = require("./logger");

async function test() {
    await Log(
        "backend",
        "info",
        "service",
        "Logging Middleware Working"
    );
}

test();