const { Client } = require("@notionhq/client");
require("dotenv").config({ path: ".env.local" });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function debug() {
  console.log("\n🔍 Debugging Notion Database...\n");

  const DATABASE_ID = process.env.NOTION_DATABASE_ID;

  console.log("API Key:", process.env.NOTION_API_KEY ? "✅ Set" : "❌ Missing");
  console.log("Database ID:", DATABASE_ID ? "✅ Set" : "❌ Missing");
  console.log("");

  try {
    // Get database structure
    console.log("1️⃣ Getting database structure...\n");
    const db = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    console.log("Full database object:");
    console.log(JSON.stringify(db, null, 2));
    console.log("\n" + "=".repeat(80) + "\n");

    console.log("Database Name:", db.title?.[0]?.plain_text || "Untitled");

    if (db.properties && typeof db.properties === "object") {
      console.log("\nProperties in database:");
      Object.keys(db.properties).forEach((name) => {
        const prop = db.properties[name];
        console.log(`  - "${name}": ${prop.type}`);
      });
    } else {
      console.log("\n⚠️  No properties found or properties is not an object");
      console.log("Properties value:", db.properties);
    }
    console.log("");

    // Query all pages (no filter)
    console.log("2️⃣ Querying all pages (no filter)...\n");
    const query = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 100,
    });

    console.log(`Found ${query.results.length} total pages\n`);

    if (query.results.length === 0) {
      console.log("⚠️  Your database is empty! Add some pages in Notion.\n");
      return;
    }

    // Show first page in detail
    console.log("First page (raw):");
    console.log(JSON.stringify(query.results[0], null, 2));
    console.log("\n" + "=".repeat(80) + "\n");

    // Show details of each page
    console.log("Pages in database:");
    query.results.forEach((page, index) => {
      console.log(`\n--- Page ${index + 1} ---`);
      console.log("ID:", page.id);

      if (page.properties && typeof page.properties === "object") {
        console.log("Properties:");
        Object.keys(page.properties).forEach((propName) => {
          const prop = page.properties[propName];
          let value = "N/A";

          try {
            if (prop.type === "title") {
              value = prop.title?.[0]?.plain_text || "(empty)";
            } else if (prop.type === "rich_text") {
              value = prop.rich_text?.[0]?.plain_text || "(empty)";
            } else if (prop.type === "select") {
              value = prop.select?.name || "(not set)";
            } else if (prop.type === "multi_select") {
              value =
                prop.multi_select?.map((s) => s.name).join(", ") || "(empty)";
            } else if (prop.type === "date") {
              value = prop.date?.start || "(not set)";
            } else if (prop.type === "checkbox") {
              value = prop.checkbox ? "✓" : "✗";
            } else if (prop.type === "status") {
              value = prop.status?.name || "(not set)";
            }
          } catch (e) {
            value = `(error: ${e.message})`;
          }

          console.log(`  ${propName} (${prop.type}): ${value}`);
        });
      } else {
        console.log("⚠️  No properties on this page");
      }
    });

    console.log("\n✅ Debug complete!\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
  }
}

debug();
