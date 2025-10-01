enum ChatType {
  USER_CHAT = "user_chat",
  GROUP_CHAT = "group_chat",
  CHANNEL_CHAT = "channel_chat",
  BOT_CHAT = "bot_chat",
}

export const enum Role {
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  ASSISTANT  = 'ASSISTANT',
  STUDENT = 'STUDENT'
}

export const enum Action {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export const enum EmailCodeEnum  {
  REGISTER = "register",
  RESET_PASSWORD = "reset_password",
}