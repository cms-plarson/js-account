/*

��� ������ � ������� ��������� �����, ��������� ���� _col_ ������ 2014-04-03

2016-02-20 ������ ����������� ������ ��������


*/

var children = [];
var obj;
if (obj=document.getElementById('list')) children=obj.getElementsByTagName("td");


// ���������� �� ������ ������� list ������� onmouseover, onmouseout, ondblclick
// TODO ���������� � �������������� jQuery
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
	el.title = '������� ���� ��� ��������������';
}