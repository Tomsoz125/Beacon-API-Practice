import { db } from "../../db";

export = async (user: any, guildIds: string[], accessTokenId: number) => {
	const userDb = await db.beaconUser.create({
		data: {
			userId: user.userId,
			username: user.username,
			usernameFull: user.usernameFull,
			isAnonymous: user.isAnonymous,
			publicKey: user.publicKey,
			privateKey: user.privateKey,
			cloudKey: user.cloudKey,
			banned: user.banned,
			guildIds,
			accessTokenId
		}
	});
	return userDb;
};
