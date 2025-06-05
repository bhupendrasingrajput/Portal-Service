import sequelize from '../config/database.js';
import { STRING, TEXT, UUID, UUIDV4 } from 'sequelize';

const City = sequelize.define('City',
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        name: {
            type: STRING,
            allowNull: false,
        },
        description: {
            type: TEXT,
            allowNull: false
        },
        uploadedBy: {
            type: UUID,
            allowNull: false
        }
    },
    {
        tableName: 'cities',
        timestamps: true
    }
);

export default City;