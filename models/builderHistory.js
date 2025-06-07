import { ENUM, INTEGER, JSON, STRING, TEXT, UUID, UUIDV4 } from 'sequelize';
import sequelize from '../config/database.js';

const BuilderHistory = sequelize.define('BuilderHistory',
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        year: {
            type: STRING,
            allowNull: false
        },
        description: {
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
        tableName: 'builderHistories',
        timestamps: false,
        indexes: [
            { unique: true, fields: ['builderId', 'year'] }
        ]
    }
);

export default BuilderHistory;