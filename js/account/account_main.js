/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * Основные функции

 main_OpenMe(img)
 main_Toggle(i)
 main_msg(str,type)
 main_StatusXMLHTTP()
 main_CheckXMLHTTP()
 main_SerializeForm(form)
 main_AJAX(form, checkState)

 Kirill Ivanov
 noteInit()
 setPopup()
 tipBubble(el, src, text)

 2015-04-27 Добавил if (disabled) continue;
 2015-06-02 Добавил main_OpenMe(img)


*/

var CHANGED=0;
var CodeMirrorID={};	// ID всех textarea которые CodeMirror превратил в редактор 
var TYPE = {
1 : "Действие:",
2 : "Подсказка:",
3 : "Предостережение:",
4 : "Ошибка:"
};


/*---------------------------------------------------------------------------*/

// Открывает ветку в иерархии модулей или шаблонов
function main_OpenMe(img)
{
	var id=img.id.replace(/^i_/,"");
	if((o=document.getElementById("module_"+id)) && o.className) o.className=(o.className=='closed')?'opened':'closed';

	if((o=document.getElementById("f_"+id)) && o.src) o.src=(/clsfld/.test(o.src)) ? o.src.replace(/clsfld/,'opnfld') : o.src.replace(/opnfld/,'clsfld');
	if((o=document.getElementById("i_"+id)) && o.src) o.src=(/\/plus/.test(o.src)) ? o.src.replace(/\/plus/,'/minus') : o.src.replace(/\/minus/,'/plus');
}//main_OpenMe


/* Открывает/закрывает <fieldset> */
function main_Toggle(i)
{
	if(o=document.getElementById(i))
	{
		if (o.style.display!='block') {
			// был закрыт, открыли
			o.style.display='block'; main_msg('Открыли раздел '+i+'.');
			o.classList.remove('hide');

			$('textarea.codemirror', o).each(function() {
				var textarea = this;
				var mode = $(this).attr('mode');
				var id = $(this).attr('id');
				var IsDisabled = $(this).prop('disabled');	// <textarea disabled="disabled">

				// CodeMirrorID - полный список ID, глобальная перерменная, опрееделена в account_main.js var CodeMirrorID={};
				if (!(id in window.CodeMirrorID)) window.CodeMirrorID[id] = CodeMirror.fromTextArea(textarea, {mode:mode,readOnly:IsDisabled,matchTags:{bothTags:true} }); 
			});

		}
		else {
			o.style.display='none'; main_msg('Закрыли раздел '+i+'.');
		}

		if(o.style.display=='block') cookies_Set(i, 'true');
		else cookies_Delete(i);
		
	}
}/*main_Toggle*/

/*---------------------------------------------------------------------------*/

function main_msg(str,type)
{
	if (!type) type=1;
	if (div=document.getElementById('tip')) 
	{
		div.innerHTML = 
		'<span class=msg_type>'+TYPE[type]+'</span>'
		+'<span class=msg>'+str+'</span>';
	}
}/*main_msg*/

/*---------------------------------------------------------------------------*/

function main_StatusXMLHTTP() 
{
	try { 
		request = new ActiveXObject('Microsoft.XMLHTTP'); 
	} 
	catch(e) // Mozilla
	{ 
		try { request = new XMLHttpRequest() }
		catch (e) 
		{ 
			alert(e.message)
			return e;
		}
	}

	return true;
}

function main_CheckXMLHTTP()
{
	if ((e=main_StatusXMLHTTP())==true) { alert('XMLHTTP работает!'); return true}
	else { alert(e.name+'\n'+e.message+'\nкороче, не работает!'); return false}
}/*main_CheckXMLHTTP*/

/*---------------------------------------------------------------------------*/


