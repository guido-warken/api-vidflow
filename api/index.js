const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");

const videosData = require("../data/videos.json");

const envFile = `.env.${process.env.NODE_ENV || "development"}`;

dotenv.config({ path: envFile });

const { videos } = videosData;

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(express.json());

app.get("/api/videos", (request, response) => response.json(videos));

app.get("/api/videos/:id", (request, response) => {
  const id = parseInt(request.params.id, 10);
  const video = videos.find((v) => v.id === id);

  if (video) {
    response.json(video);
  } else {
    response.status(404);
  }
});

app.post("/api/videos", (request, response) => {
  const novoVideo = request.body;

  videos.push(novoVideo);

  const jsonString = JSON.stringify({ videos }, null, 2);

  fs.writeFileSync("./data/videos.json", jsonString);

  response.status(201);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Server is listening"));

module.exports = app;
