import { Message } from "whatsapp-web.js";

export function shouldIgnoreMessage({
  message,
  message_type,
  chat_type,
}: {
  message: Message;
  message_type: string;
  chat_type: string[];
}): boolean {
  const isWrongType = message.type !== message_type;
  const isFromBot = message.fromMe;
  const isEphemeralOrForwarded = message.isEphemeral || message.isForwarded;
  const isUnwantedMedia =
    message.isGif || message.isStarred || message.isStatus || message.hasMedia;
  const isWrongChatType = !chat_type.some((type) => message.from.includes(type));

  return (
    isWrongType ||
    isFromBot ||
    isEphemeralOrForwarded ||
    isUnwantedMedia ||
    isWrongChatType
  );
}
