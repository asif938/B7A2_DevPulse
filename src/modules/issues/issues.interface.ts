export interface IIssue {
    title: string;
    description: string;
    type: "bug" | "feature_request";
}
export interface IReporter {
    id: number;
    name: string;
    role: string;
}
export interface IUpdateIssue {
    title?: string;
    description?: string;
    type?: "bug" | "feature_request";
    status?: "open" | "in_progress" | "resolved";
}
