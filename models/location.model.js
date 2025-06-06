import sequelize from '../config/database.js';
import { JSON, STRING, TEXT, UUID, UUIDV4 } from 'sequelize';

const Location = sequelize.define('Location',
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        name: {
            type: STRING,
            allowNull: false
        },
        description: {
            type: TEXT,
            allowNull: false
        },
        coordinates: {
            type: JSON,
            allowNull: true
        },
        cityId: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'cities',
                key: 'id'
            }
        },
        zoneId: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'zones',
                key: 'id'
            }
        },
        uploadedBy: {
            type: UUID,
            allowNull: false
        }
    },
    {
        tableName: 'locations',
        timestamps: true
    }
);

export default Location;