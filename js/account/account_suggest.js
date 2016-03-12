/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * 2012.11.07
 * Все функции для ренедринга палитры
 *
 *
 suggest_Show(id)
 suggest_KeyUp(obj)
 suggest_KeyDown(obj,e)


 */


var suggestTime1 = [];
var suggestTime2 = [];


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Показывает список "google-suggest" 
* * * * * * * * * * * * * * * *  * * * * * * * * * * * * * * * * */
function suggest_Show(id)
{
	var ul = $('#suggest'+id);
	if (!ul.length) 
	{ 
		ul = $('<ul>').addClass("suggest").attr("id", 'suggest'+id); $("body").append(ul); 

		ul.bind({
			'mouseleave' : function(e) {
				if (suggestTime2[id]) window.clearTimeout(suggestTime2[id]);
				suggestTime2[id] = setTimeout(function() { ul.hide() }, 3000);
			},
			'mouseover'  : function(e) {
				if (suggestTime2[id]) window.clearTimeout(suggestTime2[id]);
			}
		});
	}

	ul.html('');
	
	if (words.length == 0) return;

	for(var i=0; i<words.length; i++)
	{
		var li = $('<li>');
		var a = $('<a>').attr('href', '#').html(words[i].name).attr('key',words[i].id);
		a.click( function () { $('#'+id).val( $(this).text()); $('form#f input[name='+id+']').val( $(this).attr('key') ); return false;} );
		li.append(a);
		ul.append(li);
	}

	// позиционируем в нужном месте список
	var offset = $('#'+id).offset();
	ul.css({'top':offset.top+20, 'left':offset.left}).attr("pos", -1).show();

	if (suggestTime2[id]) window.clearTimeout(suggestTime2[id]);
	suggestTime2[id] = setTimeout(function() { ul.hide() }, 3000);

}/*suggest_Show*/



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Вызывается при отпускании клавиши в инпуте, событие onkeyup 
* * * * * * * * * * * * * * * *  * * * * * * * * * * * * * * * * */
function suggest_KeyUp(obj)
{
	var old = $(obj).attr('OldValue');
	var id = $(obj).attr('id');
	var data = $(obj).attr('data');
	var holder = $(obj).attr('holder');
	var value = $(obj).val();

	var re = /s=(\d+)/;
	var arr = re.exec(window.location.href);
	

	var hash = {};
	hash.s = arr[1];
	hash.event = 'Show';
	hash.target = 'suggest';
	hash.data = data;
	hash.holder = holder;
	hash.string = value;


	if (value.length<1) return;

	if (old != value) 
	{
		if (suggestTime1[id]) window.clearTimeout(suggestTime1[id]);
		suggestTime1[id] = setTimeout(function() {
		$.ajax({
			type: "POST",
			url: '/cgi-bin/reestr_xmlhttp.cgi',
			data: $.param(hash),
			dataType: 'html',
			context: obj,
			success: function (data) { eval(data);  suggest_Show(id);	}
			});
		}, 300);
	}

	$(obj).attr('OldValue',value);
}/*suggest_KeyUp*/

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
Вызывается при НАЖАТИИ клавиши в инпуте, событие onkeydown 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function suggest_KeyDown(obj,e)
{
	var id = obj.id;

	if (obj.value.length == 0) $('form#f input[name='+id+']').val(0); // стёрли значение

	var code;
	if (!e) e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;

	var ul = $('#suggest'+id);
	if (!ul) return;
	var pos = ul.attr('pos');
	var li = $(ul).children();

	if (code == 38 && pos>0) pos--; // up
	else if (code == 40 && pos<li.length-1) pos++; // down
	else if (code == 13) {
		e.cancelBubble = true;
		e.returnValue = false;
		if (e.stopPropagation) 
		{   
			e.stopPropagation();
			e.preventDefault();
		}
		if (suggestTime2[id]) window.clearTimeout(suggestTime2[id]);
		ul.hide();
	}
	else return;

	if (ul.css('display') == 'none') return;

	// Сдвигаем выделенный пункт в списке
	li.each(function(index, obj) { $(obj).removeClass("cur nor"); $(obj).addClass(pos==index ? 'cur' : 'nor'); } );
	ul.attr('pos',pos);


	// Меняем значение в инпуте
	var value = li.eq(pos).find('a').text();
	var key  = li.eq(pos).find('a').attr('key');
	$(obj).val(value);
	$(obj).attr('OldValue',value);

	$('form#f input[name='+id+']').val( key );


	if (suggestTime2[id]) window.clearTimeout(suggestTime2[id]);
	suggestTime2[id] = setTimeout(function() { ul.hide() }, 3000);
}/*suggest_KeyDown*/