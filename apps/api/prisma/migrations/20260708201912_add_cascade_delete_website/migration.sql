-- DropForeignKey
ALTER TABLE "WebsiteChecks" DROP CONSTRAINT "WebsiteChecks_websiteId_fkey";

-- AddForeignKey
ALTER TABLE "WebsiteChecks" ADD CONSTRAINT "WebsiteChecks_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
