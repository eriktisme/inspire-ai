import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@internal/design-system/components/ui/dialog'
import { Button } from '@internal/design-system/components/ui/button'
import { useCallback, useTransition } from 'react'
import { useUser } from '@clerk/nextjs'
import type { UserOnboardingDialogStepProps } from './UserOnboardingDialog'

export const CompleteOnboardingDialogStep = (
  props: UserOnboardingDialogStepProps
) => {
  const { isLoaded, user } = useUser()

  const [isPending, startTransition] = useTransition()

  const onConfirm = useCallback(() => {
    if (!isLoaded) {
      return
    }

    startTransition(async () => {
      await user?.update({
        unsafeMetadata: { onboardingCompleted: true },
      })

      await user?.reload()

      props.setCurrentStep(null)
    })
  }, [isLoaded, props, user])

  return (
    <>
      <DialogHeader>
        <DialogTitle>Onboarding Completed</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <p>
          Congratulations! Your account is now fully configured and ready to
          inspire you.
        </p>
        <p>
          You&#39;ll start receiving personalized motivational messages based on
          your goals and themes tomorrow!
        </p>
      </div>
      <DialogFooter>
        <Button loading={isPending} onClick={onConfirm} type="submit">
          Complete
        </Button>
      </DialogFooter>
    </>
  )
}
