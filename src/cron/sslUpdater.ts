import cron from "node-cron";
import { connectToDB } from "@/lib/mongo";
import Domain from "@/models/domain";
import { checkSSL } from "@/helpers/helpers";

async function refreshAllDomains() {
  await connectToDB();
  const domains = await Domain.find();

  console.log(`⏰ Refreshing SSL for ${domains.length} domains...`);

  for (const d of domains) {
    try {
      const sslData = await checkSSL(d.domain);
      if (sslData) {
        await Domain.findByIdAndUpdate(d._id, {
          $set: {
            issueDate: sslData.issueDate,
            expiryDate: sslData.expiryDate,
            daysLeft: sslData.daysLeft,
            status: sslData.status,
            lastChecked: new Date(),
          },
        });
        console.log(`✅ Updated SSL for ${d.domain}`);
      }
    } catch (err) {
      console.error(`❌ Failed to update ${d.domain}`, err);
    }
  }
}

// Run every day at midnight (server time)
// cron.schedule("0 0 * * *", refreshAllDomains);
cron.schedule("* * * * *", refreshAllDomains);

// Run once at startup too
refreshAllDomains();
