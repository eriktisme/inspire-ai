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
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

interface Props {
  defaultValues: z.infer<typeof FormSchema>
}

export const Name = (props: Props) => {
  const { isLoaded, user } = useUser()

  const [isPending, startTransition] = useTransition()

  const form = useZodForm(FormSchema, {
    defaultValues: props.defaultValues,
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!isLoaded) {
      return
    }

    startTransition(async () => {
      await user?.update({
        firstName: values.firstName,
        lastName: values.lastName,
      })

      user?.reload()
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Name</CardTitle>
            <CardDescription>Change your name.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        maxLength={32}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        maxLength={32}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
