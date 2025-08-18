#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { Engine } from '../lib'
import { projectName } from '@internal/cdk-utils'
import { RootStack } from '@internal/cdk-utils/root-stack'

const app = new App({
  analyticsReporting: false,
})

const stage = app.node.tryGetContext('stage') ?? 'prod'

new RootStack(app, 'engine', {
  crossRegionReferences: true,
  env: {
    region: 'eu-west-1',
  },
  projectName,
  regions: ['eu-west-1'],
  service: {
    props: {
      serviceName: 'engine',
      projectName,
      stage,
      openai: {
        apiKey: process.env.OPENAI_API_KEY as string,
      },
      twilio: {
        authToken: process.env.TWILIO_AUTH_TOKEN as string,
        accountSid: process.env.TWILIO_ACCOUNT_SID as string,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER as string,
      },
    },
    stack: Engine,
  },
  stage,
})
