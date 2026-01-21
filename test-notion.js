const { Client } = require("@notionhq/client");
require("dotenv").config({ path: ".env.local" });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function test() {
  console.log("\n🔍 Testing Notion Connection...\n");

  // Check environment variables
  console.log("Environment Variables:");
  console.log(
    "  API Key:",
    process.env.NOTION_API_KEY
      ? "✅ Set (" + process.env.NOTION_API_KEY.substring(0, 10) + "...)"
      : "❌ Missing",
  );
  console.log(
    "  Database ID:",
    process.env.NOTION_DATABASE_ID
      ? "✅ Set (" + process.env.NOTION_DATABASE_ID.substring(0, 8) + "...)"
      : "❌ Missing",
  );
  console.log("");

  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.log(
      "❌ Missing environment variables. Check your .env.local file.\n",
    );
    return;
  }

  try {
    // Test 1: Retrieve database info
    console.log("Test 1: Retrieving database info...");
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    console.log(
      "✅ Database found:",
      database.title[0]?.plain_text || "Untitled",
    );
    console.log("");

    // Test 2: Query database
    console.log("Test 2: Querying database for posts...");
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 10,
    });
    console.log("✅ Query successful!");
    console.log("   Found", response.results.length, "pages");
    console.log("");

    // List the pages
    if (response.results.length > 0) {
      console.log("Pages in database:");
      response.results.forEach((page, index) => {
        const title = page.properties.Title?.title[0]?.plain_text || "Untitled";
        const status = page.properties.Status?.select?.name || "No status";
        console.log(`  ${index + 1}. "${title}" - Status: ${status}`);
      });
    } else {
      console.log("⚠️  Database is empty. Add some pages to test!");
    }

    console.log("\n✅ All tests passed! Notion integration is working.\n");
  } catch (error) {
    console.log("❌ Connection failed!\n");
    console.log("Error:", error.message);
    console.log("");

    if (error.code === "object_not_found") {
      console.log("💡 This means:");
      console.log(
        "   - The database exists, but the integration cannot access it",
      );
      console.log("   - You need to SHARE the database with your integration");
      console.log(
        '   - In Notion: Open database → Share → Add "Blog Posts" integration\n',
      );
    } else if (error.code === "unauthorized") {
      console.log("💡 This means:");
      console.log("   - Your API key is invalid or expired");
      console.log(
        "   - Check your integration at: https://www.notion.so/my-integrations\n",
      );
    } else if (error.code === "validation_error") {
      console.log("💡 This means:");
      console.log("   - Your database ID is malformed or incorrect");
      console.log(
        "   - Database ID should be 32 characters (letters and numbers only)\n",
      );
    } else {
      console.log("💡 Full error details:");
      console.log(error);
      console.log("");
    }
  }
}

test();
