import { AuthenticationError, UserInputError } from "apollo-server-errors";

import axios from "axios";

import { Context } from "./index";
import { getItem, getItemFromDynamoDBResult } from "./db";

interface Parent {
	id: string;
	friends?: string[];
}

export const checkIsLoggedIn = async (context: Context): Promise<void> => {
	if (!context.userId) {
		throw new AuthenticationError("Must Be Logged In");
	}
	const queryOutput = await getItem("quaesta-users", context.userId);
	const userRecord = getItemFromDynamoDBResult(queryOutput);
	if (!userRecord) {
		throw new AuthenticationError("User Does Not Exist");
	}
};

export const checkIsMe = async (parent: Parent, context: Context): Promise<void> => {
	if (!context.userId || parent.id.toString() !== context.userId) {
		throw new AuthenticationError("Permissions Invalid For Requested Field");
	}
};

export const checkInMyFriends = async (context: Context, friendUsername: string): Promise<void> => {
	const queryOutput = await getItem("quaesta-users", context.userId as string);
	const userRecord = getItemFromDynamoDBResult(queryOutput);
	if (userRecord.username !== friendUsername && !userRecord.friends.includes(friendUsername)) {
		throw new UserInputError("Not Friends With Provided User");
	}
};

export const callTwitch = async (): Promise<any> => {
	if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
		throw Error("Must Define TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET");
	}
	const { data } = await axios.post(
		`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
	);
	return data;
};
