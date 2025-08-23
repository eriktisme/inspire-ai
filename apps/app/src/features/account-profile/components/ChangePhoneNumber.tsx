'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@internal/design-system/components/ui/card'
import { useZodForm } from '@/lib/use-zod-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@internal/design-system/components/ui/form'
import { Input } from '@internal/design-system/components/ui/input'
import { Button } from '@internal/design-system/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { useTransition } from 'react'

const FormSchema = z.object({
  phoneNumber: z.string().min(1),
})

interface Props {
  defaultValues: z.infer<typeof FormSchema>
}

export const ChangePhoneNumber = (props: Props) => {
  const { isLoaded, user } = useUser()

  const [isPending, startTransition] = useTransition()

  const form = useZodForm(FormSchema, {
    defaultValues: props.defaultValues,
  })

  const onSubmit = form.handleSubmit((_) => {
    if (!isLoaded) {
      return
    }

    startTransition(async () => {
      user?.reload()
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Phone Number</CardTitle>
            <CardDescription>Change your phone number.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      type="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              loading={isPending}
              disabled={!form.formState.isValid}
              type="submit"
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
