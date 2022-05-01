import nodemailer from "nodemailer";
import { tests } from "@prisma/client";
import client from "../database.js";

export default async function sendEmail(emails: string[], test: tests) {
  const transporter = nodemailer.createTransport({
    service: "Hotmail",
    auth: {
      user: "mateusc.rossetto@hotmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const infosOfTest = await getAllInfoOfTest(test);

  transporter
    .sendMail({
      from: "<mateusc.rossetto@hotmail.com>",
      to: emails,
      subject: "RepoTest - new test posted!",
      html: `
      <span>Hello, I'm Mateus from the RepoTest team! </span> 
      <br /> <br />
      <span> The new test posted is "${test.name} ${infosOfTest.discipline.name} ${infosOfTest.category.name} ${infosOfTest.teacher.name}"</span> 
      <span>Access the test <a href="${test.pdfUrl}"> clicking here</a> </span>
      `,
    })
    .catch((error) => console.log(error.message));
}

async function getAllInfoOfTest(test: tests) {
  const category = await client.categories.findUnique({ where: { id: test.categoryId } });

  const teachersDisciplines = await client.teachersDiciplines.findUnique({
    where: { id: test.teacherDisciplineId },
  });

  const discipline = await client.disciplines.findUnique({
    where: { id: teachersDisciplines.disciplineId },
  });

  const teacher = await client.teachers.findUnique({
    where: { id: teachersDisciplines.teacherId },
  });

  return { teacher, discipline, category };
}
