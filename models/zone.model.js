import sequelize from '../config/database.js';
import { ENUM, UUID, UUIDV4 } from 'sequelize';

const Zone = sequelize.define('Zone',
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        name: {
            type: ENUM('south', 'north', 'east', 'west', 'central'),
            unique: true,
            defaultValue: 'central'
        },
        description: {
            type: TEXT,
            allowNull: false
        },
        cityId: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'cities',
                key: 'id'
            }
        }
    },
    {
        tableName: 'zones',
        timestamps: true,
        indexes: [
            { fields: ['cityId'] },
        ]
    }
);

export default Zone;