function main_SerializeForm(form)
{
	var result = [];

	var elements=form.elements;
	for (i=0; i<elements.length;i++)// if (elements[i].value)
	{
		var type=elements[i].type;
		var name=elements[i].name;
		var value=elements[i].value;
		var checked=elements[i].checked;
		var disabled=elements[i].disabled;

		if (!name) continue;
		if (disabled) { continue;} // alert(name +' is ' +disabled);
		if (type == 'checkbox') value = (checked==true) ? "1":"0";
		if (type == 'radio' && !checked) continue;

		value=encodeURIComponent(value); // начиная с версии IE 5.5

		result[result.length] = name+"="+value;
	}
//	alert(result.join('&'))
	return result.join('&');
}/*main_SerializeForm*/



function main_AJAX(form, checkState) 
{
	if (form.xml.checked==false) return true;

	// Проверим. не загружаем ли случаем файл ...
	var files=[];
	for (i=0; i<form.elements.length;i++)
	{
		if(form.elements[i].type=='file' && form.elements[i].value) files[files.length] = form.elements[i].name;
	}


	try { request = new ActiveXObject("Msxml2.XMLHTTP"); } 
	catch (e1) 
	{
		try { request = new ActiveXObject("Microsoft.XMLHTTP"); } 
		catch (e2) 
		{
			try { request = new XMLHttpRequest() }
			catch (e3) 
			{ 
				return confirm('ActiveX XMLHTTP не работает,\nснимите галочку \047XMLHTTP\047\nотправка данных произойдёт через перезагрузку страницы.\nПродолжить?');
			}
		}
	}


	var elements=form.elements;
	for (i=0; i<elements.length;i++)// if (elements[i].value)
	{
		if (elements[i].id in CodeMirrorID) CodeMirrorID[elements[i].id].save();	// если textarea превращён в редактор
	}

	/*
	Maximum URL Length
	It turned out that only Internet Explorer (up to version 7.0) has a limit. According to a document on Microsoft's help and support site, 
	IE may accept a URL of 2083 characters max. Moreover, the path (that is www.example.org/this/is/the/path) may have a length of 2048 characters. 
	As far as other browsers are concerned (Firefox, Safari, Opera), they practically have no limits in the URL length. 
	Web servers, however, do have such limits, but this is normal for a server.
	*/
	
	request.open('POST','/cgi-bin/reestr_xmlhttp.cgi',true)	// true значит Асинхронный

	if (window.FormData)
	{
		var formData = new FormData(form);
		formData.append("XMLHTTP", 1);
		// Объект formData можно сразу отсылать, интеграция FormData с XMLHttpRequest встроена в браузер. Кодировка при этом будет multipart/form-data.
		request.send(formData);
	}
	else if (files.length > 0)
	{
		// не умеем загружать файлы
		return true;
	}
	else
	{
		var postdata="XMLHTTP=1&"+main_SerializeForm(form);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
		request.send(postdata);
	}

		

	if (arguments.length==2) request.onreadystatechange = checkState; 
	else request.onreadystatechange = function() 
	{
		if(request.readyState==4) 
		{ 
			if(request.status==200)
			{
				try { eval(request.responseText) }
				catch (e) 
				{ 
					alert("ОШИБКА:\n\n" + request.responseText); 
					main_msg('Ошибка JavaScript! Повторите операцию, если ошибка возникнет вновь, сообщите support@plarson.ru', 4);
				}
//		alert(request.responseText);
				delete request; 
				CHANGED=0;
			}
			else
			{
				alert("ОШИБКА:\n\n" + request.responseText); 
				main_msg('Ошибка на сервере! Повторите операцию, если ошибка возникнет вновь, сообщите support@plarson.ru', 4);
			}
		}
	}

	main_msg('Сохраняем данные, подождите ...');
	return false;
}/*main_AJAX*/

/*---------------------------------------------------------------------------*/



/* Иванов Кирилл */


/*тикеты*/

