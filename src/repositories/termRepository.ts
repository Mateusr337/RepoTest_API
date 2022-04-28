import client from "../database.js";

export async function getByNumber(number: string) {
  const term = await client.terms.findUnique({ where: { number } });
  return term;
}

export async function getAll() {
  const terms = await client.terms.findMany();
  return terms;
}
