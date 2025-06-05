import { ENUM, INTEGER, STRING, TEXT, UUID } from "sequelize";
import sequelize from '../config/database.js';

const FAQ = sequelize.define('FAQ',
    {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        question: {
            type: STRING,
            allowNull: false,
        },
        answer: {
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
        //         model: 'litings',
        //         key: 'id',
        //     }
        // },
    },
    {
        tableName: 'faqs',
        timestamps: true,
        // indexes: [
        //     { fields: ['cityId'] },
        //     { fields: ['locationId'] },
        //     { fields: ['cityId', 'locationId'] },
        //     { fields: ['projectId'] },
        //     { fields: ['listingId'] },
        // ]
    }
);

export default FAQ;