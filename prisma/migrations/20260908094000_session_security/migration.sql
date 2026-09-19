-- CreateTable
CREATE TABLE "user_security_states" (
    "userId" TEXT NOT NULL,
    "validAfter" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_security_states_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "user_security_states" ADD CONSTRAINT "user_security_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
