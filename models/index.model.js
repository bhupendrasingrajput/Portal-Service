import Broker from "./broker.model.js";
import City from './city.model.js';
import Feature from './feature.model.js';
import FAQ from './faq.model.js';
import Media from './media.model.js';
import Location from "./location.model.js";

// Many-to-Many: Broker <-> City
Broker.belongsToMany(City, { through: 'brokerOperatedCities', foreignKey: 'brokerId', otherKey: 'cityId' });
City.belongsToMany(Broker, { through: 'brokerOperatedCities', foreignKey: 'cityId', otherKey: 'brokerId' });

// One-to-Many: City -> Feature, FAQ, Media
City.hasMany(Feature, { foreignKey: 'cityId', as: 'features', onDelete: 'CASCADE' });
Feature.belongsTo(City, { foreignKey: 'cityId' });

City.hasMany(FAQ, { foreignKey: 'cityId', as: 'faqs', onDelete: 'CASCADE' });
FAQ.belongsTo(City, { foreignKey: 'cityId' });

City.hasMany(Media, { foreignKey: 'cityId', as: 'media', onDelete: 'CASCADE' });
Media.belongsTo(City, { foreignKey: 'cityId' });

export {
    Broker,
    City,
    Feature,
    FAQ,
    Media,
    Location
};