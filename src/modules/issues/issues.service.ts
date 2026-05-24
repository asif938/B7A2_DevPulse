import { pool } from "../../db";
import type { IIssue, IReporter } from "./issues.interface";

const createIssueIntoDB = async(payload: IIssue, reporter_id: number) => {
    const {title, description, type} = payload;

    const result = await pool.query(
        `INSERT INTO issues (
        title,
        description,
        type,
        reporter_id
        ) VALUES ($1, $2, $3, $4) 
        RETURNING * 
        `,
        [title, description, type, reporter_id]
    )
    return result.rows[0];
}

const getAllIssuesFromDB = async (
    query: Record<string, string>
) => {
    const sort = query.sort || "newest";
    const type = query.type;
    const status = query.status;

    let sqlQuery = `
        SELECT *
        FROM issues
    `;

    const conditions: string[] = [];
    const values: string[] = [];

    if (type) {
        values.push(type);
        conditions.push(
            `type = $${values.length}`
        );

    }

    if (status) {
        values.push(status);
        conditions.push(
            `status = $${values.length}`
        );

    }

    if (conditions.length > 0) {
        sqlQuery += `
            WHERE ${conditions.join(" AND ")}
        `;

    }

    sqlQuery += `
        ORDER BY created_at
    `;

    if (sort === "oldest") {
        sqlQuery += ` ASC`;
    } else {
        sqlQuery += ` DESC`;
    }


    const issuesResult = await pool.query(
        sqlQuery,
        values
    );

    const issues = issuesResult.rows;

    const reporterIds = [
        ...new Set(
            issues.map(
                issue => issue.reporter_id
            )
        )
    ];

    // let reporters: any[] = [];
    let reporters: IReporter[] = [];

    if (reporterIds.length > 0) {
        const reportersResult = await pool.query(
            `
            SELECT
                id,
                name,
                role
            FROM users
            WHERE id = ANY($1)
            `,
            [reporterIds]
        );

        reporters = reportersResult.rows;

    }

    const issuesWithReporters = issues.map(
        issue => {
            const reporter = reporters.find(
                user => user.id === issue.reporter_id
            );

            return {
                id: issue.id,
                title: issue.title,
                description: issue.description,
                type: issue.type,
                status: issue.status,

                reporter: reporter || null,

                created_at: issue.created_at,
                updated_at: issue.updated_at,
            };

        }
    );

    return issuesWithReporters;
};

export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB
}