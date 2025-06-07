import { ENUM, INTEGER, JSON, STRING, TEXT, UUID, UUIDV4 } from 'sequelize';
import sequelize from '../config/database.js';

const BuilderHistoryImage = sequelize.define('BuilderHistoryImage',
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        url: {
            type: TEXT,
            allowNull: false
        },
        builderHistoryId: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'builderHistories',
                key: 'id'
            }
        }
    },
    { tableName: 'builderHistoryImages', timestamps: false }
);

export default BuilderHistoryImage;