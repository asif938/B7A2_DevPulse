import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const signUpUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.signInUserIntoDB(req.body);
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

export const authController = {
    signUpUser,
}