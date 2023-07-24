
import { Attachment, Field, SlackMessage } from "./slack.interface";

export class SlackMessageForAccount implements SlackMessage {
    constructor() { }

    text: string;
    attachments: AttachmentForAccount[];
}


class AttachmentForAccount implements Attachment {
    constructor() { }

    pretext: string;
    color: string;
    fields: FieldForAccount[];

    setFields() { }
}

class FieldForAccount implements Field {
    title: string;
    value: string;
    short: boolean;
}

