import { ENUM, INTEGER, STRING, TEXT, UUID } from "sequelize";
import sequelize from '../config/database.js';

const Feature = sequelize.define('Feature',
    {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: ENUM('advantage', 'disadvantage', 'history'),
            allowNull: false
        },
        title: {
            type: STRING,
            allowNull: false,
        },
        description: {
            type: TEXT,
            allowNull: false
        },
        associatedWith: {
            type: STRING,
            allowNull: false
        },
        cityId: {
            type: UUID,
            allowNull: true,
            references: {
                model: 'cities',
                key: 'id',
            }
        },
        zoneId: {
            type: UUID,
            allowNull: true,
            references: {
                model: 'zones',
                key: 'id',
            }
        },
        locationId: {
            type: UUID,
            allowNull: true,
            references: {
                model: 'locations',
                key: 'id',
            }
        },
        // projectId: {
        //     type: UUID,
        //     allowNull: true,
        //     references: {
        //         model: 'projects',
        //         key: 'id',
        //     }
        // },
        // listingId: {
        //     type: UUID,
        //     allowNull: true,
        //     references: {
        //         model: 'listings',
        //         key: 'id',
        //     }
        // },
    },
    {
        tableName: 'features',
        timestamps: true,
        // indexes: [
        //     { fields: ['type'] },
        //     { fields: ['cityId'] },
        //     { fields: ['locationId'] },
        //     { fields: ['cityId', 'locationId'] },
        //     { fields: ['projectId'] },
        //     { fields: ['listingId'] },
        // ]
    }
);

export default Feature;