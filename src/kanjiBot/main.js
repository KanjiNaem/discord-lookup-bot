import { createRequire } from "module";
const require = createRequire(import.meta.url);
import * as lookupService from "./service/lookupService.js";

const { Client } = require("discord.js");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { token } = require("../../config.json");
const prefix = "!";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  // test command
  if (command === "think") {
    message.reply("🤔");
  }

  // word lookup command
  if (command === "lookup") {
    const response = await lookupService.lookup(args);
    message.reply(response);
  }
});

client.login(token);