// http://stackoverflow.com/questions/14354040/jquery-1-9-live-is-not-a-function
$('body').on('click', 'img.quote', function() {

//$('img.quote').live('click',function() {
	var tr = $(this).parent().parent();
// Textarea 
	var target = $('#description');
// Имя автора комментария
	var qAuthor = tr.find('.user').text();
// Дата комментария
	var qDate = tr.find('.date').text();
// Текст коментария
	var qComment = tr.find('.note-plane').text();

// Сушествующее содержимое textarea
	var exText = target.val();
//	target.val(exText + '[quote][b]' + qAuthor + '[/b] в ' + qDate + '\r\n' + qComment + '[/quote]\r\n');
	target.val(exText + '> '	+ qComment + '\r\n');

// Прокручиваем страницу
	var target_offset = target.offset();
	var scroll_to = target_offset.top;
	$('html, body').animate({scrollTop:scroll_to}, 50);

	target.focus();
	return false;
});

function noteInit() 
{
	$('.attach').each(function() {
		if( $(this).find('a').length < 1 ) { $(this).hide(); }
		else { $(this).parents('.ticket-answer-row').find('.info').addClass('attached'); }
	});

	var trs = $('.ticket-answer-row');
	if( trs.length > 3 ) {
		$.each(trs, function(i) {
			var tr = $(this);
			var more = tr.find('.more');
			var contact = tr.find('b.user').html();
			var date = tr.find('span.date').html()
			
			more.attr('alt','Развернуть/свернуть ответ:<br>' + contact + '<br>' + date )
			more.on({
				'mouseenter': function() { more.addClass('hover') },
				'mouseleave' : function() { more.removeClass('hover') },
				'click' : function() { tr.toggleClass('collapsed'); }
			});

			 	if( trs.length > i+2 ) { tr.addClass('collapsed'); }

		});

		var headermore = $('<span/>',{'class':'more open', 'alt':'Развернуть/свернуть все ответы в тикете'}).html('(Показать/скрыть переписку)').appendTo( $('#header-answers h4') );
		headermore.on({
			'mouseenter': function() { headermore.addClass('hover') },
			'mouseleave' : function() { headermore.removeClass('hover') },
			'click' : function() {
				if( headermore.hasClass('open') ) {
					trs.removeClass('collapsed');
					headermore.removeClass('open');
				}
				else {
					trs.addClass('collapsed');
					headermore.addClass('open');
				}
			}
		});
	}
}//noteInit

function setPopup() 
{
	$("acronym, img.pico, img.pico2, #list a[thumb!='false'][target='_blank'], .window1 a[thumb!='false'][target='_blank'], .more").each(function(index) {

		var src = '';

		if($(this).attr('target')=='_blank') {
			var re = /(\/i\/.*)/;
			var res = re.exec($(this).attr('href'));

			if (res && res.length>0)
			{
				var href = res[1];
				var src = '<div class="img"><img src="'+href+'"></div>';
			}
		}
		else {
			var text = $(this).attr('title') ? $(this).attr('title') : $(this).attr('alt');
			var src = '<div class="cont">'+text+'</div>';
			$(this).removeAttr('title').removeAttr('alt');
			//$(this).removeAttr('onclick');
					}
		tipBubble( $(this), src, text );

	});
}/*Подсказки и превью для картинок в материалах*/

