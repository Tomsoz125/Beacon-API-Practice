import { db } from "../../db";

export = async (userId: string) => {
	return await db.beaconUser.findUnique({ where: { userId } });
};
