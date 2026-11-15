//El middleware hedha yhandli different types of errors w yreturni lel client el HTTP status code wel corresponding messages mt3hom, 3odh madima nreturniw generic error 500
const errorMiddleware = (error, req, res, next) => {
    console.error(error);

    let statusCode = 500;
    let message = 'Internal server error';

    //11000 howa el error code mt3 duplicate key error fil MongoDB, donc nconvertiw el error code lel status code 409 (Conflict)
    if (error.code === 11000) {
        statusCode = 409;
        message = 'A record with this value already exists';
    } 
    //Mongose yraj3 error ValidationError ken fama ay validation error fil model, donc nconvertiw el error lel status code 400 (Bad Request)
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    }
    //Mongose yraj3 error CastError ken fama ay invalid ObjectId fil request, donc nconvertiw el error lel status code 400 (Bad Request) 
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid value provided';
    }
    //Ken deja fama statusCode m3a el error, nconvertiw el error lel status code mta3ou wnreturniw el message mta3ou
    else if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
    }

    res.status(statusCode).json({ message });
};

module.exports = errorMiddleware;