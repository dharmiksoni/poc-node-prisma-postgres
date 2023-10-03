const GLOBALS = module.exports;

GLOBALS.getRecord = async (db, query, fields = null) => {
    if (fields) {
        return await db.findOne(query, fields);
    }
    const rv = await db.find(query);
    return (rv || []).length === 1 ? rv[0] : null;
}

GLOBALS.ERRORS = {
    API_TOKEN_HEADER_MISSING: {
        error_code: 308,
        status_code: 403,
        message: 'The api token header is missing'
    },
    API_TOKEN_INVALID_SIGNATURE: {
        error_code: 306,
        status_code: 403,
        message: 'The api token has incorrect signature'
    },
    API_TOKEN_USER_INVALID: {
        error_code: 307,
        status_code: 403,
        message: 'The api token user is not valid'
    },
    USER_IS_NOT_AUTHORIZED: {
        error_code: 324,
        status_code: 403,
        message: 'Server Error: User is not authorized'
    },
    SERVER_ERROR: {
        error_code: 325,
        status_code: 500,
        message: 'Internal Server Error: File operation failed'
    },
}

GLOBALS.SCOPES = {
    GOOGLE: {
        Google_scopes: [
            'email',
            'profile',
            'openid',
        ],
    }
}
