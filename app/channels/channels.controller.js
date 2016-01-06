angular.module('angularfireSlackApp')
	.controller('ChannelsCtrl', function($state, Auth, Users, profile, channels){
		console.log("Hello!");
		var channelsCtrl = this;
		channelsCtrl.profile = profile;
		channelsCtrl.channels = channels;
		channelsCtrl.getDisplayName= Users.getDisplayName;
		channelsCtrl.getGravatar= Users.getGravatar;

		channelsCtrl.logout = function(){
			console.log("logout invoked!");
			Auth.$unauth();
			$state.go('home');
		};

		channelsCtrl.newChannel = {
			name: ''
		};


		channelsCtrl.createChannel = function() {
			channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function() {
				channelsCtrl.newChannel = {
					name: ''
				};
			});
		};
	});