function tipBubble(el, src, text) 
{

//	if(!text || !src ) return false;
	var popup;
	$(el).bind({
		mouseenter: function(e){
			$(this).removeAttr('title').removeAttr('alt');
			$('.popup-tip').remove();
			popup = $('<div class="popup-tip"></div>').html('<div class="arrow"></div>'+src);
			popup.css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo( $('body') );
			
			var css;
			var pos = $.extend({}, $(this).offset(), { xel: $(this)[0].offsetWidth, yel: $(this)[0].offsetHeight, xpop: popup[0].offsetWidth, ypop: popup[0].offsetHeight });

//			console.log('xwin:', $(window).width(), 'ywin:', $(window).height()+ $(window).scrollTop() ,'left:', pos.left,' top:', pos.top,' xel:', pos.xel,' yel:', pos.yel,' xpop:', pos.xpop,' ypop:', pos.ypop );

			if ( pos.top + pos.yel + pos.ypop + 20 >	$(window).height() + $(window).scrollTop() && pos.left + pos.xel + pos.xpop + 20 >	$(window).width() ) {
				popup.addClass('arrow-right arrow-bottom');
				css = {top: pos.top + pos.yel*1.5 - pos.ypop, left: pos.left - pos.xpop - 5};
			}
			else if (pos.top + pos.yel + pos.ypop + 20 >	$(window).height() + $(window).scrollTop() ) {
				popup.addClass('arrow-left arrow-bottom');
				css = {top: pos.top + pos.yel*1.5 - pos.ypop, left: pos.left + pos.xel};
			}
			else if (pos.left + pos.xel + pos.xpop + 20 >	$(window).width() ) { 
				popup.addClass('arrow-right');
				css = {top: pos.top - pos.yel/2, left: pos.left - pos.xpop - 5};
			}
			else {
				popup.addClass('arrow-left');
				css = {top: pos.top - pos.yel/2, left: pos.left + pos.xel };
			}
			if(src)	popup.css(css).css({visibility: 'visible'});
			 		},
		mouseleave: function(e){
			if(text) { $(this).attr({'title':text,'alt':text}); }
			popup.remove();
		}
	});
}//tipBubble


// Shorthand for $( document ).ready()
$(function() {

	// Управление менюшкой
	// 2015-01-05
	$('.item span').click(function() {
		if( $(this).parent().hasClass('active') ) {
			$('.item').removeClass('active');
		}
		else {
			$('.item').removeClass('active');
			$(this).parent().addClass('active');
		}
	});

	$('#handle').click(function() {
		$(this).parent().toggleClass('collapse');

		if($(this).parent().hasClass('collapse')) cookies_Set('collapse', 'true'); else cookies_Delete('collapse');
	});

	// скрываем правую панель
	if (cookies_Get('collapse')) $('#handle').parent().toggleClass('collapse');


	//Показываем окно владельцам старых браузеров, что пора обновиться
	$.reject({
		reject: {msie6: true }, // Reject all renderers for demo
		header: 'Внимание! Вы используете устаревший браузер.', // Header Text	
		paragraph1: 'Данный сайт построен на передовых, современных технологиях и не поддерживает устаревшие версии браузеров.', // Paragraph 1	
		paragraph2: 'Настоятельно рекомендуем Вам выбрать и установить любой из современных браузеров. Это бесплатно и займет всего несколько минут.', // Paragraph 2	
		close: false,
		imagePath: '/i/account/browsers/',
		overlayBgColor: 'url(/i/account/popup/popup-overlay.png)'	
	});

	// Для тикетов
	noteInit();

	//Подключаем подсказки и превью картинок
	setPopup();

	//Делаем эффект для кнопок
	$("input.savebutton, input.deletebutton, input.cancelbutton, input.addbutton, input.copybutton").each( function() {
		$(this).mouseover(function() { $(this).addClass('button-over') });
		$(this).mouseout(function() { $(this).removeClass('button-over button-clicked') });
		$(this).click(function() { $(this).addClass('button-clicked') });
	});
	//Делаем эффект для кнопок меню
	$("#menu table").each( function() {
		$(this).css("")
		$(this).mouseover(function() { $(this).addClass('menu-item-over') });
		$(this).mouseout(function() { $(this).removeClass('menu-item-over menu-item-clicked') });
		$(this).click(function() { $(this).addClass('menu-item-clicked') });
	});


	//2015-04-13
	if ($(document).tooltip) $(document).tooltip({
		items: "[tip]",
		content: function() { return $( this ).attr("tip"); },
		position: { my: "left+10 bottom-5", at: "left top", collision: "flipfit" }
	});

});
