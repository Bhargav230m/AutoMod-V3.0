const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const welcome = require("../../../Schemas/welcome");
const Reply = require("../../../Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Automatic adds the role you select when a user/bot joins")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addRoleOption((options) =>
      options
        .setName("userole")
        .setDescription("Add a role for the user!")
        .setRequired(true)
    )
    .addRoleOption((options) =>
      options
        .setName("botrole")
        .setDescription("Add a role for the bot!")
        .setRequired(true)
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const roles = options.getRole("userole");
    const roles2 = options.getRole("botrole");

    let Data = await welcome.findOne({ Guild: guild.id });
    let dat;
    
    if (!Data) {
      dat = new welcome({
        Guild: guild.id,
        Role: roles.id,
        BotRole: roles2.id,
      });
      dat.save();
    } else {
      Data.Role = roles.id;
      Data.BotRole = roles2.id;
      Data.save();
    }

    Reply(interaction, ":white_check_mark:", `Added the following roles - ${roles}, ${roles2}`, true);
  },
};
