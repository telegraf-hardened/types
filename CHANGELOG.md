# Changelog

## 10.3.1 (unreleased)

Aligns the 10.3.0 typings with the official Bot API 10.3 specification. Many
10.3.0 types were written against a preliminary reading of the release and did
not match the published API, so this release contains breaking type changes
despite the patch version. Code that compiled against 10.3.0 may need the
updates listed below.

### Breaking changes

#### Polls

- `PollMedia` lost its `type` discriminator. It is now an object with at most
  one of `animation`, `audio`, `document`, `link`, `live_photo`, `location`,
  `photo`, `sticker`, `venue` or `video`, and objects with more than one field
  are rejected. Narrow with a field check such as `media.photo !== undefined`;
  `"photo" in media` does not narrow the field type.
- `Link` only has `url`; `title`, `description` and `photo` were removed.
- `InputPollMedia` is now generic (`InputPollMedia<F>`) and is a union of
  `InputMedia*` types instead of the old `type`/`media` objects. The
  `InputPollMedia.*` namespace was removed.
- `InputPollOption` is now generic (`InputPollOption<F>`); its `media` uses the
  new `InputPollOptionMedia<F>`. Usages without a type argument no longer
  compile.
- `Poll.members_only` is now required.

#### Buttons

- `InlineKeyboardButton.CopyTextButton` was renamed to
  `InlineKeyboardButton.CopyButton` (the top-level `CopyTextButton` object is
  unchanged).
- `disabled` is no longer an optional field on every inline keyboard button. A
  disabled button is the separate `InlineKeyboardButton.DisabledStateButton` /
  `RichMessageButton.DisabledStateButton` variant with `disabled: DisabledButton`.
- `DisabledButton` is now an empty object (`Record<string, never>`); its
  `text`, `icon_custom_emoji_id` and `style` fields were removed.
- `RichMessageButton` no longer has `icon_custom_emoji_id`. Its `text` is now
  `RichMessageButtonText` (plain text, custom emoji or date-time entities) and
  is no longer always a `string`.

#### Replies and ephemeral messages

- `ReplyParameters` is now a union type alias, so it can no longer be used with
  `interface ... extends ReplyParameters`. At least one of `message_id` and
  `ephemeral_message_id` is required.
- `ephemeral_message_id` is now a `number` (was `string`) on `Message`,
  `ReplyParameters` and all ephemeral message methods.
- `editEphemeralMessageText`, `editEphemeralMessageMedia`,
  `editEphemeralMessageCaption`, `editEphemeralMessageReplyMarkup` and
  `deleteEphemeralMessage` now require `receiver_user_id`.

#### Rich messages

- `InputRichBlock<F>` and `InputRichMessage<F>` no longer include
  `InputRichBlockThinking`. Thinking blocks are accepted only by
  `sendRichMessageDraft`; type draft content as `InputRichBlockDraft<F>` /
  `InputRichMessageDraft<F>`.
- `RichBlockTableCell.align` and `valign` are now required.

#### Chats, members and communities

- `ChatFullInfo.accepted_gift_types` is now a required `AcceptedGiftTypes`
  object (was an optional array).
- `ChatFullInfo.personal_chat` is now `Chat.ChannelChat` (was
  `ChatFullInfo.ChannelChat`).
- In `ChatAdministratorRights` and `ChatMemberAdministrator`,
  `can_post_messages`, `can_edit_messages`, `can_pin_messages`,
  `can_manage_topics` and `can_manage_direct_messages` are now optional, and
  `can_send_welcome_messages` is now required.
- `Community` now has `id: number` and `name`; `title`, `photo` and
  `invite_link` were removed.
- `CommunityChatRemoved` no longer has `community`.
- `DirectMessagesTopic.user` is now optional.

#### Bots and business accounts

- `BotAccessSettings` now has `is_access_restricted` and `added_users`;
  `can_manage_without_premium` and `allow_bot_to_bot_messages` were removed.
  `setManagedBotAccessSettings` takes `is_access_restricted` and
  `added_user_ids` instead of `access_settings`.
- `BusinessBotRights.can_delete_outgoing_messages` was renamed to
  `can_delete_sent_messages`.
- `BusinessConnection.can_reply` was removed.
- `getBusinessConnection` and `sendChecklist` now require
  `business_connection_id`; `sendChecklist` only accepts an
  `InlineKeyboardMarkup` as `reply_markup`.

#### Media

- `LivePhoto` is now a video file object (`file_id`, `file_unique_id`, `width`,
  `height`, `duration`, ...) with an optional `photo`; `video` was removed.
- `sendLivePhoto` takes the video as `live_photo` (was `video`), and
  `InputMediaLivePhoto` / `InputPaidMediaLivePhoto` take the static photo as
  `photo` (was `video`).
- `InputMedia<F>` no longer includes `InputMediaSticker`,
  `InputMediaLocation`, `InputMediaVenue`, `InputMediaLink` and
  `InputMediaVoiceNote`.
- `Game.text`, `Game.text_entities` and `Game.animation` are now optional.
- `BackgroundTypeWallpaper.is_blurred` / `is_moving` and
  `BackgroundTypePattern.is_inverted` / `is_moving` are now `?: true` (were
  required `boolean`).

#### Methods

- The deprecated `kickChatMember` and `getChatMembersCount` aliases were
  removed; use `banChatMember` and `getChatMemberCount`.
- `answerChatJoinRequestQuery` takes `chat_join_request_query_id` and
  `result: "approve" | "decline" | "queue"` (was `query_id` and `approve`).
- `sendChatJoinRequestWebApp` takes `chat_join_request_query_id` and
  `web_app_url` (was `query_id` and `web_app`) and returns `true`.
- `answerGuestQuery` takes `result: InlineQueryResult` instead of `text`,
  `parse_mode`, `entities` and `reply_markup`. `SentGuestMessage` now has
  `inline_message_id` instead of `message_id`.
- `deleteMessageReaction` takes `user_id` / `actor_chat_id` instead of
  `reaction`, and `deleteAllMessageReactions` takes `user_id` / `actor_chat_id`
  instead of `message_id`.
- `getUserPersonalChatMessages` requires `limit` and no longer accepts
  `offset`.

#### Service messages

- `GiveawayWinners.is_star_giveaway` moved to `GiveawayCompleted`.
- `SuggestedPostApprovalFailed.price` is now required.
- `DirectMessagePriceChanged.direct_message_star_count` and
  `SentWebAppMessage.inline_message_id` are now optional.
- `WebhookInfo.url` is now required.

### Added

- The `PaidMedia` namespace is now exported, so its variants can be referenced
  as `PaidMedia.PaidMediaPhoto`, `PaidMedia.PaidMediaVideo`, etc.

### Development

- Added type contract tests (`npm test`) that compile positive and negative
  examples against both the sources and the generated declarations, and a CI
  workflow that runs them.
- Replaced the `deno-bin` installer with the official `deno` npm package
  (same version, 2.2.7).
