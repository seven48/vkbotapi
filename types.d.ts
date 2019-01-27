declare interface BotOptions {
    /** Vk API token */
    token: String;
    /** Bot name */
    alias: String;
    /** VK API version */
    version?: Number;
}

declare interface VKMsg {
}

declare interface VKBot {
}

declare interface LongPollMessage {
}

declare interface BotCommand {
    regexp: RegExp;
    callback: (msg:VKMsg) => void;
}