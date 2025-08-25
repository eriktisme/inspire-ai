import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@internal/design-system/components/ui/dialog'
import { Button } from '@internal/design-system/components/ui/button'
import type { UserOnboardingDialogStepProps } from './UserOnboardingDialog'

export const WelcomeDialogStep = (props: UserOnboardingDialogStepProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Welcome to Inspire</DialogTitle>
        <DialogDescription>
          Let&#39;s set up your personalized experience.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        <p>
          We&#39;re here to help you stay motivated and achieve your goals
          through personalized messages.
        </p>
      </div>
      <DialogFooter>
        <Button
          onClick={() => props.setCurrentStep('goals-and-direction')}
          type="submit"
        >
          Get started
        </Button>
      </DialogFooter>
    </>
  )
}
