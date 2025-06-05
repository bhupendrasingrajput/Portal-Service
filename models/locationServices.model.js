import { INTEGER, STRING, UUID } from "sequelize";
import sequelize from "../config/database.js";

const LocationServices = sequelize.define('LocationServices',
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category: { //  e.g Entertainment, Connectivity, etc
            type: STRING,
            allowNull: false,
        },
        type: { // e.g., 'Movie Theater', 'Hospital', 'Airport'
            type: STRING,
            allowNull: false,
        },
        name: { // e.g., 'Phoenix Marketcity PVR', 'Columbia Asia Hospital', 'Pune International Airport'
            type: STRING,
            allowNull: false
        },
        meta: {
            type: JSON,
            allowNull: true
        },
        locationId: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'locations',
                key: 'id'
            }
        }
    },
    {
        tableName: 'location_sevices',
        timestamps: false,
        indexes: [
            { fields: ['locationId'] },
        ]
    }
);

export default LocationServices;