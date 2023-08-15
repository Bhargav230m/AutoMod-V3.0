
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans the member from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("Select the target Member")
        .setRequired(true)
    )
    .addAttachmentOption((options) =>
      options
        .setName("evidence")
        .setDescription("Attach a edivence")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("dm")
        .setDescription("Do you want to dm the user")
        .addChoices(
          { name: "No", value: "False" },
          { name: "Yes", value: "True" }
        )
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("Provide a reason to ban the member ")
        .setMaxLength(256)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guild, member } = interaction;
    const target = options.getMember("target");
    const reason = options.getString("reason") || "Non Specified.";
    const evidence = options.getAttachment("evidence");
    const dm = options.getString("dm");
    const errorArray = [];
    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: "Could not ban this member due to" })
      .setColor("Red");
    if (!target)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription("`Could not find that target`")],
        ephemeral: true,
      });
    if (target.id == interaction.user.id)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription("`You cannot ban yourself`")],
        ephemeral: true,
      });
    if (target.id == client.user.id)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription("`You cannot ban me`")],
        ephemeral: true,
      });
    if (target.id == interaction.guild.ownerId)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription("`You cannot ban the owner`")],
        ephemeral: true,
      });
    if (!target.manageable || !target.moderatable)
      errorArray.push("`Selected target is not a moderatable by this bot.`");

    if (member.roles.highest.position < target.roles.highest.position)
      errorArray.push("`Selected target has higer role than yours.`");

    if (errorArray.length)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorArray.join("\n"))],
        ephemeral: true,
      });
    await interaction.deferReply();
    switch (dm) {
      case "False":
        break;
      case "True":
        const embed1 = new EmbedBuilder()
          .setTitle("Banned")
          .setDescription(
            `You have been banned from **${guild.name}** for **Reason:** \`${reason}\`, See the evidence above`
          )
          .setColor("Red");
        await target.send({ embeds: [embed1], files: [evidence] });
        break;
    }
    await interaction.guild.members.ban(target);
    const successEmbed = new EmbedBuilder()
      .setAuthor({ name: "Ban Issues", iconURL: guild.iconURL() })
      .setTitle("Ban Reports")
      .setColor("Green")
      .setDescription(
        [
          `*${target}* was issued a Ban by **${member}**`,
          `**Reason:** ${reason}`,
          `\nDmed: ${dm}`,
        ].join("\n")
      );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ub")
        .setLabel("Unban")
        .setEmoji("⚙️")
        .setStyle(ButtonStyle.Danger)
    );
    const Page = await interaction.editReply({
      ephemeral: false,
      files: [evidence],
      components: [buttons],
      embeds: [successEmbed],
    });
    const ms = require("ms");
    const col = Page.createMessageComponentCollector({
      time: ms("15m"),
    });
    col.on("collect", async (i) => {
      if (!i.member.permissions.has(PermissionFlagsBits.BanMembers))
        return Reply(
          interaction,
          ":x:",
          "You need to have `BanMembers` permission to perform this action",
          true
        );
      switch (i.customId) {
        case "ub":
          interaction.followUp({ content: "Unbanned", ephemeral: true });
          await interaction.guild.members.unban(target.id).then(async () => {
            const successEmbed1 = new EmbedBuilder()
              .setAuthor({ name: "Unban Issues", iconURL: guild.iconURL() })
              .setTitle("Unban Reports")
              .setColor("Green")
              .setDescription(
                [`*${target}* was Unbanned by **${member}**`].join("\n")
              );

            const buttons1 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("ub")
                .setLabel("Unban")
                .setDisabled(true)
                .setEmoji("⚙️")
                .setStyle(ButtonStyle.Danger)
            );
            interaction.editReply({
              embeds: [successEmbed1],
              components: [buttons1],
              files: [],
            });
          });
          break;
      }
    });
    col.on("end", async (collected) => {
      if (collected.size < 0) {
        const successEmbed = new EmbedBuilder()
          .setAuthor({ name: "Ban Issues", iconURL: guild.iconURL() })
          .setTitle("Ban Reports")
          .setColor("Green")
          .setDescription(
            [
              `*${target}* was issued a Ban by **${member}**`,
              `**Reason:** ${reason}`,
              `\nDmed: ${dm}`,
            ].join("\n")
          );

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ub")
            .setLabel("Unban")
            .setDisabled(true)
            .setEmoji("⚙️")
            .setStyle(ButtonStyle.Danger)
        );
        interaction.editReply({
          ephemeral: false,
          files: [evidence],
          components: [buttons],
          embeds: [successEmbed],
        });
      }
    });
  },
};
