// expose our config directly to our application using module.exports

var googleCB = process.env.NODE_ENV=='staging' ? 'http://fast-caverns-8687.herokuapp.com/auth/google/callback' : 'http://localhost:5000/auth/google/callback';

console.log("Will use these callback URLs: "+googleCB);

module.exports = {
	'googleAuth' : {
		'clientID' 		: '626791004779-f61f22vjoc8shkliqb79l1aa463a0okt.apps.googleusercontent.com',
		'clientSecret' 	: '2kTwdDf27vKwvz21HUJOOlHJ',
		'callbackURL' 	: googleCB
	}
};
