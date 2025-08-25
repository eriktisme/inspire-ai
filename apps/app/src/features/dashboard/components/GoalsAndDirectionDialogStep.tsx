import { useUpdatePreferences } from '../api'
import { useZodForm } from '@/lib/use-zod-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@internal/design-system/components/ui/form'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@internal/design-system/components/ui/dialog'
import { Button } from '@internal/design-system/components/ui/button'
import type { UserOnboardingDialogStepProps } from './UserOnboardingDialog'
import { toast } from 'sonner'
import { Badge } from '@internal/design-system/components/ui/badge'
import { XIcon } from 'lucide-react'
import { commonGoals, commonThemes } from './ManageGoalsAndDirection'
import { z } from 'zod'

const FormSchema = z.object({
  goals: z.array(z.string()).min(1, 'Please select at least one goal'),
  themes: z.array(z.string()).min(1, 'Please select at least one theme'),
})

export const GoalsAndDirectionDialogStep = (
  props: UserOnboardingDialogStepProps
) => {
  const form = useZodForm(FormSchema, {
    defaultValues: {
      goals: [],
      themes: [],
    },
  })

  const updatePreferences = useUpdatePreferences({
    mutationConfig: {
      onSuccess: () => {
        // Optionally show a success message or perform other actions
      },
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await updatePreferences.mutateAsync(values)

    if (!result) {
      toast.error('Failed to update preferences. Please try again.')

      return
    }

    props.setCurrentStep('phone-number')
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>Step 1: Goals and Direction</DialogTitle>
        <DialogDescription>
          What motivates you? Select your goals and themes.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
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
          <DialogFooter>
            <Button
              loading={updatePreferences.isPending}
              disabled={!form.formState.isValid}
              type="submit"
            >
              Next
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
