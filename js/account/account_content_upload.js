/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * Загрузка файлов с помощью Flash
 *
 *
 
 jsFlashVars()
 jsComplete(str)
 ShowSingle(obj,name)
 ShowUpload(obj)


 */


function jsFlashVars()
{
	return;

	var flashvars = {};
	flashvars.event = 'Save';
	flashvars._image = name;


	var form = document.getElementById('f');
	var el = form.elements;
	for(i=0; i<el.length; i++) if (/^(target|holder|module|member|s|_\d+_.+)$/.test(el.item(i).name) && !(/_\d+_item/.test(el.item(i).name)))
	{
		var value = encodeURIComponent(el.item(i).value);

//alert(el.item(i).name + "=" + value);
		flashvars[el.item(i).name] = value;
		if (/_chr_name$/.test(el.item(i).name)) flashvars._name = el.item(i).name;
	}

	document.getElementById('tiny_upload').flexFlashVars(flashvars);
}/*jsFlashVars*/



function jsComplete(str)
{
	alert("Обновите страницу")
}/*jsComplete*/



function ShowSingle(obj,name)
{
	var td = obj.parentNode;
	var tr = td.parentNode;
	var table = tr.parentNode;

	while (td.firstChild) td.removeChild(td.firstChild);

	var input1;
	try { input1 = document.createElement('<INPUT name='+ name + '>') } 
	catch (e) { input1 = document.createElement('INPUT'); input1.setAttribute('name',name); }
	input1.setAttribute('type','file');
	td.appendChild(input1);

	var a1 = document.createElement('A');
	a1.appendChild(document.createTextNode('Массовая загрузка'));
	a1.setAttribute('href','#multi');
	a1.onclick = function () { return ShowUpload(a1); }
	td.appendChild(a1);

	table.removeChild(tr.nextSibling);

	document.getElementById('savebutton').disabled = false;
	document.getElementById('cancelbutton').disabled = false;
	if(button=document.getElementById('deletebutton')) button.disabled = false;
	document.getElementById('copy').disabled = false;

	return false;
}/*ShowSingle*/


var name;
function ShowUpload(obj)
{
	var td = obj.parentNode;
	var tr = td.parentNode;
	var table = tr.parentNode;

	var input = td.getElementsByTagName('INPUT')[0];
	name = input.name; // сохраняем имя инпута

	// удаляем все
	while (td.firstChild) td.removeChild(td.firstChild);

	var a1 = document.createElement('A');
	a1.appendChild(document.createTextNode('Стандарная загрузка'));
	a1.setAttribute('href','#single');
	a1.onclick = function () { return ShowSingle(a1, name); }
	td.appendChild(a1);

	var tr1 = document.createElement('TR');
	table.insertBefore(tr1,tr.nextSibling);

	var td1 = document.createElement('TD');
	td1.setAttribute('colSpan', 2);
	td1.setAttribute('height', 22);
	tr1.appendChild(td1);

	var div = document.createElement('DIV');
	div.id='flashContent';
	td1.appendChild(div);

	var text1 = document.createTextNode("(Все файлы будут добавлены с одинаковыми полями из данной формы) Нажмите \xabЗагрузить\xbb а не \xabСохранить\xbb!");
	td1.appendChild(text1);

/*
flashvars.account = 524;
flashvars.event = 'Save';
flashvars.target = 1702;
flashvars.holder = 4014;
flashvars.module = 57154;
flashvars.member = 10352;
flashvars.s = 777777;

flashvars.estate_uid_id = 0;
flashvars._name = '_0_estate_chr_name';
flashvars._image = '_0_estate_img_640x480image'
flashvars._0_estate_img_640x480image_width = 640;
flashvars._0_estate_img_640x480image_height = 480;
*/

	var flashvars = {};
	flashvars.event = 'Save';
	flashvars._image = name;


	var form = document.getElementById('f');
	var el = form.elements;
	for(i=0; i<el.length; i++) if (/^(target|holder|module|member|s|_\d+_.+)$/.test(el.item(i).name) && !(/_\d+_item/.test(el.item(i).name)))
	{
		var value = encodeURIComponent(el.item(i).value);

//alert(el.item(i).name + "=" + value);
		flashvars[el.item(i).name] = value;
		if (/_chr_name$/.test(el.item(i).name)) flashvars._name = el.item(i).name;
	}


	/* For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. */
	var swfVersionStr = "10.0.0";
	/* To use express install, set to playerProductInstall.swf, otherwise the empty string. */
	var xiSwfUrlStr = "/swf/playerProductInstall.swf";
	var params = {};
	params.quality = "high";
	params.bgcolor = "#ffffff";
	params.wmode = "transparent";
	params.allowscriptaccess = "sameDomain";
	params.allowfullscreen = "true";
	var attributes = {};
	attributes.id = "tiny_upload";
	attributes.name = "tiny_upload";
	attributes.align = "middle";

	swfobject.embedSWF("/swf/tiny_upload.swf", "flashContent", "99%", "22", swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
	/* JavaScript disabled so display the flashContent div in case it is not replaced with a swf object. */
	swfobject.createCSS("#flashContent", "display:block;text-align:left;");

	document.getElementById('savebutton').disabled = true;
	document.getElementById('cancelbutton').disabled = true;
	if(button=document.getElementById('deletebutton')) button.disabled = true;
	document.getElementById('copy').disabled = true;

	return false;
}/*ShowUpload*/
