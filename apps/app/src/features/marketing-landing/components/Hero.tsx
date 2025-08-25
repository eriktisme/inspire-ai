import Link from 'next/link'
import { Button } from '@internal/design-system/components/ui/button'

export const Hero = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 lg:p-0">
      <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:max-w-4xl md:text-6xl lg:leading-loose">
        Daily Motivation
      </h1>
      <p className="mt-2 max-w-xl text-balance text-center text-neutral-700 md:mt-0 md:max-w-2xl md:text-lg dark:text-white">
        Personalized messages that keep you focused on your goals.
      </p>
      <Link href="/auth/sign-up">
        <Button className="mt-8">Get Started for Free</Button>
      </Link>
    </div>
  )
}
