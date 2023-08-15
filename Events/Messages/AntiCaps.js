const { Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const UserAM = require("../../Schemas/userAutomod");
const automod = require("../../Schemas/automod");

module.exports = {
  name: "messageCreate",
  /**
 * 

 * @param {Client} client 
 */
  async execute(message, client) {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return;
    const guild = message.guild;

    let requireDB = await automod.findOne({ Guild: guild.id });
    let UserData = await UserAM.findOne({
      Guild: guild.id,
      User: message.author.id,
    });
    if (!requireDB) return;
    if (requireDB.AntiCaps == false) return;

    const logChannel = client.channels.cache.get(requireDB.LogChannel);
    if (!UserData) {
      const newData = new UserAM({
        Guild: guild.id,
        User: message.author.id,
        InfractionPoints: 0,
      });
      newData.save();
    }
    let q = message.content;
    if (q.length > 8 && q == q.toUpperCase()) {
      try {
        await message.delete();
      } catch (err) {
        return;
      }

      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          `:warning: | <@${message.author.id}> Please try sending messages with lower volume.`
        );
      const msg = await message.channel.send({ embeds: [embed] });

      setTimeout(async () => {
        await msg.delete();
      }, 5000);
    }
  },
};
