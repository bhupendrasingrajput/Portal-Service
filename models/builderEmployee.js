import { ENUM, INTEGER, JSON, STRING, TEXT, UUID, UUIDV4 } from 'sequelize';
import sequelize from '../config/database.js';

const BuilderEmployee = sequelize.define('BuilderEmployee',
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: STRING,
            allowNull: false
        },
        designation: {
            type: STRING,
            allowNull: false
        },
        image: {
            type: TEXT,
            allowNull: false
        },
        builderId: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'builders',
                key: 'id'
            }
        }
    },
    {
        tableName: 'builderEmployees',
        timestamps: false,
    }
);

export default BuilderEmployee;