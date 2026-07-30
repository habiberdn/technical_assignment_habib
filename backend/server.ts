import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.ts";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
