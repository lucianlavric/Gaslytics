// Run with npx tsx src/twelveLabs.ts

import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const TWELVE_LABS_API_KEY = process.env.TWELVE_LABS_API_KEY;
const API_URL = "https://api.twelvelabs.io/v1.2/some-endpoint"; // Replace with a real endpoint

if (!TWELVE_LABS_API_KEY) {
  console.error("TWELVE_LABS_API_KEY is not set in the .env file.");
  process.exit(1);
}

async function makeApiRequest() {
  try {
    const response = await fetch(API_URL, {
      method: "GET", // or 'POST', 'PUT', etc.
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TWELVE_LABS_API_KEY,
      },
      // body: JSON.stringify({ key: 'value' }), // Uncomment for POST/PUT requests
    });

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("API Response:");
    console.log(data);
  } catch (error) {
    console.error("Error making API request:", error);
  }
}

console.log("Hello world");
