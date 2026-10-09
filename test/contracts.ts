import type {
  Animation,
  ApiMethods,
  Audio,
  Chat,
  ChatFullInfo,
  Document,
  InputMediaLivePhoto,
  InputMediaPhoto,
  InputPollMedia,
  InputPollOption,
  InputRichBlock,
  InputRichBlockDraft,
  InputRichMessage,
  InputRichMessageContent,
  Link,
  LivePhoto,
  Location,
  PhotoSize,
  PollMedia,
  RichMessageButton,
  RichMessageButtonText,
  RichText,
  Sticker,
  Venue,
  Video,
} from "../index";

type PersonalChat = Extract<ChatFullInfo, { type: "private" }>["personal_chat"];
declare const channel: Chat.ChannelChat;
declare const chat: Chat;
declare const receivedPersonalChat: PersonalChat;
const personalChat: PersonalChat = channel;
const personalChatTitle: string | undefined = receivedPersonalChat?.title;
void personalChat;
// @ts-expect-error The personal chat of a user is always a channel.
const notChannel: PersonalChat = chat;
void personalChatTitle;
void notChannel;

const emoji: RichText.CustomEmoji = {
  type: "custom_emoji",
  custom_emoji_id: "123",
  alternative_text: ":)",
};
const dateTime: RichMessageButtonText = {
  type: "date_time",
  text: ["Starts ", emoji, {
    type: "date_time",
    text: "tomorrow",
    unix_time: 1,
    date_time_format: "d",
  }],
  unix_time: 1,
  date_time_format: "d",
};
const button: RichMessageButton = {
  text: ["Event ", dateTime],
  callback_data: "event",
};
void button;

const bold: RichText.Bold = { type: "bold", text: "Not button text" };
// @ts-expect-error Only plain text, custom emoji and date-time are allowed.
const invalidText: RichMessageButtonText = bold;
// @ts-expect-error Arrays must preserve the same restrictions.
const invalidArray: RichMessageButtonText = ["prefix", bold];
// @ts-expect-error Nesting must not bypass the button text restrictions.
const invalidDateTime: RichMessageButtonText = {
  type: "date_time",
  text: ["prefix", {
    type: "date_time",
    text: bold,
    unix_time: 1,
    date_time_format: "d",
  }],
  unix_time: 1,
  date_time_format: "d",
};
void invalidText;
void invalidArray;
void invalidDateTime;

declare const animation: Animation;
declare const audio: Audio;
declare const document: Document;
declare const link: Link;
declare const live_photo: LivePhoto;
declare const location: Location;
declare const photo: PhotoSize[];
declare const sticker: Sticker;
declare const venue: Venue;
declare const video: Video;
const pollMedia: PollMedia[] = [
  {},
  { animation },
  { audio },
  { document },
  { link },
  { live_photo },
  { location },
  { photo },
  { sticker },
  { venue },
  { video },
];
// @ts-expect-error At most one field may be present, including in object literals.
const multipleMedia: PollMedia = { photo, video };
const mixed = { photo, video };
// @ts-expect-error Structural assignment must not bypass mutual exclusion.
const multipleMediaVariable: PollMedia = mixed;
declare const media: PollMedia;
if (media.photo !== undefined) {
  // Checking one field narrows the whole object to that variant.
  const photoMedia: PollMedia.PhotoMedia = media;
  void photoMedia;
}
void pollMedia;
void multipleMedia;
void multipleMediaVariable;

