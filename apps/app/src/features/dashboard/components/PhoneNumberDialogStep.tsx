import { useZodForm } from '@/lib/use-zod-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@internal/design-system/components/ui/form'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@internal/design-system/components/ui/dialog'
import { Button } from '@internal/design-system/components/ui/button'
import { z } from 'zod'
import type { UserOnboardingDialogStepProps } from './UserOnboardingDialog'
import { useUpdateProfile } from '@/features/account-profile'
import { toast } from 'sonner'
import { PhoneInput } from '@internal/design-system/components/ui/phone-input'
import type { Country } from 'react-phone-number-input'

const FormSchema = z.object({
  phoneNumber: z.string().min(1),
})

type Props = UserOnboardingDialogStepProps & {
  defaultCountry: Country
}

export const PhoneNumberDialogStep = (props: Props) => {
  const form = useZodForm(FormSchema, {
    defaultValues: {
      phoneNumber: '',
    },
  })

  const updateProfile = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        //
      },
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await updateProfile.mutateAsync(values)

    if (!result) {
      toast.error('Failed to update phone number. Please try again.')

      return
    }

    props.setCurrentStep('complete')
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>Step 2: Phone Number</DialogTitle>
        <DialogDescription>
          Where should we send your motivational messages?
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
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
          <DialogFooter>
            <Button
              loading={updateProfile.isPending}
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
