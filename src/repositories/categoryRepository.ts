import client from "../database.js";

async function getByName(name: string) {
  const formatName = name.toLowerCase();
  const category = await client.categories.findUnique({ where: { name: formatName } });
  return category;
}

async function insert(name: string) {
  const formatName = name.toLowerCase().trim();
  const category = client.categories.create({ data: { name: formatName } });
  return category;
}

const categoryRepository = {
  insert,
  getByName,
};
export default categoryRepository;
