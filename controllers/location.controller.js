import { Location, Feature, FAQ, Media, City, Zone } from '../models/index.model.js';
import sequelize from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';

export const createLocation = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { name, description, coordinates, cityId, zoneId, features, faqs, medias, uploadedBy } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new ApiError(400, 'Location name is required and must be a non-empty string.');
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            throw new ApiError(400, 'Location description is required and must be a non-empty string.');
        }

        if (!cityId || typeof cityId !== 'string' || !cityId.trim()) {
            throw new ApiError(400, 'cityId is required and must be a valid UUID.');
        }

        if (!zoneId || typeof zoneId !== 'string' || !zoneId.trim()) {
            throw new ApiError(400, 'zoneId is required and must be a valid UUID.');
        }

        if (!uploadedBy || !uploadedBy.trim()) {
            throw new ApiError(400, 'Uploader ID is required!');
        }

        const zone = await Zone.findOne({
            where: {
                id: zoneId,
                cityId: cityId
            }
        });

        if (!zone) {
            throw new ApiError(404, 'City and Zone are not associated with each other!')
        }

        const existing = await Location.findOne({ where: { name: name.trim(), cityId }, transaction: t });

        if (existing) {
            throw new ApiError(400, 'Location with this name already exists in the specified city.');
        }

        const location = await Location.create({
            name: name.trim(),
            description: description.trim(),
            coordinates: coordinates || null,
            cityId: cityId,
            zoneId: zoneId,
            uploadedBy: uploadedBy,
        }, { transaction: t });

        const locationId = location.id;

        if (features && Array.isArray(features) && features.length > 0) {
            const featuresToCreate = features.map(feature => {
                if (!feature.title || !feature.description || !feature.type) {
                    throw new ApiError(400, 'Each feature must have title, description, and type.');
                }
                return {
                    ...feature,
                    locationId,
                    associatedWith: 'location'
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
                    locationId,
                    associatedWith: 'location'
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
                    locationId,
                    associatedWith: 'location'
                };
            });
            await Media.bulkCreate(mediasToCreate, { transaction: t });
        }

        await t.commit();
        res.status(201).json({
            success: true,
            message: 'Location created!',
            location
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const getAllLocations = async (req, res, next) => {
    try {
        const { cityId, exclude } = req.query;

        if (!cityId) throw new ApiError(400, "City Id is required!");

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

        const locations = await Location.findAll({
            where: { cityId },
            attributes: ['id', 'name', 'description', 'coordinates'],
            include: include
        })

        const groupedLocations = locations?.map(location => {
            const locationObj = location.toJSON();
            const groupedFeatures = {};
            if (locationObj.features && Array.isArray(locationObj.features)) {
                locationObj.features.forEach(feature => {
                    if (!groupedFeatures[feature.type]) groupedFeatures[feature.type] = [];
                    groupedFeatures[feature.type].push(feature);
                });
            }
            return {
                ...locationObj,
                features: groupedFeatures
            };
        });

        return res.json({
            success: true,
            message: 'Locations fetched!',
            locations: groupedLocations
        })
    } catch (error) {
        next(error);
    }
}