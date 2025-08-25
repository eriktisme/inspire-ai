import type { Preview } from '../api'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@internal/design-system/components/ui/card'
import { ClockIcon } from 'lucide-react'

interface Props {
  preview: Preview
}

export const PreviewMessage = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Preview</CardTitle>
        <CardDescription>
          See how your personalized motivational messages will look.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.preview.message}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-neutral-700">
          <ClockIcon className="size-4" />
          <span className="text-sm">Delivered at 7 AM (UTC) every Morning</span>
        </div>
      </CardFooter>
    </Card>
  )
}
