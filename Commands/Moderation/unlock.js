const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("unlock channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Select a channel")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    const succesEmbed = new EmbedBuilder()
      .setColor(0xd98832)
      .setTitle(":unlock: Unlock!")
      .setDescription(`Channel succesfully unlocked.`);

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: true,
      AttachFiles: true,
    });

    await interaction.reply({
      embeds: [succesEmbed],
    });
  },
};
