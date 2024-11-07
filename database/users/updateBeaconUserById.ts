import { db } from "../../db";

export = async (
	userId: string,
	user: any,
	accessTokenId: number,
	guildIds?: string[]
) => {
	const userDb = await db.beaconUser.update({
		where: { userId },
		data: {
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
