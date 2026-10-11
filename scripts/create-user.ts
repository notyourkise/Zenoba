import { closeDatabaseConnection, prisma } from "../src/lib/db/client";
import { hashPassword } from "../src/features/auth/password";
import { UserRole } from "../src/generated/prisma/client";

async function main() {
  const email = (process.argv[2] || process.env.USER_EMAIL || "learner@zenoba.tech").toLowerCase().trim();
  const password = process.argv[3] || process.env.USER_PASSWORD || "Password123!";
  const name = process.argv[4] || "Learner Zenoba";
  const rawRole = (process.argv[5] || "LEARNER").toUpperCase();
  const role: UserRole = Object.values(UserRole).includes(rawRole as UserRole)
    ? (rawRole as UserRole)
    : UserRole.LEARNER;

  console.log(`Creating user with email: ${email}...`);

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role, name },
    create: {
      email,
      name,
      passwordHash,
      role,
    },
  });

  console.log(`? User successfully created/updated:`);
  console.log(`ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error: unknown) => {
    console.error("? Failed to create user:", error);
    process.exitCode = 1;
  })
  .finally(closeDatabaseConnection);
