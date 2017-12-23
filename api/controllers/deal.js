var path = require('path');
var db = require(path.resolve('config')).dbConfig;
var qs = require('querystring');
var md5 = require('md5');
var crypto = require('crypto');
exports.login = function(req,res,next){
  var query="SELECT lc.user_id,lc.username,lc.email,lc.password " +
  "FROM " +
  " ilance_users as lc WHERE lc.username = '"+ req.body.email +"';"
  //  console.log(query);
  db.get().query(query, function (err, result) {
    if (err) {
      return res.status(err.status).json(err);
    }
    //console.log(result);
    //var salt_user=JSON.stringify(result);

    //console.log(result[0].salt,result[0].password);
    //console.log("jflfjlfjlfjlfjlfj",md5((req.body.password).salt_user));
    var Dbpassowrd =  result[0].password
    var hashPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    console.log(hashPassword);
    if ( Dbpassowrd === hashPassword ) {
      //console.log("cool");
      req.session.user='loginuser';
      res.status(200).json(result);
      // Successful login
    } else {
      //  console.log("very cool");
      res.status(404).json('Username / Email or Password Wrong!');
      // Unsuccessful login
    }
  });
};
exports.AuthenticationUser = function(req,res,next){
  if(req.session.user!==undefined&& req.session.user){
    res.status(200).json({lgoin:true});
  }else {
    res.status(304).json({lgoin:false});
  }
};

exports.logout = function(req, res, next){
    if (req.session.user) {
      console.log("hiiii");
        res.clearCookie('user_sid');
        res.status(200).json('Logout succesfully!');
    }
};
exports.getUserData = function(req,res,next){
  //console.log(req.body,req.headers);
  var skip = req.headers.skip? req.headers.skip.replace(/"/g, ""): 0;
  //console.log(req.headers.status);
  //res.send('user'+(req.session.user===undefined?"not found":req.session.user))
  if(req.session.user!==undefined&& req.session.user){
    if (req.headers.skip&&req.headers.limit&&req.headers.userid&&req.headers.status==='date_added'|| req.headers.status==='project_title') {
      var query="SELECT "+
      "u.username, p.project_title, p.cid , c.category_name "+
      "FROM "+
      "ilance_users AS u "+
      "INNER JOIN "+
      "ilance_projects AS p ON u.user_id = p.user_id "+
      "LEFT JOIN " +
      "ilance_category as c ON c.cid=p.cid " +
      "WHERE "+
      "u.user_id = "+ req.headers.userid + "  ORDER BY p."+req.headers.status + " LIMIT "+ skip +" , " +req.headers.limit +" ;"
    }else if (req.headers.skip&&req.headers.limit&&req.headers.userid&&req.headers.status==='username') {
      var query="SELECT "+
      "u.username, p.project_title, p.cid , c.category_name "+
      "FROM "+
      "ilance_users AS u "+
      "INNER JOIN "+
      "ilance_projects AS p ON u.user_id = p.user_id "+
      "LEFT JOIN " +
      "ilance_category as c ON c.cid=p.cid " +
      "WHERE "+
      "u.user_id = "+ req.headers.userid + "  ORDER BY u."+req.headers.status + " ASC LIMIT "+ skip +" , " +req.headers.limit +" ;"
    }else if (req.headers.skip&&req.headers.limit&&req.headers.userid&&req.headers.status==='category_name') {
      var query="SELECT "+
      "u.username, p.project_title, p.cid , c.category_name "+
      "FROM "+
      "ilance_users AS u "+
      "INNER JOIN "+
      "ilance_projects AS p ON u.user_id = p.user_id "+
      "LEFT JOIN " +
      "ilance_category as c ON c.cid=p.cid " +
      "WHERE "+
      "u.user_id = "+ req.headers.userid + "  ORDER BY c."+req.headers.status + " ASC LIMIT "+ skip +" , " +req.headers.limit +" ;"
    }
    var countquery="SELECT "+
    "count (*) as count "+
    "FROM "+
    "ilance_projects "+
    "WHERE "+
    "ilance_projects.user_id = "+ req.headers.userid + ";"
    console.log(query);
    console.log(countquery);
    db.get().query(query, function (err, result) {
      db.get().query(countquery, function (err, count) {
        if (err) {
          return res.status(err.status).json(err);
        }
        res.status(200).json({'result':result,'count':count});
      });
    });
  }else{
    res.status(200).json({'data':'your session expired!','lgoin':false});
  }
};
