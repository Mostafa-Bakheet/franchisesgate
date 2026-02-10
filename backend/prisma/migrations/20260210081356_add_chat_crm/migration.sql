-- CreateEnum
CREATE TYPE "ChatParticipantType" AS ENUM ('VISITOR', 'INVESTOR', 'OWNER', 'ADMIN', 'SUPPORT');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChatMessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST', 'COLD');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE_CHAT', 'PROFILE_INQUIRY', 'LANDING_PAGE', 'REFERRAL', 'SOCIAL_MEDIA', 'EMAIL_CAMPAIGN', 'PHONE_CALL', 'WALK_IN', 'OTHER');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FollowUpType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_MESSAGE', 'NEW_LEAD', 'LEAD_STATUS_CHANGE', 'TICKET_CREATED', 'TICKET_RESPONSE', 'FOLLOW_UP_REMINDER', 'SYSTEM');

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "participantType" "ChatParticipantType" NOT NULL,
    "participantId" TEXT,
    "participantName" TEXT NOT NULL,
    "participantEmail" TEXT,
    "participantPhone" TEXT,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "subject" TEXT,
    "source" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderType" "ChatParticipantType" NOT NULL,
    "senderId" TEXT,
    "senderName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'text',
    "attachmentUrl" TEXT,
    "status" "ChatMessageStatus" NOT NULL DEFAULT 'SENT',
    "readAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatNote" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" "ChatParticipantType" NOT NULL,
    "content" TEXT NOT NULL,
    "noteType" TEXT NOT NULL DEFAULT 'internal',
    "reminderAt" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "interestType" TEXT NOT NULL,
    "franchiseId" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE_CHAT',
    "assignedToId" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "estimatedInvestment" INTEGER,
    "timeline" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstContactAt" TIMESTAMP(3),
    "lastContactAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "performedById" TEXT NOT NULL,
    "performedByName" TEXT NOT NULL,
    "performedByRole" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "leadId" TEXT,
    "conversationId" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "assignedToId" TEXT,
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT,
    "requesterPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketResponse" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "responderId" TEXT NOT NULL,
    "responderName" TEXT NOT NULL,
    "responderRole" TEXT NOT NULL,
    "isNote" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "conversationId" TEXT,
    "type" "FollowUpType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdById" TEXT NOT NULL,
    "withPerson" TEXT NOT NULL,
    "withEmail" TEXT,
    "withPhone" TEXT,
    "outcome" TEXT,
    "completedAt" TIMESTAMP(3),
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadTag" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_franchiseId_idx" ON "Conversation"("franchiseId");

-- CreateIndex
CREATE INDEX "Conversation_ownerId_idx" ON "Conversation"("ownerId");

-- CreateIndex
CREATE INDEX "Conversation_status_idx" ON "Conversation"("status");

-- CreateIndex
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");

-- CreateIndex
CREATE INDEX "Conversation_participantType_participantId_idx" ON "Conversation"("participantType", "participantId");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_idx" ON "ChatMessage"("conversationId");

-- CreateIndex
CREATE INDEX "ChatMessage_senderType_senderId_idx" ON "ChatMessage"("senderType", "senderId");

-- CreateIndex
CREATE INDEX "ChatMessage_createdAt_idx" ON "ChatMessage"("createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_status_idx" ON "ChatMessage"("status");

-- CreateIndex
CREATE INDEX "ChatNote_conversationId_idx" ON "ChatNote"("conversationId");

-- CreateIndex
CREATE INDEX "ChatNote_authorId_idx" ON "ChatNote"("authorId");

-- CreateIndex
CREATE INDEX "ChatNote_createdAt_idx" ON "ChatNote"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_assignedToId_idx" ON "Lead"("assignedToId");

-- CreateIndex
CREATE INDEX "Lead_franchiseId_idx" ON "Lead"("franchiseId");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_score_idx" ON "Lead"("score");

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_idx" ON "LeadActivity"("leadId");

-- CreateIndex
CREATE INDEX "LeadActivity_createdAt_idx" ON "LeadActivity"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON "Ticket"("ticketNumber");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_assignedToId_idx" ON "Ticket"("assignedToId");

-- CreateIndex
CREATE INDEX "Ticket_priority_idx" ON "Ticket"("priority");

-- CreateIndex
CREATE INDEX "Ticket_createdAt_idx" ON "Ticket"("createdAt");

-- CreateIndex
CREATE INDEX "TicketResponse_ticketId_idx" ON "TicketResponse"("ticketId");

-- CreateIndex
CREATE INDEX "TicketResponse_createdAt_idx" ON "TicketResponse"("createdAt");

-- CreateIndex
CREATE INDEX "FollowUp_leadId_idx" ON "FollowUp"("leadId");

-- CreateIndex
CREATE INDEX "FollowUp_conversationId_idx" ON "FollowUp"("conversationId");

-- CreateIndex
CREATE INDEX "FollowUp_scheduledAt_idx" ON "FollowUp"("scheduledAt");

-- CreateIndex
CREATE INDEX "FollowUp_status_idx" ON "FollowUp"("status");

-- CreateIndex
CREATE INDEX "LeadTag_leadId_idx" ON "LeadTag"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadTag_leadId_tag_key" ON "LeadTag"("leadId", "tag");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatNote" ADD CONSTRAINT "ChatNote_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketResponse" ADD CONSTRAINT "TicketResponse_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadTag" ADD CONSTRAINT "LeadTag_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
