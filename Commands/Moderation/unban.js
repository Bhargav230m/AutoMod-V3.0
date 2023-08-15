const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  messageLink,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a member from your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    //18
    .addStringOption((options) =>
      options
        .setName("id")
        .setDescription("ID of the user to unban")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("Specify a reason")
        .setMaxLength(512)
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    try {
      const { options, member, guild } = interaction;
      const reason = options.getString("reason") || "Not specified";
      const target = options.getString("id");
      await interaction.guild.members.unban(target);
      const se = new EmbedBuilder()
        .setAuthor({ name: "Ban Issues", iconURL: guild.iconURL() })
        .setColor("Gold")
        .setDescription(
          [`<@${target}> got unbanned by ${member}`, `\nReason ${reason}`].join(
            "\n"
          )
        );
      interaction.reply({ embeds: [se] });
      target.send({
        content: `Hi, You have been unbanned from ${guild.name} for reason ${reason}, now you can join again`,
      });
    } catch (err) {
      return interaction.reply({
        content: "Enter a valid id for the banned user!",
      });
    }
  },
};
