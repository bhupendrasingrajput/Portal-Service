import fs from "fs";
import { Sequelize } from "sequelize";
import config from "../config/index.js";

const { host, port, name, user, password, dialect, logging, sslCertificatePath } = config.database;

let dialectOptions = {};

if (sslCertificatePath) {
    const certificate = fs.readFileSync(sslCertificatePath).toString();
    dialectOptions.ssl = { ca: certificate };
}

const sequelize = new Sequelize(name, user, password, {
    host,
    port,
    dialect,
    logging,
    dialectOptions,
    pool: { max: 3, acquire: 60000, idle: 10000, evict: 10000, },
    retry: {
        max: 5,
        backoffBase: 100,
        backoffExponent: 2,
        match: [
            Sequelize.ConnectionError,
            Sequelize.ConnectionRefusedError,
            Sequelize.ConnectionTimedOutError,
            Sequelize.HostNotReachableError,
            Sequelize.InvalidConnectionError,
        ],
    },
});

export const connectToDatabase = async (retries = 3) => {
    while (retries) {
        try {
            await sequelize.authenticate();
            console.log("✅ Database connected successfully.");
            // await sequelize.sync({ alter: true });
            return;
        } catch (err) {
            console.error(`🐞 Database connection failed. Retries left: ${retries - 1}`, err);
            retries -= 1;
            if (!retries) {
                console.error("🐞 Exhausted all retries. Exiting...");
                process.exit(1);
            }
            console.log("🔄 Retrying database connection in 3 seconds...");
            await new Promise(res => setTimeout(res, 3000));
        }
    }
};

export default sequelize;
