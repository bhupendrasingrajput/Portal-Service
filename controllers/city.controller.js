import sequelize from '../config/database.js';
import { City, FAQ, Feature, Media } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';

export const createCity = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { name, description, uploadedBy, features, faqs, medias } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new ApiError(400, 'City name is required and must be a non-empty string.');
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            throw new ApiError(400, 'City description is required and must be a non-empty string.');
        }

        if (!uploadedBy || !uploadedBy.trim()) {
            throw new ApiError(400, 'Uploader ID is required!');
        }

        const existing = await City.findOne({ where: { name: name.trim() }, transaction: t });
        if (existing) {
            throw new ApiError(400, 'City with this name already exists.');
        }

        const city = await City.create({
            name: name.trim(),
            description: description.trim(),
            uploadedBy: uploadedBy,
        }, { transaction: t });

        const cityId = city.id;

        if (features && Array.isArray(features) && features.length > 0) {
            const featuresToCreate = features.map(feature => {
                if (!feature.title || !feature.description || !feature.type) {
                    throw new ApiError(400, 'Each feature must have title, description, and type.');
                }
                return {
                    ...feature,
                    cityId: cityId,
                    associatedWith: 'city'
                };
            });
            await Feature.bulkCreate(featuresToCreate, { transaction: t });
        }

        if (faqs && Array.isArray(faqs) && faqs.length > 0) {
            const faqsToCreate = faqs.map(faq => {
                if (!faq.question || !faq.answer) {
                    throw new ApiError(400, 'Each FAQ must have question and answer.');
                }
                return {
                    ...faq,
                    cityId: cityId,
                    associatedWith: 'city'
                };
            });
            await FAQ.bulkCreate(faqsToCreate, { transaction: t });
        }

        if (medias && Array.isArray(medias) && medias.length > 0) {
            const mediasToCreate = medias.map(media => {
                if (!media.type || !media.url) {
                    throw new ApiError(400, 'Each media must have type and url.');
                }
                return {
                    ...media,
                    cityId: cityId,
                    associatedWith: 'city'
                };
            });
            await Media.bulkCreate(mediasToCreate, { transaction: t });
        }

        await t.commit();
        res.status(201).json({ city: city });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const getAllCities = async (req, res, next) => {
    try {
        const cities = await City.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt', 'uploadedBy'] },
            include: [
                { model: Feature, as: 'features', attributes: ['id', 'type', 'title', 'description'] },
                { model: FAQ, as: 'faqs', attributes: ['id', 'question', 'answer'] },
                { model: Media, as: 'media', attributes: ['id', 'type', 'title', 'url'] }
            ],
        });

        const groupedCities = cities.map(city => {
            const cityObj = city.toJSON();
            const groupedFeatures = {};
            if (cityObj.features && Array.isArray(cityObj.features)) {
                cityObj.features.forEach(feature => {
                    if (!groupedFeatures[feature.type]) groupedFeatures[feature.type] = [];
                    groupedFeatures[feature.type].push(feature);
                });
            }
            return {
                ...cityObj,
                features: groupedFeatures
            };
        });

        return res.json({
            success: true,
            message: 'Cities fetched successfully!',
            cities: groupedCities
        })
    } catch (error) {
        next(error);
    }
}