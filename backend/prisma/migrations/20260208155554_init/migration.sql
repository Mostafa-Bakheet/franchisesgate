-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'FRANCHISE_OWNER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "FranchiseStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'UNPUBLISHED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('RESTAURANTS', 'RETAIL', 'SERVICES', 'HEALTH', 'EDUCATION', 'FASHION', 'CAFE', 'OTHER');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Franchise" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "coverImage" TEXT,
    "category" "Category" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "status" "FranchiseStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Franchise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentDetails" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "minInvestment" INTEGER NOT NULL,
    "maxInvestment" INTEGER NOT NULL,
    "franchiseFee" INTEGER,
    "franchiseFeeLocal" TEXT,
    "franchiseFeeIntl" INTEGER,
    "royaltyFee" TEXT,
    "marketingFee" TEXT,
    "equipmentCost" INTEGER,
    "equipmentCurrency" TEXT,

    CONSTRAINT "InvestmentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FranchiseStat" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "suffix" TEXT,
    "subtext" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FranchiseStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FranchiseCharacteristic" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT,
    "items" TEXT[],
    "icon" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FranchiseCharacteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "senderPhone" TEXT,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD',
    "readAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_ownerId_key" ON "Franchise"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_slug_key" ON "Franchise"("slug");

-- CreateIndex
CREATE INDEX "Franchise_status_idx" ON "Franchise"("status");

-- CreateIndex
CREATE INDEX "Franchise_category_idx" ON "Franchise"("category");

-- CreateIndex
CREATE INDEX "Franchise_country_idx" ON "Franchise"("country");

-- CreateIndex
CREATE INDEX "Franchise_city_idx" ON "Franchise"("city");

-- CreateIndex
CREATE INDEX "Franchise_status_category_idx" ON "Franchise"("status", "category");

-- CreateIndex
CREATE INDEX "Franchise_status_country_idx" ON "Franchise"("status", "country");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentDetails_franchiseId_key" ON "InvestmentDetails"("franchiseId");

-- CreateIndex
CREATE INDEX "FranchiseStat_franchiseId_idx" ON "FranchiseStat"("franchiseId");

-- CreateIndex
CREATE INDEX "FranchiseCharacteristic_franchiseId_idx" ON "FranchiseCharacteristic"("franchiseId");

-- CreateIndex
CREATE INDEX "GalleryImage_franchiseId_idx" ON "GalleryImage"("franchiseId");

-- CreateIndex
CREATE INDEX "Message_franchiseId_idx" ON "Message"("franchiseId");

-- CreateIndex
CREATE INDEX "Message_ownerId_idx" ON "Message"("ownerId");

-- CreateIndex
CREATE INDEX "Message_status_idx" ON "Message"("status");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "AdminLog_adminId_idx" ON "AdminLog"("adminId");

-- CreateIndex
CREATE INDEX "AdminLog_createdAt_idx" ON "AdminLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");

-- AddForeignKey
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentDetails" ADD CONSTRAINT "InvestmentDetails_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FranchiseStat" ADD CONSTRAINT "FranchiseStat_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FranchiseCharacteristic" ADD CONSTRAINT "FranchiseCharacteristic_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
