import { Role } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { hashPassword } from "../utils/password.js";

async function main() {
  console.log("Seeding database...");

  // 1. Seed Poli (diperlukan untuk role DOKTER)
  const poliUmum = await prisma.poli.upsert({
    where: { kode: "POL-UMUM" },
    update: {},
    create: {
      kode: "POL-UMUM",
      nama: "Poli Umum",
    },
  });

  console.log(`Poli seeded: ${poliUmum.nama} (${poliUmum.kode})`);

  const defaultPassword = await hashPassword("password123");

  // 2. Seed User Role: ADMIN
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: defaultPassword,
      nama: "Administrator",
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log(`User seeded: ${admin.username} [Role: ${admin.role}]`);

  // 3. Seed User Role: PETUGAS_PENDAFTARAN
  const petugas = await prisma.user.upsert({  
    where: { username: "petugas" },
    update: {},
    create: {
      username: "petugas",
      password: defaultPassword,
      nama: "Petugas Pendaftaran",
      role: Role.PETUGAS_PENDAFTARAN,
      isActive: true,
    },
  });
  console.log(`User seeded: ${petugas.username} [Role: ${petugas.role}]`);

  // 4. Seed User Role: DOKTER
  const dokter = await prisma.user.upsert({
    where: { username: "dokter" },
    update: {},
    create: {
      username: "dokter",
      password: defaultPassword,
      nama: "dr. Budi Santoso",
      role: Role.DOKTER,
      poliId: poliUmum.id,
      isActive: true,
    },
  });
  console.log(`User seeded: ${dokter.username} [Role: ${dokter.role}]`);

  console.log("Seeding selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("Error saat running seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
