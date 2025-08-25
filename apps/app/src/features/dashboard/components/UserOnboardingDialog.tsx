'use client'

import {
  Dialog,
  DialogContent,
} from '@internal/design-system/components/ui/dialog'
import { GoalsAndDirectionDialogStep } from './GoalsAndDirectionDialogStep'
import { WelcomeDialogStep } from './WelcomeDialogStep'
import { PhoneNumberDialogStep } from './PhoneNumberDialogStep'
import { useState } from 'react'
import { CompleteOnboardingDialogStep } from './CompleteOnboardingDialogStep'

export type OnboardingStep =
  | 'welcome'
  | 'goals-and-direction'
  | 'phone-number'
  | 'complete'
  | null

export interface UserOnboardingDialogStepProps {
  setCurrentStep: (step: OnboardingStep) => void
}

interface Props {
  onboardingCompleted?: boolean
}

export const UserOnboardingDialog = (props: Props) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    props.onboardingCompleted ? null : 'welcome'
  )

  return (
    <Dialog open={!props.onboardingCompleted && currentStep !== null}>
      <DialogContent showCloseButton={false}>
        {currentStep === 'welcome' ? (
          <WelcomeDialogStep setCurrentStep={setCurrentStep} />
        ) : null}
        {currentStep === 'goals-and-direction' ? (
          <GoalsAndDirectionDialogStep setCurrentStep={setCurrentStep} />
        ) : null}
        {currentStep === 'phone-number' ? (
          <PhoneNumberDialogStep
            defaultCountry="ES"
            setCurrentStep={setCurrentStep}
          />
        ) : null}
        {currentStep === 'complete' ? (
          <CompleteOnboardingDialogStep setCurrentStep={setCurrentStep} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
