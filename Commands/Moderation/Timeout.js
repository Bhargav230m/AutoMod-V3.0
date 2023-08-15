const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
} = require("discord.js");
const DataBase = require("../../Schemas/Infractions");
const ms = require("ms");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Restricts a member's ability to comunicate")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("Select the target Member")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("duration")
        .setDescription("Provide a duration to timeout the member (1h, 1d)")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("Provide a reason to timeout the member ")
        .setMaxLength(512)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guild, member } = interaction;
    const target = options.getMember("target");
    const duration = options.getString("duration");
    const reason = options.getString("reason") || "Non Specified.";
    const errorArray = [];
    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: "Could not timeout this member due to" })
      .setColor("Red");
    if (!target)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription("Could not find that target")],
        ephemeral: true,
      });
    if (!ms(duration) || ms(duration) > ms("28d"))
      errorArray.push(
        "Time provided is either invalid or over the 28d time limit"
      );

    if (!target.manageable || !target.moderatable)
      errorArray.push("Selected target is not a moderatable by this bot.");

    if (member.roles.highest.position < target.roles.highest.position)
      errorArray.push("Selected target has higer role than yours.");

    if (errorArray.length)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorArray.join("\n"))],
        ephemeral: true,
      });
    let timeError = false;
    await target.timeout(ms(duration), reason).catch(() => (timeError = true));

    if (timeError)
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription(
            "Could not timeout user due to an uncommon error. Cannot take negative values"
          ),
        ],
        ephemeral: true,
      });
    const Timeout = "Timeout";
    const newInfractionsObject = {
      IssuerID: member.id,
      IssuerName: member.user.tag,
      Reason: reason,
      Date: Date.now(),
      TP: Timeout,
    };
    let userData = await DataBase.findOne({ Guild: guild.id, User: target.id });
    if (!userData)
      userData = await DataBase.create({
        Guild: guild.id,
        User: target.id,
        Infractions: [newInfractionsObject],
      });
    else
      userData.Infractions.push(newInfractionsObject) &&
        (await userData.save());

    const successEmbed = new EmbedBuilder()
      .setAuthor({ name: "Timeout Issues", iconURL: guild.iconURL() })
      .setColor("Gold")
      .setDescription(
        [
          `${target} was issued a timeout for **${ms(ms(duration), {
            long: true,
          })}** by ${member}`,
          `Brining their infractions total to **${userData.Infractions.length} points**`,
          `\nReason ${reason}`,
        ].join("\n")
      );
    interaction.reply({ embeds: [successEmbed], ephemeral: true });
  },
};
