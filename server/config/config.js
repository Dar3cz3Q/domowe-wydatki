const config = {
    cookie: {
        cookieName: process.env.COOKIE_NAME,
        secretKey: process.env.SECRET_KEY,
    },
    api: {
        port: Number(process.env.API_PORT)
    },
    client: {
        server: process.env.CLIENT_SERVER,
        port: Number(process.env.CLIENT_PORT)
    },
    database: {
        user: process.env.DATABASE_SERVER_USER,
        password: process.env.DATABASE_SERVER_PASSWORD,
        server: process.env.DATABASE_SERVER_SERVER,
        database: process.env.DATABASE_SERVER_DATABASE,
        port: Number(process.env.DATABASE_SERVER_PORT),
        options: {
            encrypt: false,
            trustServerCertificate: true,
            enableArithAbort: true
        }
    }
}

exports.config = config;