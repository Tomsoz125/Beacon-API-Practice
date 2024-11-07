import { db } from "../../db";

export = async (userId: string) => {
	return await db.accessToken.findUnique({ where: { userId } });
};
