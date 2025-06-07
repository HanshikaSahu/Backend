const { getUser } = require('../server/Auth');

async function checkForAuthentication(req, res, next){
  const tokenCookie = req.cookies.token;
  
  if (!tokenCookie) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = tokenCookie;
  const user = await getUser(token);

   if (!user) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  req.user = user;
  next();
}

function restrictTo(roles = []){
  return function(req, res, next){
    if(!req.user){
      return res.redirect("/login");
    }
    if(!roles.includes(req.user.role)){
      return res.end("UnAuthorized");
    }
  }
}


module.exports = {
  checkForAuthentication,
  restrictTo,
}
