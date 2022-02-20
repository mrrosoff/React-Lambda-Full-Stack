import "dotenv/config";

import AWS from "aws-sdk";

import { ServiceConfigurationOptions } from "aws-sdk/lib/service";

if (!process.env.AWS_REGION) throw new Error("AWS_REGION Is Not Defined");
if (!process.env.SNS_ENDPOINT) throw new Error("SNS_ENDPOINT Is Not Defined");
if (!process.env.SQS_ENDPOINT) throw new Error("SQS_ENDPOINT Is Not Defined");

const snsServiceConfigOptions: ServiceConfigurationOptions = {
	region: process.env.AWS_REGION,
	endpoint: process.env.SNS_ENDPOINT
};

const sqsServiceConfigOptions: ServiceConfigurationOptions = {
	region: process.env.AWS_REGION,
	endpoint: process.env.SQS_ENDPOINT
};

export const sns = new AWS.SNS(snsServiceConfigOptions);
export const sqs = new AWS.SQS(sqsServiceConfigOptions);
