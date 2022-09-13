import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const port = 4567;

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { hobbies: true } });
  res.send(users);
});
app.post("/users", async (req, res) => {
  // const errors: string[] = [];

  // if (typeof req.body.name !== "string") {
  //   errors.push("Name not provided or not a string");
  // }
  // if (typeof req.body.photo !== "string") {
  //   errors.push("Photo not provided or not a string");
  // }
  // if (typeof req.body.email !== "string") {
  //   errors.push("Email not provided or not a string");
  // }

  const userData = {
    name: req.body.name,
    photo: req.body.photo,
    email: req.body.email,
    hobbies: req.body.hobbies ? req.body.hobbies : [],
  };
  // if (errors.length === 0) {
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      photo: userData.photo,
      email: userData.email,
      hobbies: {
        //@ts-ignore
        connectOrCreate: userData.hobbies.map((hobby) => ({
          where: { name: hobby },
          create: { name: hobby },
        })),
      },
    },
    include: { hobbies: true },
  });
  res.send(user);
  // } else {
  //   res.status(400).send({ errors });
  // }
});
app.get("/hobbies", async (req, res) => {
  const hobbies = await prisma.hobby.findMany({ include: { users: true } });
  res.send(hobbies);
});
app.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id: id },
    include: { hobbies: true },
  });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ error: "User not found" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.delete({ where: { id } });
  res.send(user);
});
app.patch("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
    include: { hobbies: true },
  });
  res.send(user);
});

app.patch("/addHobbyToUser", async (req, res) => {
  const userName = req.body.userName;
  const hobbyName = req.body.hobbyName;

  const user = await prisma.user.update({
    where: { name: userName },
    data: {
      hobbies: {
        //@ts-ignore
        connectOrCreate: {
          where: { name: hobbyName },
          create: { name: hobbyName },
        },
      },
    },
    include: { hobbies: true },
  });
  res.send(user)
});
app.get("/hobbies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const hobby = await prisma.hobby.findUnique({
    where: { id },
    include: { users: true },
  });
  if (hobby) {
    res.send(hobby);
  } else {
    res.status(404).send({ error: "Hobby not found" });
  }
});
app.post("/hobbies", async (req, res) => {
  const errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("Name not provided or not a string");
  }
  // if (typeof req.body.image !== "string") {
  //   errors.push("Image not provided or not a string");
  // }
  // if (typeof req.body.active !== "boolean") {
  //   errors.push("Active status not provided or not a boolean");
  // }
  // if (typeof req.body.userId !== "number") {
  //   errors.push("UserId not provided or not a number");
  // }

  if (errors.length === 0) {
    const hobby = await prisma.hobby.create({
      data: req.body,
      include: { users: true },
    });
    res.send(hobby);
  } else {
    res.status(400).send({ errors });
  }
});
app.delete("/hobbies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const hobby = await prisma.hobby.delete({ where: { id } });
  res.send(hobby);
});

app.patch("/hobbies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const hobby = await prisma.hobby.update({
    where: { id },
    data: req.body,
    include: { users: true },
  });
  res.send(hobby);
});
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
