
//dependencies
const mailNotifier = require('mail-notifier');

function Analytics(setup){
	//turn my setup object into an object that the mail-notifer can accept
	this.instance = mailNotifier(setup);
	this.emailRepo = {};
};

//start listening
Analytics.prototype.start = function(){

	var self = this;

	self.instance.start();

	self.instance.on('error', function(err){
		console.log(err);
	});

	self.instance.on('mail', function(mail){
		var from 		= mail.from[0].address,
			subj 		= mail.subject,
			timestamp 	= mail.receivedDate;

		if (self.emailRepo[from] === undefined) {
			self.emailRepo[from] = {
				emails: [{
					subject: subj,
					timestamp: timestamp
				}]
			};
		} else {
			self.emailRepo[from].emails.push({
				subject: subj,
				timestamp: timestamp
			});
		}
	});

	//
	self.instance.on('end', function(){
		self.instance.start();
	});

};

Analytics.prototype.stop = function(){
	this.instance.stop();
};

Analytics.prototype.count = function(from, callback){
	if (!(from in this.emailRepo)) {
		callback(0);
	} else{
		callback(this.emailRepo[from].emails.length);
	}
};

Analytics.prototype.history = function(callback){
	callback(JSON.stringify(this.emailRepo));
}

//this is visible to adopters
module.exports = function(setup){
	return new Analytics(setup);
};