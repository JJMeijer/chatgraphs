export interface ViewCountMessage {
    server_time: number;
    type: "viewcount";
    viewers: number;
}
