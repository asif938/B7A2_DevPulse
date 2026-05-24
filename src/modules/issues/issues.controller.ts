import type { NextFunction, Request, Response } from "express";
import { issueService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reporter_id = req.user?.id;
        const result = await issueService.createIssueIntoDB(req.body, reporter_id as number);
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "Issue created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export const issuesController = {
    createIssue,
}