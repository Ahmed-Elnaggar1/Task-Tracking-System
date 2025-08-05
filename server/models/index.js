import { readdirSync } from "fs";
import { join, basename } from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import fs from "fs";
const config = JSON.parse(
  fs.readFileSync(new URL("../config/config.json", import.meta.url))
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: dbConfig.dialect,
    pool: dbConfig.pool || {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

const db = {};

async function loadModelsAndAssociations() {
  const files = readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename(__filename) &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

  for (const file of files) {
    const fileUrl = pathToFileURL(join(__dirname, file)).href;
    const modelFactory = (await import(fileUrl)).default;
    const model = modelFactory(sequelize);
    db[model.name] = model;
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
}

const dbReady = loadModelsAndAssociations();

export { sequelize, Sequelize, dbReady };
db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
