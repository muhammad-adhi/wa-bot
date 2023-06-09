const {
   BufferJSON,
   WA_DEFAULT_EPHEMERAL,
   generateWAMessageFromContent,
   proto,
   generateWAMessageContent,
   generateWAMessage,
   prepareWAMessageMedia,
   areJidsSameUser,
   getContentType,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
let setting = require("./config.json");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
   apiKey: setting.keyopenai,
});
const openai = new OpenAIApi(configuration);

module.exports = aldhi = async (bot, m, chatUpdate, store) => {
   try {
      var body =
         m.mtype === "conversation"
            ? m.message.conversation
            : m.mtype == "imageMessage"
            ? m.message.imageMessage.caption
            : m.mtype == "videoMessage"
            ? m.message.videoMessage.caption
            : m.mtype == "extendedTextMessage"
            ? m.message.extendedTextMessage.text
            : m.mtype == "buttonsResponseMessage"
            ? m.message.buttonsResponseMessage.selectedButtonId
            : m.mtype == "listResponseMessage"
            ? m.message.listResponseMessage.singleSelectReply.selectedRowId
            : m.mtype == "templateButtonReplyMessage"
            ? m.message.templateButtonReplyMessage.selectedId
            : m.mtype === "messageContextInfo"
            ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text
            : "";
      var budy = typeof m.text == "string" ? m.text : "";
      // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
      var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
      const isCmd2 = body.startsWith(prefix);
      const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
      const args = body.trim().split(/ +/).slice(1);
      const pushname = m.pushName || "No Name";
      const botNumber = await bot.decodeJid(bot.user.id);
      const itsMe = m.sender == botNumber ? true : false;
      let text = (q = args.join(" "));
      const arg = budy.trim().substring(budy.indexOf(" ") + 1);
      const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

      const from = m.chat;
      const reply = m.reply;
      const sender = m.sender;
      const mek = chatUpdate.messages[0];

      bot.readMessages([m.key]);

      const color = (text, color) => {
         return !color ? chalk.green(text) : chalk.keyword(color)(text);
      };

      // Group
      const groupMetadata = m.isGroup ? await bot.groupMetadata(m.chat).catch((e) => {}) : "";
      const groupName = m.isGroup ? groupMetadata.subject : "";

      // Push Message To Console
      let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

      if (isCmd2 && !m.isGroup) {
         console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
      } else if (isCmd2 && m.isGroup) {
         console.log(
            chalk.black(chalk.bgWhite("[ LOGS ]")),
            color(argsLog, "turquoise"),
            chalk.magenta("From"),
            chalk.green(pushname),
            chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
            chalk.blueBright("IN"),
            chalk.green(groupName)
         );
      }

      if (isCmd2) {
         switch (command) {
            case "help":
            case "menu":
               reply(`halo ${pushname}`);
               break;

            case "chat":
               // if (!text) return reply(`hallo ${pushname}, silahkan kirim seperti dibawah ini\n${prefix}chat (masukin chat anda)`);
               if (!q) return reply(`hallo ${pushname}, silahkan kirim seperti dibawah ini\n${prefix}chat (masukin apa yang pengen lu tanyain minimal 2x spasi)`);
               bot.sendMessage(from, { text: "tunggu bentar" });
               const response = await openai.createCompletion({
                  model: "text-davinci-003",
                  prompt: text,
                  max_tokens: 999,
                  temperature: 0,
               });

               reply("CHAT_BOT" + response.data.choices[0].text);

               break;
         }
      }
   } catch (err) {
      m.reply(util.format(err));
   }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
   console.log(chalk.redBright(`Update ${__filename}`));
   delete require.cache[file];
   require(file);
});
