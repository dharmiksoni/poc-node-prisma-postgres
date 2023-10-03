
const ErrorUtils = module.exports;


ErrorUtils.APIError = (res, error) => {
    return res.status(error.status_code || 500).send({
        error_code: error.error_code || 399, // 399 is special error code for Generic error
        message: error.message || error,
        data: error.data || null, // this is used to send metadata else it will be null
    });
}

ErrorUtils.getErrorMessage = (error) => {
    let errorObj = error || {};
    return (`${errorObj.name} - ${errorObj.message}`);
};

