import type { Stack } from '../stack'
import type { SecretProps } from 'aws-cdk-lib/aws-secretsmanager'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'

export const createSecret = (stack: Stack, id: string, props: SecretProps) => {
  return new Secret(stack, id, {
    ...props,
    secretName: `/${stack.region}/${stack.stage}/${stack.projectName}/${stack.serviceName}/${props.secretName}`,
  })
}

export const readSecret = (stack: Stack, name: string) => {
  return Secret.fromSecretNameV2(
    stack,
    `parameter-${name}`,
    `/${stack.region}/${stack.stage}/${stack.projectName}/${stack.serviceName}/${name}`
  )
}
