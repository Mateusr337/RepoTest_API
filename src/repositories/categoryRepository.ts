import client from "../database.js";

async function getByName(name: string) {
  const category = await client.categories.findUnique({ where: { name } });
  return category;
}

async function insert(name: string) {
  const formatName = name.toLowerCase().trim();
  const category = client.categories.create({ data: { name: formatName } });
  return category;
}

async function get() {
  const categories = await client.categories.findMany({});
  return categories;
}

const categoryRepository = {
  insert,
  getByName,
  get,
};
export default categoryRepository;
