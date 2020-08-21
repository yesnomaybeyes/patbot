const { Telegraf } = require('telegraf')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp")
const db = require('better-sqlite3')('db.sqlite3')





const { createSVGWindow, config } = require('svgdom')


const { SVG, registerWindow } = require('@svgdotjs/svg.js')

// create canvas


const bot = new Telegraf(process.env.BOT_TOKEN)


function getSid(msg) {
    return `${msg.from.id}:${msg.chat.id}`
}

function iinc(sid, countername) {
//        var ret = db.get("SELECT Count count FROM gcounters WHERE name  = ?", [countername], (err, row) => {
//	   db.run("UPDATE gcounters SET count = ? WHERE name = ?", row.count+1, countername)
//	})
        var count = db.prepare("SELECT Count count FROM gcounters WHERE name  = ?").get(countername)
        //var row = db.get("SELECT Count count FROM gcounters WHERE name  = ?", [countername])
	db.prepare("UPDATE gcounters SET count = ? WHERE name = ?").run(count.count+1, countername)
	console.log(count)
	return count.count+1


}
function inc(sid, countername) {
  var repliedSession = session.selectById(sid)
	console.log(repliedSession)
  !('counter' in repliedSession) && (repliedSession.counter = {})
  // repliedSession.counter = repliedSession.counter || {}
  repliedSession.counter[countername] = repliedSession.counter[countername] || 0
  repliedSession.counter[countername]++
  session.updatebyId(sid, repliedSession)
	return repliedSession.counter[countername]
}

var svgs = {
  'pap': fs.readFileSync('pap.svg', 'utf8'),
  'slam': fs.readFileSync('slam.svg', 'utf8'),
  'bonk': fs.readFileSync('bonk.svg', 'utf8'),
}

bot.hears(new RegExp('^pap$', "i"), (ctx) => {
  if (ctx.update.message.reply_to_message) {
   var window = createSVGWindow()
   var document = window.document
   registerWindow(window, document)
    var reply_to_message = ctx.update.message.reply_to_message
    var repliedSid = getSid(reply_to_message)
    var incd = iinc(repliedSid, 'pap')
    var draw = SVG(document.documentElement)
    draw.svg(svgs['pap'])
    draw.findOne('#tspan869').text(`${incd} PAPS!`)
    draw.findOne('#tspan875').text(reply_to_message.from.first_name)

    sharp(Buffer.from(draw.svg(), 'utf8'), {density: 600}).resize({width: 512}).webp().toBuffer()
      .then(res => {
        ctx.replyWithSticker({
          source: res
        }, {reply_to_message_id: ctx.update.message.reply_to_message.message_id})
      })

  }
})

bot.hears(new RegExp('^slam$', "i"), (ctx) => {
  if (ctx.update.message.reply_to_message) {
   var window = createSVGWindow()
   var document = window.document
   registerWindow(window, document)
    var reply_to_message = ctx.update.message.reply_to_message
    var repliedSid = getSid(reply_to_message)
    var now = iinc(repliedSid, 'slam')
    var draw = SVG(document.documentElement)
    draw.svg(svgs['slam'])
    draw.findOne('#tspan845').text(`${now} SLAMS!`)
    draw.findOne('#tspan851').text(reply_to_message.from.first_name)

    //sharp(Buffer.from(draw.svg(), 'utf8')).webp().toBuffer()
    sharp(Buffer.from(draw.svg(), 'utf8'), {density: 600}).resize({width: 512, height: 512}).webp().toBuffer()
      .then(res => {
        ctx.replyWithSticker({
          source: res
        }, {reply_to_message_id: ctx.update.message.reply_to_message.message_id})
      })

  }
})




bot.hears(new RegExp('^bonk$', "i"), (ctx) => {
  if (ctx.update.message.reply_to_message) {
   var window = createSVGWindow()
   var document = window.document
   registerWindow(window, document)
    var reply_to_message = ctx.update.message.reply_to_message
    var repliedSid = getSid(reply_to_message)
    var incd = iinc(repliedSid, 'bonk')
    var draw = SVG(document.documentElement)
    draw.svg(svgs['bonk'])
    draw.findOne('#count').text(`${incd} BONKS!`)
    draw.findOne('#namee').text(reply_to_message.from.first_name)

    //sharp(Buffer.from(draw.svg(), 'utf8'), {density: 100}).webp().toBuffer()
    sharp(Buffer.from(draw.svg(), 'utf8'), {density: 96}).resize({width: 512, height: 512}).webp().toBuffer()
      .then(res => {
        ctx.replyWithSticker({
          source: res
        }, {reply_to_message_id: ctx.update.message.reply_to_message.message_id})
      })

  }
})

bot.start((ctx) => ctx.reply('Welcome'))
bot.launch()
