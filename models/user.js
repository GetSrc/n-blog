var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback) {
	//要存入数据库的用户文档
	var user = {
		name: this.name,
		password : this.password,
		email : this.email
	};
	mongodb.open(function(err , db){
		if(err){
			return callback(err);
		}
		db.collection('users',function (err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(user,{safe:true},function (err,user){
				mongodb.close();
				callback(err,user);
			});
		});
	});

};

User.get = function(name,callback) {
	//通过用户名获取
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function (err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({name:name},function(err,doc){
				mongodb.close();
				if(doc){
					var user = new User(doc);
					user._id = doc._id.toString();
					callback(err,user);
				}else{
					callback(err,null);
				}
			});
		});
	});
};