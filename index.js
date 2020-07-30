const { Telegraf } = require('telegraf')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp")
const LocalSession = require('telegraf-session-local');

const { createSVGWindow, config } = require('svgdom')


const window = createSVGWindow()
const document = window.document
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
// register window and document
registerWindow(window, document)

// create canvas


const bot = new Telegraf(process.env.BOT_TOKEN)

var session = new LocalSession({ database: 'db.json' })
bot.use(session.middleware())

function getSid(msg) {
    return `${msg.chat.id}:${msg.from.id}`
}

function inc(sid, countername) {
  var repliedSession = session.getSession(sid)
  !('counter' in repliedSession) && (repliedSession.counter = {})
  // repliedSession.counter = repliedSession.counter || {}
  repliedSession.counter[countername] = repliedSession.counter[countername] || 0
  repliedSession.counter[countername]++
  session.saveSession(sid, repliedSession)
  return repliedSession.counter[countername]
}

var svgs = {
  'pap': fs.readFileSync('pap.svg', 'utf8'),
  'slam': fs.readFileSync('slam.svg', 'utf8'),
}

bot.hears('pap', (ctx) => {
  if (ctx.update.message.reply_to_message) {
    var reply_to_message = ctx.update.message.reply_to_message
    var repliedSid = getSid(reply_to_message)
    var now = inc(repliedSid, 'pap')
    var draw = SVG(document.documentElement)
    draw.svg(svgs['pap'])
    draw.findOne('#tspan869').text(`${now} PAPS!`)
    draw.findOne('#tspan875').text(ctx.message.from.firstName)

    sharp(Buffer.from(draw.svg(), 'utf8')).webp().toBuffer()
      .then(res => {
        ctx.replyWithSticker({
          source: res
        }, {reply_to_message_id: ctx.update.message.reply_to_message.message_id})
      })

    // ctx.replyWithSticker('pap', {reply_to_message_id: ctx.update.message.reply_to_message.message_id})
  }
})


bot.start((ctx) => ctx.reply('Welcome'))
bot.launch()
