import { disciplines } from "@prisma/client";
import client from "../database.js";

export type insertDisciplineData = Omit<disciplines, "id">;

async function getByName(name: string) {
  const nameLowerCase = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const discipline = await client.disciplines.findUnique({ where: { name: nameLowerCase } });
  return discipline;
}

async function get(term: string) {
  const disciplines = await client.disciplines.findMany({
    where: {
      term,
    },
  });
  return disciplines;
}

async function insert(data: insertDisciplineData) {
  data.name = data.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const discipline = await client.disciplines.create({ data });
  return discipline;
}

const disciplinesRepository = {
  insert,
  getByName,
  get,
};
export default disciplinesRepository;
