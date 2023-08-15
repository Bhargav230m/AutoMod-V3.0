const autorole = require("../../Schemas/welcome");

module.exports = {
  name: "guildMemberAdd",
  once: false,

  async execute(member) {
    const data = await autorole.findOne({
      Guild: member.guild.id,
    });
    if (!data) return;
    let role;

    if (!member.user.bot) {
      role = member.guild.roles.cache.get(data.Role);

      if (role) {
        member.roles.add(role);
      } else {
        return;
      }
    }
    if (member.user.bot) {
      role = member.guild.roles.cache.get(data.BotRole);

      if (role) {
        member.roles.add(role);
      } else {
        return;
      }
    }
  },
};
