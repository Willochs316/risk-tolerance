import express from "express";
import mongoose from "mongoose";
import { google } from "googleapis";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cors());

app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "stock-risk.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "10Nk9gaFZF_1QmNx7Me8YOS0rODCMCDVVfqxWuzqsLq8";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  res.send(metaData.data);
});

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on port: ${PORT}`.cyan.underline.bold)
    )
  )
  .catch((error) => console.log(error.message));
