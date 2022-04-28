import client from "../database.js";

export async function getByName(name: string) {
  const formatName = name.toLowerCase();
  const category = await client.categories.findUnique({ where: { name: formatName } });
  return category;
}

export async function insert(name: string) {
  const formatName = name.toLowerCase().trim();
  const category = client.categories.create({ data: { name: formatName } });
  return category;
}
