/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * Работа с куками

 cookies_Set(name, value) 
 cookies_Get(sName)
 cookies_Delete(name)

*/

var expDays = 30;
var DefaultExp = new Date(); 
DefaultExp.setTime(DefaultExp.getTime() + (expDays*24*60*60*1000));

function cookies_Set(name, value) 
{
	var argv = cookies_Set.arguments;  
	var argc = cookies_Set.arguments.length;  
	var expires = (argc > 2) ? argv[2] : DefaultExp;
	var path = (argc > 3) ? argv[3] : null;  
	var domain = (argc > 4) ? argv[4] : null;  
	var secure = (argc > 5) ? argv[5] : false;  

	var cookie = name + "=" + escape (value) + 
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + 
	((path == null) ? "" : ("; path=" + path)) +  
	((domain == null) ? "" : ("; domain=" + domain)) +    
	((secure == true) ? "; secure" : "");

	document.cookie = cookie;
}/*cookies_Set*/

function cookies_Get(sName)
{
	var aCookie = document.cookie.split("; ");
	for (var i=0; i < aCookie.length; i++)
	{
		var aCrumb = aCookie[i].split("=");
		if (sName == aCrumb[0]) 
		return unescape(aCrumb[1]);
	}
	return null;
}/*cookies_Get*/

function cookies_Delete(name) 
{
	var exp = new Date();  
	exp.setTime (exp.getTime() - 1);  
	// This cookie is history  
	var cval = cookies_Get (name);  
	document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}/*cookies_Delete*/
