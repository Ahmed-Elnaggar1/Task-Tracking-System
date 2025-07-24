import bcrypt from "bcrypt";
import db from "../models/index.js";

export const createUser = async (email, password) => {
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }
  const user = await db.User.create({ email, password });
  return user;
};

export const findUserByEmail = async (email) => {
  return db.User.findOne({ where: { email } });
};

export const validatePassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};
