const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let nlp = null;

let channel;
module.exports.init = function slackClient(bot_token, logLevel, nlpClient){
	const rtm = new RtmClient(bot_token, {logLevel: logLevel});
	nlp = nlpClient

	// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
	rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
	  for (const c of rtmStartData.channels) {
		  if (c.is_member && c.name ==='general') { channel = c.id }
	  }
	  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
	});

	rtm.on(RTM_EVENTS.MESSAGE, (message) => {

		if(message.text.toLowerCase().includes('iris')) {
			nlp.ask(message.text, (err, res) => {
				if(err) {
					console.log('Error '+err);
					return
				}

				try {
					if(!res.intent || !res.intent[0] || !res.intent[0].value) {
						throw new Error("Could not extract intent.")
					}

					const intent = require('./intents/' + res.intent[0].value + 'Intent');

					intent.process(res, function(error, response) {
						if(error) {
							console.log(error.message);
							return rtm.sendMessage(`Sorry, I don't know what are you talking about.`, message.channel)
						}

						return rtm.sendMessage(response, message.channel)
					})
				} catch(err) {
					console.log('Error '+err);
					return rtm.sendMessage("Sorry, I don't know what you are talking about!", message.channel)
				}
			})
		}
	});
	return rtm;
}

// you need to wait for the client to fully connect before you can send messages
/*rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  rtm.sendMessage("Hello!", channel);
});

rtm.start();*/