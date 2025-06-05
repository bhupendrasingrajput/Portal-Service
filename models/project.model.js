import { UUID, UUIDV4, STRING, JSON, DATE, ENUM } from "sequelize";
import sequelize from '../config/database.js';

const Project = sequelize.define("Project",
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        name: {
            type: STRING,
            allowNull: false
        },
        description: {
            type: JSON,
            allowNull: true
        },
        type: {
            type: STRING,
            allowNull: true
        },
        mapLocation: {
            type: JSON,
            allowNull: true
        },
        pinCode: {
            type: STRING,
            allowNull: false
        },
        rera: {
            type: STRING,
            allowNull: true,
        },
        possessionStatus: {
            type: STRING,
            allowNull: true,
        },
        possessionDate: {
            type: DATE,
            allowNull: true
        },
        status: {
            type: ENUM("active", "inactive"),
            defaultValue: "inactive",
        },
        approvalStatus: {
            type: ENUM("pending", "approved", "rejected"),
            defaultValue: "pending",
        },
        tags: {
            type: ENUM("New Launches", "Featured Properties", "Top Properties", "Upcoming Launches"),
            allowNull: true,
        },
        transactionTags: {
            type: ENUM("sale", "resale", "rent"),
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: 'projects'
    }
);

export default Project;