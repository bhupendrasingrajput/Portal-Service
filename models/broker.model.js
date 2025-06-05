import { BOOLEAN, DATE, ENUM, INTEGER, JSON, STRING, TEXT, UUID, UUIDV4 } from "sequelize";
import sequelize from '../config/database.js';

const Broker = sequelize.define("Broker", {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    name: {
        type: STRING,
        allowNull: false
    },
    email: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
    alternatePhone: {
        type: STRING,
        allowNull: true,
    },
    profilePhoto: {
        type: TEXT,
        allowNull: true
    },
    address: {
        type: TEXT,
        allowNull: false
    },
    pincode: {
        type: STRING,
        allowNull: false
    },
    annualIncome: {
        type: STRING,
        allowNull: true,
    },
    operationAreas: {
        type: JSON,
        allowNull: false
    },
    firmName: {
        type: STRING,
        allowNull: true
    },
    firmOwnership: {
        type: STRING,
        allowNull: false
    },
    rera: {
        type: STRING,
        allowNull: true,
    },
    teamSize: {
        type: INTEGER,
        allowNull: true,
    },
    firmAddress: {
        type: STRING,
        allowNull: true
    },
    firmDescription: {
        type: TEXT,
        allowNull: true
    },
    mission: {
        type: TEXT,
        allowNull: true
    },
    vision: {
        type: TEXT,
        allowNull: true
    },
    officePhoto: {
        type: TEXT,
        allowNull: true
    },
    firmLogo: {
        type: TEXT,
        allowNull: false
    },
    startedAt: {
        type: DATE,
        allowNull: false
    },
    status: {
        type: ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    isVerified: {
        type: BOOLEAN,
        defaultValue: false
    },
    centralUserId: {
        type: UUID,
        unique: true,
        allowNull: false
    },
}, {
    tableName: 'brokers',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['centralUserId'] },
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['phone'] },
    ]
})

export default Broker;