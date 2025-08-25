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
  goals: string[]
  themes: string[]
}

export class MotivatorService {
  constructor(protected readonly deps: Deps) {
    //
  }

  async call(params: Params): Promise<null | string> {
    const prompt = `
Generate a motivational message under 160 characters.
My goals are: ${params.goals.join(', ') ?? 'general well-being'}.
My motivational themes are: ${params.themes.join(', ') ?? 'positivity and resilience'}.
`
    try {
      const response = await this.deps.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
You are an AI assistant that generates short, powerful, and uplifting daily motivational messages.
Constraints:
- Message must be plain English only (no emojis, no special characters).
- Message must be at most 160 characters (fits in one SMS).
- Your tone should be positive, encouraging, and easy to understand.
- Avoid clichés and instead focus on authentic, modern, and relatable inspiration.
- Avoid repetition across different requests.
- Personalize the message based on the user's goals and motivational themes. 
- Never repeat the exact same message twice.
            `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: config.defaultModel,
        temperature: config.defaultModel === 'gpt-5' ? 1 : 0.4,
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
