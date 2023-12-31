const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const automod = require("../../../Schemas/automod");
const antialt = require("../../../Schemas/AntiAlt");
const Reply = require("../../../Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("antialtusersallow")
    .setDescription("Allowed users by AntiAlt system")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((options) =>
      options
        .setName("userid")
        .setDescription("Enter the users ID to allow the user to join")
        .setRequired(true)
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const UserID = options.getString("userid");

    let Data = await automod.findOne({ Guild: guild.id });
    let AltUser = await antialt.findOne({ Guild: guild.id });
    if (!Data) {
      return Reply(":x:", "Please enable automod before using this command", true);
    }

    let newDat;

    if (!AltUser) {
      newDat = new antialt({
        Guild: guild.id,
        User: UserID,
      });
      newDat.save();
    } else {
      newDat = new antialt({
        Guild: guild.id,
        User: UserID,
      });
      newDat.save();
    }

    Reply(
      interaction,
      ":white_check_mark:",
      `Created a new entry with the UserID: ${UserID}, This user now won't be kicked`,
      true
    );
  },
};
