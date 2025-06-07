import sequelize from '../config/database.js';
import { City, FAQ, Feature, Media, Zone } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';

export const createZone = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { name, description, cityId, features, faqs, medias, uploadedBy } = req.body;

        const allowedZones = ['south', 'north', 'east', 'west', 'central'];

        if (!name || !allowedZones.includes(name.toLowerCase())) {
            throw new ApiError(400, 'Zone name is required and must be one of: south, north, east, west, central.');
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            throw new ApiError(400, 'Zone description is required and must be a non-empty string.');
        }

        if (!cityId || typeof cityId !== 'string' || !cityId.trim()) {
            throw new ApiError(400, 'cityId is required and must be a valid UUID.');
        }

        if (!uploadedBy || !uploadedBy.trim()) {
            throw new ApiError(400, 'Uploader ID is required!');
        }

        const city = await City.findByPk(cityId, { transaction: t });

        if (!city) throw new ApiError(404, 'City not found.');

        const existing = await Zone.findOne({ where: { name: name.trim(), cityId }, transaction: t });

        if (existing) {
            throw new ApiError(400, 'Zone with this name already exists in the specified city.');
        }

        const zone = await Zone.create({
            name: name.toLowerCase(),
            description: description.trim(),
            cityId,
            uploadedBy: uploadedBy,
        }, { transaction: t });

        const zoneId = zone.id;

        if (features && Array.isArray(features) && features.length > 0) {
            const featuresToCreate = features.map(feature => {
                if (!feature.title || !feature.description || !feature.type) {
                    throw new ApiError(400, 'Each feature must have title, description, and type.');
                }
                return {
                    ...feature,
                    zoneId,
                    associatedWith: 'zone'
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
                    zoneId,
                    associatedWith: 'zone'
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
                    zoneId,
                    associatedWith: 'zone'
                };
            });
            await Media.bulkCreate(mediasToCreate, { transaction: t });
        }

        await t.commit();
        res.status(201).json({
            success: true,
            message: 'Zone created!',
            zone
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const getAllZones = async (req, res, next) => {
    try {
        const { cityId, exclude } = req.query;

        if (!cityId) {
            throw new ApiError(400, 'City ID is required!');
        }

        const city = await City.findByPk(cityId, {
            attributes: ['id'],
            raw: true
        });

        if (!city) throw new ApiError(404, 'No valid city found!');

        const include = exclude ? undefined : [
            { model: Feature, as: 'features', attributes: ['id', 'type', 'title', 'description'] },
            { model: FAQ, as: 'faqs', attributes: ['id', 'question', 'answer'] },
            { model: Media, as: 'media', attributes: ['id', 'type', 'title', 'url'] }
        ];

        const zones = await Zone.findAll({
            where: { cityId },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: include
        });

        const groupedZones = zones?.map(zone => {
            const zoneObj = zone.toJSON();
            const groupedFeatures = {};
            if (zoneObj.features && Array.isArray(zoneObj.features)) {
                zoneObj.features.forEach(feature => {
                    if (!groupedFeatures[feature.type]) groupedFeatures[feature.type] = [];
                    groupedFeatures[feature.type].push(feature);
                });
            }
            return {
                ...zoneObj,
                features: groupedFeatures
            };
        });

        return res.json({
            success: true,
            message: 'Zones Fetched!',
            zones: groupedZones
        })

    } catch (error) {
        next(error);
    }
}
