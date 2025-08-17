import type OpenAI from 'openai'
import { z } from 'zod'
import type { LoggerInterface } from '@aws-lambda-powertools/logger/types'

const ConfigSchema = z.object({
  defaultModel: z.string().default('gpt-5'),
})

const config = ConfigSchema.parse({
  defaultModel: process.env.OPENAI_DEFAULT_MODEL,
})

interface Deps {
  logger: LoggerInterface
  openai: OpenAI
}

interface Params {
  // Add any parameters needed for the motivator service
}

export class MotivatorService {
  constructor(protected readonly deps: Deps) {
    //
  }

  async call(_: Params): Promise<null | string> {
    /**
     * TODO:
     *
     * In the near future, I want to add support for different types of life-goals.
     */
    const prompt = `
Generate a motivational quote for someone training for a marathon who needs encouragement to stay consistent.
`
    try {
      const response = await this.deps.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
You are an AI assistant that generates short, powerful, and uplifting daily motivational messages. 
Your tone should be positive, encouraging, and easy to understand. 
Keep the message under 50 words. 
Avoid clichés and instead focus on authentic, modern, and relatable inspiration. 
Never repeat the exact same message twice.
            `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: config.defaultModel,
        temperature: config.defaultModel === 'gpt-5' ? 1: 0.4,
      })

      const result = response.choices[0].message.content

      if (!result) {
        return null
      }

      return result
    } catch (error) {
      this.deps.logger.error('Error generating motivation message:', { error })

      return null
    }
  }
}
