-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "sessionId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "details" TEXT,
    "franchiseId" TEXT,
    "userId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_timestamp_idx" ON "PageView"("timestamp");

-- CreateIndex
CREATE INDEX "PageView_page_idx" ON "PageView"("page");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "UserActivity_timestamp_idx" ON "UserActivity"("timestamp");

-- CreateIndex
CREATE INDEX "UserActivity_type_idx" ON "UserActivity"("type");

-- CreateIndex
CREATE INDEX "UserActivity_franchiseId_idx" ON "UserActivity"("franchiseId");

-- CreateIndex
CREATE INDEX "UserActivity_userId_idx" ON "UserActivity"("userId");

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
