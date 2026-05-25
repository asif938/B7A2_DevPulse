import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let errors: unknown = [];

    if (err instanceof Error) {
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });

};

export default globalErrorHandler;