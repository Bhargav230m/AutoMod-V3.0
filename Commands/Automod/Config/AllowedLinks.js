const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const automod = require("../../../Schemas/automod");
const Reply = require("../../../Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("allowedlinks")
    .setDescription("Allowed links by automod v3.0")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((options) =>
      options
        .setName("link1")
        .setDescription("Enter the first link!")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("link2")
        .setDescription("Enter the second link!")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("link3")
        .setDescription("Enter the third link!")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("link4")
        .setDescription("Enter the fourth link!")
        .setRequired(true)
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const link1 = options.getString("link1");
    const link2 = options.getString("link2");
    const link3 = options.getString("link3");
    const link4 = options.getString("link4");

    let Data = await automod.findOne({ Guild: guild.id });

    if (Data) {
      Data.AllowedLinks1 = link1;
      Data.AllowedLinks2 = link2;
      Data.AllowedLinks3 = link3;
      Data.AllowedLinks4 = link4;
      Data.save();
    } else {
      Reply(interaction, ":x:", "Please enable automod first", true);
    }

    Reply(interaction, ":white_check_mark:", "Updated the data", true);
  },
};
