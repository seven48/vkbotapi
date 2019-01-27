declare interface LongPollMessage {
    /** Message code (4 for new messages) */
    [0]: Number;
    /** Message id */
    [1]: Number;
    /** Flags */
    [2]: Number;
    /** Chat room or author id */
    [3]: Number;
    /** Message timestamp */
    [4]: Number;
    /** Room name ' ... ' if private message */
    [5]: String | ' ... ';
    /** Message text */
    [6]: String;
    /** Options */
    [7]: {
        /** Author id if in conversation */
        from?: Number;
    }
}