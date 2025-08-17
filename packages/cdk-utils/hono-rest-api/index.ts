import { Construct } from 'constructs'
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import type { LambdaRestApiProps } from 'aws-cdk-lib/aws-apigateway'
import { Cors, EndpointType, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import type { IPublicHostedZone } from 'aws-cdk-lib/aws-route53'
import { AaaaRecord, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager'
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets'
import type { NodeJSLambdaProps } from '../lambda'
import { NodeJSLambda } from '../lambda'
import type { StackProps } from '../stack'
import type { ClerkProps } from '../types'

export interface HonoRestApiProps
  extends Pick<StackProps, 'projectName' | 'stage' | 'env'> {
  clerk?: ClerkProps
  databaseUrl?: string
  domainName: string
  handlerProps: NodeJSLambdaProps
  hostedZone: IPublicHostedZone
  restApiProps?: Omit<LambdaRestApiProps, 'handler'>
  serviceName: string
}

export class HonoRestApi extends Construct {
  handler: NodeJSLambda

  constructor(scope: Construct, id: string, props: HonoRestApiProps) {
    super(scope, id)

    if (!props.env?.region) {
      throw new Error('Region is required in the environment configuration.')
    }

    let zoneName = `${props.env.region}.${props.domainName}`

    if (props.stage !== 'prod') {
      zoneName = `${props.env.region}/${props.stage}.envs.${props.domainName}`
    }

    this.handler = new NodeJSLambda(this, 'handler', {
      ...props.handlerProps,
      environment: {
        ...props.handlerProps.environment,
        DOMAIN_NAME: zoneName,
        PROJECT_NAME: props.projectName,
        STAGE: props.stage,
      },
    })

    if (props.databaseUrl) {
      this.handler.addEnvironment('DATABASE_URL', props.databaseUrl)
    }

    if (props.clerk) {
      this.handler.addEnvironment(
        'CLERK_PUBLISHABLE_KEY',
        props.clerk.publishableKey
      )
      this.handler.addEnvironment('CLERK_SECRET_KEY', props.clerk.secretKey)
    }

    this.handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })

    const restApi = new LambdaRestApi(this, 'api', {
      ...props.restApiProps,
      defaultCorsPreflightOptions: {
        allowCredentials: true,
        allowHeaders: [
          'Authorization',
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
        allowMethods: Cors.ALL_METHODS,
        allowOrigins: props.restApiProps?.defaultCorsPreflightOptions
          ?.allowOrigins ?? [
          `https://app.${zoneName}`,
          'http://localhost:3000',
        ],
      },
      deployOptions: {
        tracingEnabled: true,
      },
      endpointTypes: [EndpointType.REGIONAL],
      handler: this.handler,
      restApiName: `${props.env.region}-${props.stage}-${props.projectName}-${props.serviceName}-api`,
    })

    const domainName = `${props.serviceName}.${zoneName}`

    const certificate = new Certificate(this, 'certificate', {
      domainName,
      validation: CertificateValidation.fromDns(props.hostedZone),
    })

    restApi.addDomainName('default', {
      certificate,
      domainName,
    })

    new ARecord(this, 'api-a', {
      recordName: domainName,
      zone: props.hostedZone,
      target: RecordTarget.fromAlias(new ApiGateway(restApi)),
    })

    new AaaaRecord(this, 'api-aaaa', {
      recordName: domainName,
      zone: props.hostedZone,
      target: RecordTarget.fromAlias(new ApiGateway(restApi)),
    })
  }
}
