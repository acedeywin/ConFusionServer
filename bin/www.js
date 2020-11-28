#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app.js";
import debug from "debug";
("confusionserver:server");
import http from "http";
import https from "https";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
app.set("secPort", port + 443);

/**
 * Create HTTP server.
 */

const server = http.createServer(app),
  __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(__filename);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
server.on("error", onError);
server.on("listening", onListening);

const options = {
  key: fs.readFileSync(__dirname + "/private.key"),
  cert: fs.readFileSync(__dirname + "/certificate.pem"),
};

const secureServer = https.createServer(options, app);

secureServer.listen(app.get("secPort"), () => {
  console.log("Server listening on port ", app.get("secPort"));
});

secureServer.on("error", onError);
secureServer.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
