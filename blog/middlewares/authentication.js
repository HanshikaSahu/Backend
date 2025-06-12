const { validateToken } =  require("../service/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if(!tokenCookieValue){
      return next();
    }
    try{
      const userpayload = validateToken(tokenCookieValue);
      req.user = userpayload;
    }
    catch(err){}
    return next();
  }
}

module.exports = {
  checkForAuthenticationCookie,
}