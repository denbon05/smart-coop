-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "coopId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coop" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "location" TEXT NOT NULL,

    CONSTRAINT "Coop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
