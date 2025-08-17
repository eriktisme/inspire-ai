import type { StringParameterProps } from 'aws-cdk-lib/aws-ssm'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import type { Stack } from '../stack'

export const createParameter = (
  stack: Stack,
  id: string,
  props: StringParameterProps
) => {
  return new StringParameter(stack, id, {
    ...props,
    parameterName: `/${stack.region}/${stack.stage}/${stack.projectName}/${stack.serviceName}/${props.parameterName}`,
    stringValue: props.stringValue,
  })
}

export const readParameter = (stack: Stack, name: string) => {
  return StringParameter.fromStringParameterName(
    stack,
    `parameter-${name}`,
    `/${stack.region}/${stack.stage}/${stack.projectName}/${stack.serviceName}/${name}`
  )
}
