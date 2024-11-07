import {
	Client,
	CommandInteraction,
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	Guild,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

export interface CommandObject {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	botPermissions?: bigint[] = [];
	deleted?: boolean = false;
	deferred?: boolean = true;
	enabled?: boolean;
	callback?: (
		client: Client,
		interaction: CommandInteraction & { guild: Guild },
		...args
	) => unknown;
}

export interface SubcommandObject {
	deferred: boolean;
	callback: (
		client: Client,
		interaction: CommandInteraction & { guild: Guild },
		subcommand: CommandInteractionOption<CacheType>,
		...args
	) => unknown;
}

export interface ContextMenuObject {
	data: ContextMenuCommandBuilder;
	deferred?: boolean = true;
	botPermissions?: bigint[] = [];
	enabled?: boolean;
	callback: (
		client: Client,
		interaction: ContextMenuCommandInteraction
	) => unknown;
}
