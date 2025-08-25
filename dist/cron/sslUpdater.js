"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const mongo_1 = require("@/lib/mongo");
const domain_1 = __importDefault(require("@/models/domain"));
const helpers_1 = require("@/helpers/helpers");
async function refreshAllDomains() {
    await (0, mongo_1.connectToDB)();
    const domains = await domain_1.default.find();
    console.log(`⏰ Refreshing SSL for ${domains.length} domains...`);
    for (const d of domains) {
        try {
            const sslData = await (0, helpers_1.checkSSL)(d.domain);
            if (sslData) {
                await domain_1.default.findByIdAndUpdate(d._id, {
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
        }
        catch (err) {
            console.error(`❌ Failed to update ${d.domain}`, err);
        }
    }
}
// Run every day at midnight (server time)
// cron.schedule("0 0 * * *", refreshAllDomains);
node_cron_1.default.schedule("* * * * *", refreshAllDomains);
// Run once at startup too
refreshAllDomains();
