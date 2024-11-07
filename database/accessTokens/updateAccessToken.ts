import { db } from "../../db";

export = async (tokenId: number, userId: string, tokenResponse: any) => {
	const accessToken = await db.accessToken.update({
		where: { id: tokenId },
		data: {
			tokenType: tokenResponse.token_type,
			accessToken: tokenResponse.access_token,
			refreshToken: tokenResponse.refresh_token,
			accessTokenExpires: new Date(
				tokenResponse.access_token_expiration * 1000
			),
			refreshTokenExpires: new Date(
				tokenResponse.refresh_token_expiration * 1000
			),
			scope: tokenResponse.scope
		}
	});
	return accessToken;
};
