import client from "../src/database.js";
import { disciplines, teachers } from "./constants.js";

async function main() {
  for (let i = 1; i <= 5; i++) {
    await client.categories.upsert({
      where: { name: `P${i}` },
      update: {},
      create: { name: `P${i}` },
    });

    await client.categories.upsert({
      where: { name: `P${i} REC` },
      update: {},
      create: { name: `P${i} REC` },
    });
  }

  for (let teacher of teachers) {
    await client.teachers.upsert({
      where: { name: teacher },
      update: {},
      create: { name: teacher },
    });
  }

  for (let discipline of disciplines) {
    await client.disciplines.upsert({
      where: { name: discipline.name },
      update: {},
      create: { ...discipline },
    });
  }
}

export default function seed() {
  main()
    .catch((e) => {
      console.log(e);
      process.exit(1);
    })
    .finally(async () => {
      await client.$disconnect();
    });
}

seed();
