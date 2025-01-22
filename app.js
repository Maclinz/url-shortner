import express from "express";
import dotenv from "dotenv";
import connect from "./src/db/connect.js";
import fs from "fs";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    // allow all
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = fs.readdirSync("./src/routes");

for (const file of routes) {
  // use dynamic import
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
}

const server = async () => {
  await connect();

  app.listen(PORT, () => {
    console.log("You are listening to port: ", +PORT);
  });
};

server();