declare const api: ApiMethods<never>;
declare const completed: InputRichMessage<never>;
declare const completedBlock: InputRichBlock<never>;
const reusableBlock: InputRichBlockDraft<never> = completedBlock;
api.sendRichMessageDraft({ chat_id: 1, draft_id: 1, rich_message: completed });
api.sendRichMessageDraft({
  chat_id: 1,
  draft_id: 1,
  rich_message: {
    blocks: [reusableBlock, { type: "thinking", text: "Working" }],
  },
});
const thinking = { type: "thinking", text: "Working" } as const;
const draft = { blocks: [thinking] } as const;
const nestedDraft = {
  blocks: [{
    type: "details",
    summary: "Details",
    blocks: [{
      type: "list",
      items: [{ blocks: [thinking] }],
    }],
  }],
} as const;
api.sendRichMessageDraft({ chat_id: 1, draft_id: 1, rich_message: draft });
api.sendRichMessageDraft({
  chat_id: 1,
  draft_id: 1,
  rich_message: nestedDraft,
});
// @ts-expect-error Thinking is only allowed in drafts.
const normal: InputRichMessage<never> = draft;
// @ts-expect-error Nesting must preserve the draft-only restriction.
const nestedNormal: InputRichMessage<never> = nestedDraft;
// @ts-expect-error Ordinary sends cannot contain a thinking placeholder.
api.sendRichMessage({ chat_id: 1, rich_message: draft });
// @ts-expect-error Inline and guest rich content cannot contain draft blocks.
const inline: InputRichMessageContent = { rich_message: nestedDraft };
// @ts-expect-error Edits cannot introduce a draft-only block.
api.editMessageText({ chat_id: 1, message_id: 1, rich_message: draft });
api.editEphemeralMessageText({
  chat_id: 1,
  receiver_user_id: 2,
  ephemeral_message_id: 1,
  // @ts-expect-error Ephemeral edits cannot introduce a draft-only block.
  rich_message: nestedDraft,
});
void normal;
void nestedNormal;
void inline;

// Positive controls: the same shapes without the thinking block are accepted,
// so the @ts-expect-error cases above fail only because of the draft-only block.
const paragraph = { type: "paragraph", text: "Done" } as const;
const finished = { blocks: [paragraph] } as const;
const nestedFinished = {
  blocks: [{
    type: "details",
    summary: "Details",
    blocks: [{
      type: "list",
      items: [{ blocks: [paragraph] }],
    }],
  }],
} as const;
const normalControl: InputRichMessage<never> = finished;
const nestedNormalControl: InputRichMessage<never> = nestedFinished;
api.sendRichMessage({ chat_id: 1, rich_message: finished });
api.sendRichMessage({ chat_id: 1, rich_message: completed });
const inlineControl: InputRichMessageContent = { rich_message: nestedFinished };
api.editMessageText({ chat_id: 1, message_id: 1, rich_message: finished });
api.editEphemeralMessageText({
  chat_id: 1,
  receiver_user_id: 2,
  ephemeral_message_id: 1,
  rich_message: nestedFinished,
});
void normalControl;
void nestedNormalControl;
void inlineControl;

// Upload paths: with a real InputFile type, F | string fields accept both an
// uploaded file and a string (file_id, URL or attach://<name>).
interface Upload {
  readonly upload: true;
}
declare const upload: Upload;
declare const uploadApi: ApiMethods<Upload>;
uploadApi.sendDocument({
  chat_id: 1,
  document: upload,
  thumbnail: upload,
});
uploadApi.sendDocument({
  chat_id: 1,
  document: "file_id",
  thumbnail: "attach://thumb",
});
uploadApi.sendLivePhoto({ chat_id: 1, live_photo: upload, photo: upload });
const uploadedPhoto: InputMediaPhoto<Upload> = { type: "photo", media: upload };
const uploadedLivePhoto: InputMediaLivePhoto<Upload> = {
  type: "live_photo",
  media: upload,
  photo: "file_id",
};
const pollMediaUpload: InputPollMedia<Upload> = uploadedPhoto;
const pollOptionUpload: InputPollOption<Upload> = {
  text: "Option",
  media: uploadedLivePhoto,
};
uploadApi.sendPoll({
  chat_id: 1,
  question: "Question?",
  media: pollMediaUpload,
  options: [pollOptionUpload, { text: "Other" }],
});
const richUpload: InputRichMessage<Upload> = {
  blocks: [{ type: "photo", photo: uploadedPhoto }],
  media: [{ id: "photo", media: uploadedPhoto }],
};
uploadApi.sendRichMessage({ chat_id: 1, rich_message: richUpload });
// @ts-expect-error Without an InputFile type (F = never) only strings are accepted.
api.sendDocument({ chat_id: 1, document: upload });
// @ts-expect-error Inline rich content can only reference already uploaded files.
const inlineUpload: InputRichMessageContent = { rich_message: richUpload };
void inlineUpload;
