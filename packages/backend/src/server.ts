import { createApp } from './app'
import { AUDIO_DIR, PUBLIC_DIR, RATE_LIMIT, RATE_LIMIT_WINDOW, PORT } from './config'
import { ttsPluginManager } from './tts/pluginManager'
import { logger } from './utils/logger'

// 全局错误处理，防止服务器崩溃
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err)
  console.error('Uncaught Exception:', err.message)
  // 不退出进程，让服务器继续运行
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  console.error('Unhandled Rejection:', reason)
  // 不退出进程，让服务器继续运行
})

const app = createApp({
  isDev: process.env.NODE_ENV === 'development',
  rateLimit: RATE_LIMIT,
  rateLimitWindow: RATE_LIMIT_WINDOW,
  audioDir: AUDIO_DIR,
  publicDir: PUBLIC_DIR,
})

app.listen(PORT, async () => {
  try {
    await ttsPluginManager.initializeEngines()
    console.log(`Server running on port ${PORT}`)
    logger.info(`Server started successfully on port ${PORT}`)
  } catch (err) {
    logger.error('Failed to initialize TTS engines:', err)
    console.error('Failed to initialize TTS engines:', err)
  }
})
