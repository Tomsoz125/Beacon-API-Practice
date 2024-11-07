import { Client, IntentsBitField, Partials } from "discord.js";
import config from "../config.ts";
import eventHandler from "./handlers/eventHandler";

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.DirectMessages
	],
	partials: [Partials.Channel]
});

eventHandler(client);

client.login(config.botToken);
