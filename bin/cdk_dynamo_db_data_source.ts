#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkDynamoDbDataSourceStack } from '../lib/cdk_dynamo_db_data_source-stack';

const app = new cdk.App();
new CdkDynamoDbDataSourceStack(app, 'CdkDynamoDbDataSourceStack');
