-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'OFFICER', 'EXEC');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('RELEASED', 'PROTOTYPE', 'UNRELEASED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "profilePicture" TEXT,
    "discordHandle" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficerBio" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "position" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OfficerBio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "gallery" TEXT[],
    "slug" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameTags" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "GameTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTags" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "EventTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "credits" TEXT[],
    "description" TEXT NOT NULL,
    "releaseDate" DATE NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "link" TEXT,
    "thumbnail" TEXT,
    "isWebPlayable" BOOLEAN NOT NULL DEFAULT false,
    "status" "GameStatus" NOT NULL DEFAULT 'UNRELEASED',
    "hasSeal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "gallery" TEXT[],
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StoreItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "authors" TEXT[],
    "coverImage" TEXT,
    "coverCaption" TEXT,
    "postData" TEXT NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToEventTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventToEventTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GameToGameTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameToGameTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordHandle_key" ON "User"("discordHandle");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "_EventToEventTags_B_index" ON "_EventToEventTags"("B");

-- CreateIndex
CREATE INDEX "_GameToGameTags_B_index" ON "_GameToGameTags"("B");

-- AddForeignKey
ALTER TABLE "OfficerBio" ADD CONSTRAINT "OfficerBio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTags" ADD CONSTRAINT "_EventToEventTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTags" ADD CONSTRAINT "_EventToEventTags_B_fkey" FOREIGN KEY ("B") REFERENCES "EventTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToGameTags" ADD CONSTRAINT "_GameToGameTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToGameTags" ADD CONSTRAINT "_GameToGameTags_B_fkey" FOREIGN KEY ("B") REFERENCES "GameTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
