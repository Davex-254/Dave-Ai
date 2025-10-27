const fs = require('fs')
const path = require('path')

let daveplug = async (m, { command, xprefix, q, daveshown, reply, args, mess }) => {
  if (!daveshown) return reply(mess.owner)

  const settings = global.settings

  if (!args || args.length < 1) {
    const status = settings.antidelete.enabled ? 'on' : 'off'
    return reply(
      `antidelete: ${status}\n\n` +
      `usage:\n` +
      `${xprefix + command} on\n` +
      `${xprefix + command} off`
    )
  }

  const option = q.toLowerCase()

  if (option === 'on') {
    if (settings.antidelete.enabled)
      return reply('antidelete is already on')

    settings.antidelete.enabled = true
    global.saveSettings(settings)
    global.settings = settings
    reply('antidelete turned on')
  } 
  else if (option === 'off') {
    if (!settings.antidelete.enabled)
      return reply('antidelete is already off')

    settings.antidelete.enabled = false
    global.saveSettings(settings)
    global.settings = settings
    reply('antidelete turned off')
  } 
  else {
    reply(`invalid option. use ${xprefix + command} on/off`)
  }
}

daveplug.help = ['antidelete']
daveplug.tags = ['owner']
daveplug.command = ['antidelete', 'antidel']

module.exports = daveplug;