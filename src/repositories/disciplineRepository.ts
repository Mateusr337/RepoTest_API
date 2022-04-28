import { disciplines } from "@prisma/client";
import client from "../database.js";

export type insertDisciplineData = Omit<disciplines, "id">;

export async function getByName(name: string) {
  const nameLowerCase = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const discipline = await client.disciplines.findUnique({ where: { name: nameLowerCase } });
  return discipline;
}

export async function insert(data: insertDisciplineData) {
  data.name = data.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const discipline = await client.disciplines.create({ data });
  return discipline;
}

export async function getByNamePartial(name: string) {
  const disciplines = await client.disciplines.findMany({
    where: { name: { contains: name } },
    include: { term: true },
  });
  return disciplines;
}
