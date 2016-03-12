/*

Для работы в разделе Материалы сайта, обработка поля _col_ Правка 2014-04-03

2016-02-20 Перенёс определение версии браузера


*/

var children = [];
var obj;
if (obj=document.getElementById('list')) children=obj.getElementsByTagName("td");


// Навешиваем на строки таблицы list события onmouseover, onmouseout, ondblclick
// TODO переписать с использованием jQuery
for (i=0;i<children.length;i++) if (children[i].id)
{
	var el = children[i];
		
	var node = el.firstChild ? el.firstChild : el;

	if ((node.nodeType != 3) && (el.firstChild != null)) continue;

	if(is_safari) continue;
	if($.browser.msie && $.browser.version < 8 ) continue;

	el.onmouseover = function () {this.style.backgroundColor='#fdf5ce';}
	el.onmouseout = function () {this.style.backgroundColor='#eeeeee'}
	el.ondblclick = content_tdEdit;
	el.title = 'Двойной клик для редактирования';
}