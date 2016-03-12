
/* 
 * Иванов Кирилл 
 * Техподдержка
 * plarson.ru\lib\Account\moulds\account\account_support_list.html
 * plarson.ru\lib\Account\moulds\account\account_support.html

 noteInit()


*/


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
	target.val(exText + '> '  + qComment + '\r\n');

// Прокручиваем страницу
	var target_offset = target.offset();
	var scroll_to = target_offset.top;
	$('html, body').animate({scrollTop:scroll_to}, 50);

	target.focus();
	return false;
});

function noteInit() {
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
			.hover(function() { $(this).addClass('hover') }, function() { $(this).removeClass('hover') })
			.toggle(function() { tr.removeClass('collapsed'); }, function() { tr.addClass('collapsed'); });

		   	if(i+1<trs.length) { tr.addClass('collapsed'); }

		});
		var headermore = $('<span/>',{'class':'more', 'alt':'Развернуть/свернуть все ответы в тикете'}).html('(Показать/скрыть переписку)').appendTo( $('#header-answers h4') );

		headermore.toggle(function() { trs.removeClass('collapsed'); }, function() { trs.addClass('collapsed'); });	}
}


$(function() {

	noteInit();

});
