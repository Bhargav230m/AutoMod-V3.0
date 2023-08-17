const { ActivityType } = require("discord.js");
const config = require("../../config.json");
const { loadCommands } = require("../../Handlers/commandHandler");
require("colors");
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("[CLIENT]".green + ` Logined as ${client.user.tag}`);
    const activities = [
      "Template Bot",
      `With ${client.guilds.cache.size} guild(s)`,
    ];
    let i = 0;
    
    setInterval(
      () =>
        client.user.setStatus({
          name: [{ name: activities[i++ % activities.length] }],
          type: ActivityType.Streaming,
          url: "https://www.youtube.com/watch?v=OqxHy8sCtvA",
        }),
      5000
    );
    console.log("Prepairing to connect to the database".green);
    const { connect } = require("mongoose");
    connect(config.Setup.DataBase_URL, {}).then(() => {
      console.log(`[MongoDB]`.green + " Connected to the database");
    });
    loadCommands(client)
  },
};
