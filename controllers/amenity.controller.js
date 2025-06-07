import { Op } from "sequelize";
import { Amenity } from "../models/index.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createAmenity = async (req, res, next) => {
    try {
        const { name, image } = req.body;

        if (!name || !image) throw new ApiError(400, 'Amenity name & image is required!');

        const isExists = await Amenity.findOne({
            where: { name },
            attributes: ['id'],
            raw: true
        });

        if (isExists) throw new ApiError(400, "Amenity with this name already exists!");

        const amenity = await Amenity.create({ name, image });

        return res.json({
            success: true,
            message: "Amenity Created!",
            amenity: amenity
        })
    } catch (error) {
        next(error);
    }
}

export const updateAmenity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;

        if (!id) throw new ApiError(400, 'Amenity id is required!')

        if (!name && !image) throw new ApiError(400, "At least one field (name or image) is required to update.");

        const amenity = await Amenity.findByPk(parseInt(id));
        if (!amenity) throw new ApiError(404, "Amenity not found!");

        if (name) {
            const exists = await Amenity.findOne({
                where: { name, id: { [Op.ne]: id } }
            });
            if (exists) throw new ApiError(400, "Amenity with this name already exists!");
            amenity.name = name;
        }

        if (image) amenity.image = image;

        await amenity.save();

        res.json({
            success: true,
            message: "Amenity updated!",
            amenity
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAmenity = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) throw new ApiError(400, 'Amenity id is required!')

        const amenity = await Amenity.findByPk(parseInt(id), {
            attributes: ['id'],
        });

        if (!amenity) throw new ApiError(404, "Amenity not found!");

        await amenity.destroy();

        res.json({
            success: true,
            message: "Amenity deleted!"
        });
    } catch (error) {
        next(error);
    }
};

export const getAllAmenities = async (req, res, next) => {
    try {
        const amenities = await Amenity.findAll({ order: [['name', 'ASC']] });
        res.json({
            success: true,
            message: 'Amenities Fetched!',
            amenities
        });
    } catch (error) {
        next(error);
    }
};