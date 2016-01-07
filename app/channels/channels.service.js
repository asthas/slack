angular.module('angularfireSlackApp')
	.factory('Channels', function($firebaseArray, FirebaseUrl){
		var ref = new Firebase(FirebaseUrl+'channels');
		console.log(ref, FirebaseUrl);
		var channels = $firebaseArray(ref);

		return channels;
	});

