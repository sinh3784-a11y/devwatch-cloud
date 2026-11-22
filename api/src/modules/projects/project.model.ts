export type ProjectStatus = "ACTIVE" | "PAUSED";

export interface Project {
    id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
    createdAt: string;
}