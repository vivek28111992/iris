'use strict';
require('dotenv').config({path: '../.env'})
const http = require('http')

const service = require('../server/service')
const slackClient = require('../server/slackClient')
const server = http.createServer(service)

const bot_token = process.env.SLACK_BOT_TOKEN || '';
const slackLogLevel = 'verbose'

const rtm = slackClient.init(bot_token, slackLogLevel);
rtm.start();

server.listen(3000)

server.on('listening', function(){
	console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')}`)
})
