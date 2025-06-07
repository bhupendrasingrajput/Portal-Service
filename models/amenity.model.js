import sequelize from "../config/database.js";
import { INTEGER, STRING, TEXT } from 'sequelize';

const Amenity = sequelize.define('Amenity',
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
        image: {
            type: TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'amenities',
        timestamps: false
    }
);

export default Amenity;