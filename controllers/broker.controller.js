import { Broker, City } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';
import { createUser } from '../services/users.service.js';
import sequelize from '../config/database.js';

export const createBroker = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const requiredFields = [
            'name', 'email', 'password', 'phone', 'address', 'pincode',
            'operationAreas', 'firmOwnership', 'firmLogo', 'startedAt', 'cityId'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            throw new ApiError(500, `Missing required fields: ${missingFields.join(', ')}`)
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(req.body.email)) {
            throw new ApiError(400, 'Invalid Email Address!');
        }

        const phoneRegex = /^\d{10,15}$/;

        if (!phoneRegex.test(req.body.phone)) {
            throw new ApiError(400, "Invalid Phone Number!")
        }

        const existing = await Broker.findOne({
            where: {
                [Op.or]: [
                    { email: req.body.email },
                    { phone: req.body.phone }
                ]
            },
            transaction: t
        });

        if (existing) {
            throw new ApiError(400, "This Broker is already exists!");
        }

        if (!Array.isArray(req.body.operationAreas)) {
            throw new ApiError(400, 'Operation Areas must be a non empty array!')
        }

        const citiesCount = await City.count({
            where: { id: req.body.cityId }
        });

        if (citiesCount !== 1) {
            throw new ApiError(400, 'Invalid City Id!');
        }

        const { name, email, phone, password } = req.body;

        const centralUser = await createUser({ name, email, phone, password, service: 'portal' });

        if (!centralUser) throw new ApiError(500, 'Failed to create central user.');

        const brokerInfo = { ...req.body };
        delete brokerInfo.cityId;
        delete brokerInfo.password;

        const broker = await Broker.create(
            { ...brokerInfo },
            { transaction: t }
        );

        if (!broker) {
            throw new ApiError(500, "Broker Can't be created!");
        }

        await broker.setCities(req.body.cityIds, { transaction: t });

        await t.commit();

        res.status(201).json({
            status: 'success',
            message: 'Broker created successfully.',
            broker
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};