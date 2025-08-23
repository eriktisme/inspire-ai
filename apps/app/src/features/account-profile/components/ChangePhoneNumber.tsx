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
import { Button } from '@internal/design-system/components/ui/button'
import { useUser, useReverification } from '@clerk/nextjs'
import { useTransition } from 'react'
import { PhoneInput } from '@internal/design-system/components/ui/phone-input'
import type { Country } from 'react-phone-number-input'
import type { ClerkAPIResponseError } from '@clerk/types'
import { toast } from 'sonner'

const FormSchema = z.object({
  phoneNumber: z.string().min(1),
})

interface Props {
  defaultCountry: Country
  defaultValues: z.infer<typeof FormSchema>
}

export const ChangePhoneNumber = (props: Props) => {
  const { isLoaded, user } = useUser()

  const [isPending, startTransition] = useTransition()

  const createPhoneNumber = useReverification((phoneNumber: string) =>
    user?.createPhoneNumber({ phoneNumber })
  )

  const form = useZodForm(FormSchema, {
    defaultValues: props.defaultValues,
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!isLoaded) {
      return
    }

    startTransition(async () => {
      try {
        const result = await createPhoneNumber(values.phoneNumber)

        if (!result) {
          /**
           * TODO:
           *
           * - Handle failure
           */
          console.error('Failed to create phone number')

          return
        }

        await user?.reload()

        user?.phoneNumbers.find((phoneNumber) => phoneNumber.id === result.id)
      } catch (e) {
        const error = e as ClerkAPIResponseError

        for (const err of error.errors) {
          if (err.code === 'unsupported_country_code') {
            toast.warning('The country code is not supported')
          }
        }
      }
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
                    <PhoneInput
                      defaultCountry={props.defaultCountry}
                      international
                      {...field}
                      autoComplete="off"
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
