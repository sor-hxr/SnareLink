// Central place for icon/asset paths served via Workers Static Assets (./public/icons/).
// Keep filenames in sync with the /public/icons directory.

export const ICONS = {
  loader: '/icons/diamond-loader.gif',
  chatPreLogin: '/icons/circular-icon-of-virtual-assistant.gif',
  chatPostLogin: '/icons/chatbot-head-in-the-round-avatar.gif',
  accountIcon: '/icons/black-ai-agent-avatar-1.gif',
  mailSent: '/icons/3d-fluency-opened-envelope.gif',
  chatError: '/icons/cracked-satellite-dish-no-connection-or-network-failure-problem.gif',
} as const;

// Rotation pool shown inside the open chat window — one is picked at random each time
// the chat window is opened (not on every message, so it doesn't jitter mid-conversation).
export const CHAT_MASCOT_POOL = [
  '/icons/3d-business-black-cute-robot-with-speech-bubble.gif',
  '/icons/3d-business-black-friendly-cute-robot.gif',
  '/icons/3d-business-black-gpt-robot-with-speech-bubble.gif',
  '/icons/3d-business-black-gpt-robot-with-speech-bubble-2.gif',
  '/icons/3d-business-chatbot-using-laptop.gif',
  '/icons/3d-business-cute-robot-with-speech-bubble.gif',
  '/icons/3d-business-friendly-cute-robot.gif',
  '/icons/3d-business-gpt-robot-with-speech-bubble.gif',
  '/icons/black-chatbot-using-laptop.gif',
  '/icons/black-cute-robot-running.gif',
  '/icons/black-cute-robot-standing.gif',
  '/icons/black-cute-robot-using-laptop.gif',
  '/icons/cute-robot-standing-1.gif',
  '/icons/3d-fluency-robot-1.gif',
] as const;
