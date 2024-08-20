const mongoose = require("mongoose");
const Tenant = require("./models/Tenant"); // Adjust the path according to your project structure
const dotenv = require("dotenv");
dotenv.config();
// Replace with your MongoDB URI
const mongoURI = process.env.MONGO_URI || "your_mongo_db_connection_string";

// Replace with the API key you want to check
const apiKeyToCheck =
  "549c17e6e04a3db060bcc597e143ff4cb7110b4493d7d167fa0a699984ffdf15";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    runChecks();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

async function runChecks() {
  try {
    // 1. Check if the API key exists in the database
    const tenant = await Tenant.findOne({ "services.apiKey": apiKeyToCheck });
    if (tenant) {
      console.log("API Key found in Tenant:", JSON.stringify(tenant, null, 2));
    } else {
      console.log("API Key not found in the database.");
    }

    // 2. Check the full structure of the Tenant collection
    const allTenants = await Tenant.find();
    console.log("All Tenants:", JSON.stringify(allTenants, null, 2));

    // 3. Check for specific issues with API key storage
    // - This includes checking for case sensitivity, leading/trailing spaces, etc.
    const tenantWithWhitespace = await Tenant.findOne({
      "services.apiKey": new RegExp(`^${apiKeyToCheck.trim()}$`, "i"),
    });
    if (tenantWithWhitespace) {
      console.log(
        "API Key found with potential case/whitespace issue:",
        JSON.stringify(tenantWithWhitespace, null, 2)
      );
    } else {
      console.log(
        "No matching API Key found with case-insensitive or trimmed search."
      );
    }

    // 4. Check the index on the API key field (if applicable)
    const indexes = await Tenant.collection.indexes();
    console.log("Current Indexes on Tenant collection:", indexes);
  } catch (error) {
    console.error("Error during checks:", error);
  } finally {
    mongoose.connection.close();
  }
}
