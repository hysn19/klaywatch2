export interface SlackMessage {
    text: string;
    attachments: Attachment[];
}

export interface Attachment {
    pretext: string;
    color: string;
    fields: Field[];
}

export interface Field {
    title: string;
    value: string;
    short: boolean;
}