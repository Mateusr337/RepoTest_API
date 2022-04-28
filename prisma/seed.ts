import client from "../src/database.js";

async function main() {
  for (let i = 0; i <= 5; i++) {
    client.categories.upsert({
      where: { name: `P${i}` },
      update: {},
      create: { name: `P${i}` },
    });

    client.categories.upsert({
      where: { name: `P${i} REC` },
      update: {},
      create: { name: `P${i} REC` },
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
