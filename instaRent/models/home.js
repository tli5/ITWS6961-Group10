var mongoose = require("./mongoose_connector").mongoose;
var db = require("./mongoose_connector").db;

var homeSchema = new mongoose.Schema({
  userId: String,
  address: String,
  description: String,
  userType: String
});

var Home = mongoose.model('Home', homeSchema);

function checkAndSave(home, res) {
	
	Home.find({userId : home.userId, address : home.address}, function(err, data) {
		//console.log(data);
		if(err || data.length > 0)
			res.status(409).send("Error: Address already exists");
		else
			home.save(function(err, saved) {
				if(err)	{
					res.status(409).send("Error Adding home");
				}
				else
					res.send("Success");
			});	
	});	
}; 

function update(home, res) {
	//console.log(home);
	Home.update({userId: home.userType,  address : home.address}, home, {}, function(err, numEffected) {
		//console.log(data);
		if(err || numEffected == 0)
			res.status(409).send("Error: Could not find existing home");
		else
			res.send("Success");	
	});	
}; 

function getUserHomeAddresses(userId, res) {
	Home.find({userId: userId}, function(err, data) {		
		if(err || data.length == 0)
			res.status(409).send({status: "Error", response: "Error: No homes added!"});
		
		var addresses = [];
		for(var i = 0; i < data.length; i++) {
			addresses.push({address: data[i].address, id: data[i]._id, userType: "Landlord"});
		}
		res.send({status: "Success", response: data});
		//res.send({status: "Success", response: addresses});
	});
};

exports.update = update;
exports.getUserHomeAddresses = getUserHomeAddresses;
exports.checkAndSave = checkAndSave;
exports.Home = Home; 
