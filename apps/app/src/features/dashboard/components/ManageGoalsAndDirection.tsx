'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@internal/design-system/components/ui/card'
import { useZodForm } from '@/lib/use-zod-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@internal/design-system/components/ui/form'
import { Badge } from '@internal/design-system/components/ui/badge'
import { XIcon } from 'lucide-react'
import { PreferencesSchema } from '../api'
import { useUpdatePreferences } from '../api'
import { useAutoSave } from '@/lib/use-auto-save'
import type { z } from 'zod'

const commonThemes = [
  'Fitness & Health',
  'Career Growth',
  'Mindfulness',
  'Productivity',
  'Relationships',
  'Personal Development',
  'Financial Goals',
  'Creativity',
]

const commonGoals = [
  'Run a marathon',
  'Build a startup',
  'Learn a new language',
  'Get promoted',
  'Lose weight',
  'Save money',
  'Read more books',
  'Improve relationships',
  'Start a side hustle',
  'Learn to code',
  'Travel more',
  'Eat healthier',
]

const FormSchema = PreferencesSchema.omit({
  frequency: true,
})

interface Props {
  preference: z.infer<typeof FormSchema>
}

export const ManageGoalsAndDirection = (props: Props) => {
  const form = useZodForm(FormSchema, {
    defaultValues: {
      goals: props.preference.goals,
      themes: props.preference.themes,
    },
  })

  const updatePreferences = useUpdatePreferences({
    mutationConfig: {
      onSuccess: () => {
        // Optionally show a success message or perform other actions
      },
    },
  })

  useAutoSave({
    defaultValues: {
      goals: props.preference.goals,
      themes: props.preference.themes,
    },
    form,
    onSubmit: (data) => {
      updatePreferences.mutate(data)
    },
  })

  return (
    <Form {...form}>
      <Card>
        <CardHeader>
          <CardTitle>Manage Goals and Direction</CardTitle>
          <CardDescription>
            Define your personal goals and motivational themes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Goals</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-3">
                    {commonGoals.map((goal) => {
                      const isSelected = field.value.includes(goal)

                      return (
                        <Badge
                          key={`common-goal-${goal}`}
                          variant={isSelected ? 'default' : 'secondary'}
                          className={isSelected ? '' : 'hover:cursor-pointer'}
                          onClick={() => {
                            if (!isSelected) {
                              field.onChange([...field.value, goal])
                            }
                          }}
                        >
                          <span className="select-none">{goal}</span>
                          {isSelected ? (
                            <span>
                              <XIcon
                                onClick={() => {
                                  const newGoals = field.value.filter(
                                    (g) => g !== goal
                                  )

                                  field.onChange(newGoals)
                                }}
                                className="size-3 hover:cursor-pointer"
                              />
                            </span>
                          ) : null}
                        </Badge>
                      )
                    })}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="themes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivational Themes</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-3">
                    {commonThemes.map((theme) => {
                      const isSelected = field.value.includes(theme)

                      return (
                        <Badge
                          key={`common-theme-${theme}`}
                          variant={isSelected ? 'default' : 'secondary'}
                          className={isSelected ? '' : 'hover:cursor-pointer'}
                          onClick={() => {
                            if (!isSelected) {
                              field.onChange([...field.value, theme])
                            }
                          }}
                        >
                          <span className="select-none">{theme}</span>
                          {isSelected ? (
                            <span>
                              <XIcon
                                onClick={() => {
                                  const newGoals = field.value.filter(
                                    (g) => g !== theme
                                  )

                                  field.onChange(newGoals)
                                }}
                                className="size-3 hover:cursor-pointer"
                              />
                            </span>
                          ) : null}
                        </Badge>
                      )
                    })}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </Form>
  )
}
