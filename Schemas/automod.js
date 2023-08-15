const mongoose = require("mongoose");

const automod = new mongoose.Schema({
  Guild: String,
  LogChannel: String,
  Timeout: String,
  AllowedLinks1: String,
  AllowedLinks2: String,
  AllowedLinks3: String,
  AllowedLinks4: String,
  AntiUnverifiedBot: Boolean,
  AntiSwear: Boolean,
  AntiScam: Boolean,
  AntiLink: Boolean,
  AntiPing: Boolean,
  AntiAltAccount: Boolean,
  AntiCaps: Boolean,
  AntiSpam: Boolean,
});

module.exports = mongoose.model('automod', automod);