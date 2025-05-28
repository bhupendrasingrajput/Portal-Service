const config = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3005,
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: process.env.DB_LOGGING === 'true',
        sslCertificatePath: process.env.DB_SSL_CERT_PATH || null,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    services: {
        authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
        crmService: process.env.CRM_SERVICE_URL || 'http://localhost:3003',
        portalService: process.env.PORTAL_SERVICE_URL || 'http://localhost:3004',
    },
};

export default config;
