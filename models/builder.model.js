import { ENUM, JSON, STRING, TEXT, UUID, UUIDV4 } from 'sequelize';
import sequelize from '../config/database.js';

const Builder = sequelize.define('Builder',
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        name: {
            type: STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: TEXT,
            allowNull: false
        },
        status: {
            type: ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        approval: {
            type: ENUM('pending', 'rejected', 'approved'),
            defaultValue: 'pending'
        },
        logo: {
            type: TEXT,
            allowNull: false
        },
        bgImage: {
            type: TEXT,
            allowNull: false
        },
        remarks: {
            type: JSON,
            allowNull: true
        },
        uploadedBy: {
            type: UUID,
            allowNull: true
        },
        verifiedBy: {
            type: UUID,
            allowNull: true
        }
    },
    {
        tableName: 'builders',
        timestamps: true
    }
);

export default Builder;