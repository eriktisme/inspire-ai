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
import { useReverification } from '@clerk/nextjs'
import { PhoneInput } from '@internal/design-system/components/ui/phone-input'
import type { Country } from 'react-phone-number-input'
import { useUpdateProfile } from '../api'
import { toast } from 'sonner'

const FormSchema = z.object({
  phoneNumber: z.string().min(1),
})

interface Props {
  defaultCountry: Country
  defaultValues: z.infer<typeof FormSchema>
}

export const ChangePhoneNumber = (props: Props) => {
  const updateProfile = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        //
      },
    },
  })

  const changePhoneNumber = useReverification((phoneNumber: string) =>
    updateProfile.mutateAsync({
      phoneNumber,
    })
  )

  const form = useZodForm(FormSchema, {
    defaultValues: props.defaultValues,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await changePhoneNumber(values.phoneNumber)

    if (!result.success) {
      toast.error('Failed to update phone number')

      return
    }

    toast('Phone number updated successfully.')
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
              loading={updateProfile.isPending}
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
