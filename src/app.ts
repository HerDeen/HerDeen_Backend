import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import { PORT } from "./config/system.variable";
import { mongoConnection } from "./config/db.connection";
import router from "./router/app.router";
import { handleCustomError } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.use("/api/v1/", router);

app.use(handleCustomError);

mongoConnection();
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
