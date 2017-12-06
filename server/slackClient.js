const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

let channel;
module.exports.init = function slackClient(bot_token, logLevel){
	const rtm = new RtmClient(bot_token, {logLevel: logLevel});
	// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
	rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
	  for (const c of rtmStartData.channels) {
		  if (c.is_member && c.name ==='general') { channel = c.id }
	  }
	  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
	});

	rtm.on(RTM_EVENTS.MESSAGE, (message) => {
		console.log(message);

		rtm.sendMessage("Hello!", channel);
	});
	return rtm;
}

// you need to wait for the client to fully connect before you can send messages
/*rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  rtm.sendMessage("Hello!", channel);
});

rtm.start();*/