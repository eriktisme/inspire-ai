'use client'

import { useMemo } from 'react'
import debounce from 'debounce'
import type {
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  DeepPartialSkipArrayKey,
  DeepPartial,
} from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import useDeepCompareEffect from 'use-deep-compare-effect'

type Props<T extends FieldValues> = {
  defaultValues: DeepPartial<T>
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
}

export const useAutoSave = <T extends FieldValues>({
  defaultValues,
  form,
  onSubmit,
}: Props<T>) => {
  const debouncedSave = useMemo(
    () =>
      debounce(() => {
        form.handleSubmit(onSubmit)()
      }, 500),
    [form, onSubmit]
  )

  const watchedData = useWatch({
    control: form.control,
    defaultValue: defaultValues as DeepPartialSkipArrayKey<T>,
  })

  useDeepCompareEffect(() => {
    if (form.formState.isDirty) {
      debouncedSave()
    }
  }, [watchedData])
}
