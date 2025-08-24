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
import { PreferencesSchema } from '../api'
import { useUpdatePreferences } from '../api'
import { useAutoSave } from '@/lib/use-auto-save'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@internal/design-system/components/ui/select'
import type { z } from 'zod'

const defaultFrequency = 'daily'

const FormSchema = PreferencesSchema.omit({
  goals: true,
  themes: true,
})

interface Props {
  preference: z.infer<typeof FormSchema>
}

export const ManageFrequency = (props: Props) => {
  const form = useZodForm(FormSchema, {
    defaultValues: {
      frequency: props.preference.frequency ?? defaultFrequency,
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
      frequency: props.preference.frequency ?? defaultFrequency,
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
          <CardTitle>Manage Frequency</CardTitle>
          <CardDescription>
            Determine how often you want to receive motivational messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message Frequency</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </Form>
  )
}
