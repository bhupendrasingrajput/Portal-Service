import Broker from "./broker.model.js";
import City from './city.model.js';
import FAQ from './faq.model.js';
import Feature from './feature.model.js';
import Location from "./location.model.js";
import Media from './media.model.js';
import Zone from './zone.model.js';
import Builder from "./builder.model.js";
import BuilderEmployee from './builderEmployee.js'
import BuilderHistory from "./builderHistory.js";
import BuilderHistoryImage from "./builderHistoryImage.js";
import Amenity from "./amenity.model.js";

// City <-> Zone (One-to-Many)
City.hasMany(Zone, { foreignKey: 'cityId', as: 'zones', onDelete: 'CASCADE' });
Zone.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

// City <-> Location (One-to-Many)
City.hasMany(Location, { foreignKey: 'cityId', as: 'locations', onDelete: 'CASCADE' });
Location.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

// Zone <-> Location (One-to-Many)
Zone.hasMany(Location, { foreignKey: 'zoneId', as: 'locations', onDelete: 'CASCADE' });
Location.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });

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

// One-to-Many: Zone -> Feature, FAQ, Media
Zone.hasMany(Feature, { foreignKey: 'zoneId', as: 'features', onDelete: 'CASCADE' });
Feature.belongsTo(City, { foreignKey: 'zoneId' });

Zone.hasMany(FAQ, { foreignKey: 'zoneId', as: 'faqs', onDelete: 'CASCADE' });
FAQ.belongsTo(City, { foreignKey: 'zoneId' });

Zone.hasMany(Media, { foreignKey: 'zoneId', as: 'media', onDelete: 'CASCADE' });
Media.belongsTo(City, { foreignKey: 'zoneId' });

// One-to-Many: Location -> Feature, FAQ, Media
Location.hasMany(Feature, { foreignKey: 'locationId', as: 'features', onDelete: 'CASCADE' });
Feature.belongsTo(City, { foreignKey: 'locationId' });

Location.hasMany(FAQ, { foreignKey: 'locationId', as: 'faqs', onDelete: 'CASCADE' });
FAQ.belongsTo(City, { foreignKey: 'locationId' });

Location.hasMany(Media, { foreignKey: 'locationId', as: 'media', onDelete: 'CASCADE' });
Media.belongsTo(City, { foreignKey: 'locationId' });

// One-to-Many: Builder -> BuilderHistory
Builder.hasMany(BuilderHistory, { foreignKey: 'builderId', as: 'histories', onDelete: 'CASCADE' });
BuilderHistory.belongsTo(Builder, { foreignKey: 'builderId' });

// One-to-Many: BuilderHistory -> BuilderHistoryImage
BuilderHistory.hasMany(BuilderHistoryImage, { foreignKey: 'builderHistoryId', as: 'images', onDelete: 'CASCADE' });
BuilderHistoryImage.belongsTo(BuilderHistory, { foreignKey: 'builderHistoryId' });

// One-to-Many: Builder -> BuilderEmployee
Builder.hasMany(BuilderEmployee, { foreignKey: 'builderId', as: 'employees', onDelete: 'CASCADE' });
BuilderEmployee.belongsTo(Builder, { foreignKey: 'builderId' });

export {
    Broker,
    City, FAQ, Feature, Location, Media, Zone,
    Builder, BuilderEmployee, BuilderHistory, BuilderHistoryImage,
    Amenity
};
