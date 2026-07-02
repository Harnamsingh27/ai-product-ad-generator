-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "targetCustomer" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "imageUrl" TEXT,
    "headline" TEXT NOT NULL,
    "adCopy" TEXT NOT NULL,
    "socialCaption" TEXT NOT NULL,
    "newsletterBlurb" TEXT NOT NULL,
    "imagePrompt" TEXT NOT NULL,
    "creativeDirection" TEXT NOT NULL,
    "generatedImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);
