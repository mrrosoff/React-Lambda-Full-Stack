import "dotenv/config";

import AWS from "aws-sdk";

import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import {
	DeleteItemOutput,
	GetItemOutput,
	PutItemOutput,
	QueryOutput,
	UpdateItemOutput
} from "aws-sdk/clients/dynamodb";

import User from "./User/type";

export const BaseGameAPI = "https://api.igdb.com/v4";

type DynamoDBResult =
	| GetItemOutput
	| QueryOutput
	| PutItemOutput
	| UpdateItemOutput
	| DeleteItemOutput;

if (!process.env.AWS_REGION) throw new Error("AWS_REGION Is Not Defined");
if (!process.env.DDB_ENDPOINT) throw new Error("DDB_ENDPOINT Is Not Defined");

const serviceConfigOptions: ServiceConfigurationOptions = {
	region: process.env.AWS_REGION,
	endpoint: process.env.DDB_ENDPOINT
};

export const documentClient = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);

export const getItem = async (table: string, id: string): Promise<GetItemOutput> => {
	try {
		return await documentClient.get({ TableName: table, Key: { id } }).promise();
	} catch (err) {
		console.error(err);
		throw Error("DynamoDB Get Call Failed");
	}
};

export const getItemsByIndex = async (
	table: string,
	key: string,
	value: string
): Promise<QueryOutput> => {
	try {
		return await documentClient
			.query({
				TableName: table,
				IndexName: key,
				KeyConditionExpression: "#indexKey = :value",
				ExpressionAttributeNames: { "#indexKey": key },
				ExpressionAttributeValues: { ":value": value }
			})
			.promise();
	} catch (err) {
		console.error(err);
		throw Error("DynamoDB Query Call Failed");
	}
};

export const putItem = async (table: string, item: Object): Promise<PutItemOutput> => {
	try {
		return await documentClient
			.put({ TableName: table, Item: item, ReturnValues: "ALL_OLD" })
			.promise();
	} catch (err) {
		console.error(err);
		throw Error("DynamoDB Put Call Failed");
	}
};

export const updateItem = async (
	table: string,
	id: string,
	key: string,
	value: string
): Promise<UpdateItemOutput> => {
	try {
		return await documentClient
			.update({
				TableName: table,
				Key: { id },
				UpdateExpression: "set #updateKey = :value",
				ExpressionAttributeNames: { "#updateKey": key },
				ExpressionAttributeValues: { ":value": value },
				ReturnValues: "ALL_NEW"
			})
			.promise();
	} catch (err) {
		console.error(err);
		throw Error("DynamoDB Update Call Failed");
	}
};

export const deleteItem = async (table: string, id: string): Promise<DeleteItemOutput> => {
	try {
		return await documentClient
			.delete({ TableName: table, Key: { id }, ReturnValues: "ALL_OLD" })
			.promise();
	} catch (err) {
		console.error(err);
		throw Error("DynamoDB Delete Call Failed");
	}
};

export const getItemFromDynamoDBResult = (dynamodbResult: DynamoDBResult): User => {
	if ("Item" in dynamodbResult && dynamodbResult.Item) {
		return dynamodbResult.Item as unknown as User;
	}
	if ("Items" in dynamodbResult && dynamodbResult.Items) {
		return dynamodbResult.Items[0] as unknown as User;
	}
	if ("Attributes" in dynamodbResult && dynamodbResult.Attributes) {
		return dynamodbResult.Attributes as unknown as User;
	}
	throw Error("Invalid Parameter To GetItemFromDynamoDBResult");
};
