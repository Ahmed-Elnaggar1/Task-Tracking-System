import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export function createUserService(db) {
  return {
    createUser: async (email, password) => {
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) throw new Error("Email already registered");
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await db.User.create({ email, password: hashedPassword });
      return user;
    },
    findUserByEmail: async (email) => {
      const user = await db.User.findOne({ where: { email } });
      return user;
    },
    validatePassword: async (user, password) => {
      return await bcrypt.compare(password, user.password);
    },
    getAllUsers: async () => {
      return await db.User.findAll({ attributes: { exclude: ["password"] } });
    },
    getUserById: async (id) => {
      const user = await db.User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
      if (!user) throw new Error("User not found");
      return user;
    },
    updateUser: async (id, email, password) => {
      const user = await db.User.findByPk(id);
      if (!user) throw new Error("User not found");
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, SALT_ROUNDS);
      await user.save();
      return user;
    },
    deleteUser: async (id) => {
      const user = await db.User.findByPk(id);
      if (!user) throw new Error("User not found");
      await user.destroy();
      return true;
    },
  };
}
