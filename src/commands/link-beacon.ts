import {
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder
} from "discord.js";
import { CommandObject } from "../../typings";
import generateBeaconOAuthUrl from "../utils/beacon/generateBeaconOAuthUrl";

export = {
	data: new SlashCommandBuilder()
		.setName("link-beacon")
		.setDescription("Authorises the bot to access your beacon account!")
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	deferred: true,
	botPermissions: [PermissionFlagsBits.EmbedLinks],
	enabled: true,
	async callback(client, interaction, ...args) {
		const oAuthUrl = await generateBeaconOAuthUrl(interaction.user.id);
		return await interaction.editReply({
			content: `[Click here](${oAuthUrl.url}) to allow the bot to access your beacon account!`
		});
	}
} as CommandObject;
