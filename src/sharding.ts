import { ShardingManager } from "discord.js";
import path from "path";
import config from "../config.ts";

const manager = new ShardingManager(path.join(__dirname, "bot.ts"), {
	totalShards: config.sharding.totalShards,
	shardList: config.sharding.shardList,
	token: config.botToken
});

manager.on("shardCreate", (shard) => {
	console.log(`Launched shard #${shard.id}`);
});

manager.spawn();
