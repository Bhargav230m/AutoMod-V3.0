//Credits to KevinFoged for the original command
const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Slows down the rate at which messages can be sent.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption((options) =>
      options
        .setName("rate")
        .setDescription(
          "Provide the rate at which the user can send a new message, e.g 5s, 1m, 30m, etc."
        )
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("Provide a reason for why you activated slowmode.")
        .setRequired(false)
    )
    .addStringOption((options) =>
      options
        .setName("duration")
        .setDescription(
          "Provide a duration for the slow mode, e.g 5s, 1m, 30m, etc., after which it will disable itself."
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    let message;
    const { channel, options } = interaction;
    const minRate = ms("5s");
    const maxRate = ms("6h");
    const minDuration = ms("10s");
    const rate =
      options.getString("rate") && ms(options.getString("rate"))
        ? ms(options.getString("rate"))
        : 0;
    const duration =
      options.getString("duration") && ms(options.getString("duration"))
        ? ms(options.getString("duration"))
        : 0;
    const reason = options.getString("reason") || "None provided";
    const description = duration
      ? `Slow mode has been enabled with a rate of ${ms(rate, {
          long: true,
        })} for ${ms(duration, { long: true })}`
      : `Slow mode has been enabled with a rate of ${ms(rate, { long: true })}`;
    const response = new EmbedBuilder()
      .setTitle("🐌 Slow mode 🐌")
      .setColor("BLURPLE")
      .setDescription(
        `${description}. **Reason:** ${reason}.\nCommand made by KevinFoged **Credits to KevinFoged**`
      )
      .setTimestamp();
    if (!rate) {
      channel.rateLimitPerUser
        ? response.setDescription(`Slow mode has been disabled.`)
        : response.setDescription(
            `Slow mode has been enabled with a rate of ${ms(minRate, {
              long: true,
            })}.`
          );
      channel.rateLimitPerUser
        ? channel.setRateLimitPerUser(0)
        : channel.setRateLimitPerUser(5);
      message = await interaction.reply({
        embeds: [response],
        fetchReply: true,
      });
      return setTimeout(() => message.delete().catch(() => {}), 10000);
    }

    if (rate < minRate || rate > maxRate) {
      response.setDescription(
        `Rate must be between ${ms(minRate, { long: true })} and ${ms(maxRate, {
          long: true,
        })}. The rate can be supplied like so: *10s, 1m, 2h*, etc., or alternatively in milliseconds.`
      );
      return interaction.reply({
        embeds: [response],
        fetchReply: true,
        ephemeral: true,
      });
    }

    if (duration && duration < minDuration) {
      response.setDescription(
        `Duration must be at least ${ms(minDuration, {
          long: true,
        })}. The duration can be supplied like so: *10s, 1m, 2h*, etc., or alternatively in milliseconds.`
      );
      return interaction.reply({
        embeds: [response],
        fetchReply: true,
        ephemeral: true,
      });
    }

    channel.setRateLimitPerUser(rate / 1000, reason);
    message = await interaction.reply({
      content: "Credits to KevinFoged",
      embeds: [response],
      fetchReply: true,
    });
    setTimeout(() => message.delete().catch(() => {}), 10000);

    if (duration)
      setTimeout(async () => channel.setRateLimitPerUser(0), duration);
  },
};
