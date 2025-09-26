import { connectToDB } from "@/lib/mongo";
import Domain from "@/models/domain";
import pLimit from "p-limit";
import { checkSSL } from "./helpers";

export async function refreshAllDomainsSSL() {
  try {
    await connectToDB();
    const domains = await Domain.find({});
    if (!domains.length) {
      console.log("No domains found to refresh.");
      return;
    }

    console.log(`Refreshing SSL for ${domains.length} domains...`);

    const limit = pLimit(3); // max 3 lookups in parallel

    await Promise.all(
      domains.map((domain) =>
        limit(async () => {
          try {
            const sslData: any = await checkSSL(domain.domain);

            await Domain.findByIdAndUpdate(domain._id, {
              $set: {
                issueDate: sslData.issueDate,
                expiryDate: sslData.expiryDate,
                daysLeft: sslData.daysLeft,
                status: sslData.status,
                lastChecked: new Date(),
              },
            });

            console.log(`✅ SSL updated for: ${domain.domain}`);
          } catch (err: any) {
            console.error(
              `❌ Failed for ${domain.domain}: ${err.code || err.message}`
            );

            await Domain.findByIdAndUpdate(domain._id, {
              $set: {
                status: "unreachable",
                lastChecked: new Date(),
              },
            });
          }
        })
      )
    );

    console.log("🎉 SSL refresh completed for all domains.");
  } catch (error) {
    console.error("🔥 Fatal error in refreshAllDomainsSSL:", error);
  }
}
