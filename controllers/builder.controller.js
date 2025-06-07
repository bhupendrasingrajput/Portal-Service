import { Builder, BuilderHistory, BuilderHistoryImage, BuilderEmployee } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';
import sequelize from '../config/database.js';

export const createBuilder = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { name, description, logo, bgImage, uploadedBy, histories, employees } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new ApiError(400, 'Builder name is required!');
        }
        if (!description || typeof description !== 'string' || !description.trim()) {
            throw new ApiError(400, 'Builder description is required!');
        }
        if (!logo || typeof logo !== 'string' || !logo.trim()) {
            throw new ApiError(400, 'Builder logo is required!');
        }
        if (!bgImage || typeof bgImage !== 'string' || !bgImage.trim()) {
            throw new ApiError(400, 'Builder bgImage is required!');
        }
        if (!uploadedBy || typeof uploadedBy !== 'string' || !uploadedBy.trim()) {
            throw new ApiError(400, 'uploadedBy is required!');
        }

        const existingBuilder = await Builder.findOne({ where: { name: name.trim() }, transaction: t });
        if (existingBuilder) throw new ApiError(400, 'Builder with this name already exists.');

        const builder = await Builder.create({
            name: name.trim(),
            description: description.trim(),
            logo: logo.trim(),
            bgImage: bgImage.trim(),
            uploadedBy
        }, { transaction: t });

        if (Array.isArray(histories) && histories.length > 0) {
            const yearMap = new Map();

            for (const history of histories) {
                const { year, description } = history;

                if (!year || !description) {
                    throw new ApiError(400, 'Each history must have year and description.');
                }

                if (yearMap.has(year)) {
                    throw new ApiError(400, `Duplicate year '${year}' found in request.`);
                }

                yearMap.set(year, history);
            }

            const uniqueYears = [...yearMap.keys()];

            const existingHistories = await BuilderHistory.findAll({
                where: {
                    builderId: builder.id,
                    year: uniqueYears,
                },
                attributes: ['year'],
                transaction: t,
            });

            if (existingHistories.length > 0) {
                const existingYears = existingHistories.map(h => h.year).join(', ');
                throw new ApiError(409, `Builder history already exists for year(s): ${existingYears}`);
            }

            const toInsert = uniqueYears.map(year => ({
                year,
                description: yearMap.get(year).description,
                builderId: builder.id
            }));

            const createdHistories = await BuilderHistory.bulkCreate(toInsert, {
                transaction: t,
                returning: true,
            });

            const imagesToCreate = [];

            for (const created of createdHistories) {
                const history = yearMap.get(created.year);
                const urls = Array.isArray(history.images) ? history.images : [];

                for (const url of urls) {
                    imagesToCreate.push({ url, builderHistoryId: created.id });
                }
            }

            if (imagesToCreate.length > 0) {
                await BuilderHistoryImage.bulkCreate(imagesToCreate, { transaction: t });
            }
        }

        if (Array.isArray(employees) && employees.length > 0) {
            const employeesToCreate = [];
            for (const emp of employees) {
                const { name, designation, image } = emp;
                if (!name || !designation || !image) {
                    throw new ApiError(400, 'Each employee must have name, designation, and image.');
                }
                employeesToCreate.push({
                    name: name.trim(),
                    designation: designation.trim(),
                    image: image.trim(),
                    builderId: builder.id
                });
            }
            if (employeesToCreate.length > 0) {
                await BuilderEmployee.bulkCreate(employeesToCreate, { transaction: t });
            }
        }

        await t.commit();
        res.status(201).json({
            success: true,
            message: 'Builder created successfully!',
            builder: builder
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const getAllBuilders = async (req, res, next) => {
    try {
        const { exclude } = req.query;

        const include = exclude ? undefined : [
            { model: BuilderEmployee, as: 'employees', attributes: ['id', 'name', 'designation', 'image'] },
            {
                model: BuilderHistory, as: 'histories',
                attributes: ['id', 'year', 'description'],
                include: [
                    { model: BuilderHistoryImage, as: 'images', attributes: ['url'], }
                ]
            }
        ];

        const builders = await Builder.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: include
        });

        return res.json({
            success: true,
            message: 'Builders Fetched!',
            builders: builders
        })
    } catch (error) {
        next(error);
    }
}

export const getBuilderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { exclude } = req.query;

        const include = exclude ? undefined : [
            { model: BuilderEmployee, as: 'employees', attributes: ['id', 'name', 'designation', 'image'] },
            {
                model: BuilderHistory, as: 'histories',
                attributes: ['id', 'year', 'description'],
                include: [
                    { model: BuilderHistoryImage, as: 'images', attributes: ['url'], }
                ]
            }
        ];

        const builder = await Builder.findByPk(id, {
            include: include
        });

        if (!builder) throw new ApiError(404, 'No Builder Found!');

        return res.json({
            success: true,
            message: 'Builder Fetched!',
            builder: builder
        })
    } catch (error) {
        next(error);
    }
}