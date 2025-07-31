import db from "../models/index.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createUser = async (email, password) => {
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already registered");
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await db.User.create({ email, password: hashedPassword });
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await db.User.findOne({ where: { email } });
  return user;
};

export const validatePassword = async (user, password) => {
  console.log("Comparing:", password, "with hash:", user.password);
  return await bcrypt.compare(password, user.password);
};

export const getAllUsers = async () => {
  return await db.User.findAll({ attributes: { exclude: ["password"] } });
};

export const getUserById = async (id) => {
  const user = await db.User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUser = async (id, email, password) => {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error("User not found");
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, SALT_ROUNDS);
  await user.save();
  return user;
};

export const deleteUser = async (id) => {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error("User not found");
  await user.destroy();
  return true;
};
