import { ENUM, INTEGER, STRING, TEXT, UUID } from "sequelize";
import sequelize from '../config/database.js';

const Media = sequelize.define('Media',
    {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: ENUM('image', 'video', 'document', 'other'),
            allowNull: false
        },
        title: {
            type: STRING,
            allowNull: false
        },
        url: {
            type: STRING,
            allowNull: false,
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
        tableName: 'media',
        timestamps: true,
        // indexes: [
        //     { fields: ['cityId'] },
        //     { fields: ['locationId'] },
        //     { fields: ['projectId'] },
        //     { fields: ['listingId'] },
        // ]
    }
);

export default Media;