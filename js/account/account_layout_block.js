/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * 2012.05.08 ������������ ������� name() � get_name(); ������� alt = synopsis()
 * 2015-06-28 ��������� ��� ��������� �� �������, ������� ��������
 * Block[Block.length] = new TBlock(136715,     'cell_2',0,     19,31,'Simpletext');

 ������������ ���������� ���������� Href

 TBlock(module,cell,index,template,palette,name)

 Array.prototype.Exists
 Array.prototype.Paint
 Array.prototype.Delete
 Array.prototype.Serialize

 block_sort_by_index(a, b)
 block_openHelp(li)
 block_checkState()
 block_property(li)
 block_drop(li)

 Helper.onDragStart
 Helper.onDrag
 Helper.onDragEnd

 ������������ module_layout.html

<link rel="stylesheet" href="/css/account/account_layout.css" type="text/css">
<script type="text/javascript">
var Href = "?p=account2&s=549888&target=14&id=1319&module=";
</script>
<script type="text/javascript" src="/js/tool-man/coordinates.js"></script>
<script type="text/javascript" src="/js/tool-man/drag.js"></script>
<script type="text/javascript" src="/js/tool-man/dragdrop.js"></script>
<script type="text/javascript" src="/js/account/account_layout_block.js"></script>
<script type="text/javascript" src="/js/account/account_layout_palette.js"></script>


*/


var ID;

function TBlock(module,cell,i,template,palette_index,module_name)
{
	this.module = module;	// module.$fld_Module_Id
	this.cell = cell;	// module.$fld_Module_Cell - ������ ������
	this.index = i;	// module.$fld_Module_Index
	this.template = template;// module.$fld_Module_Template - ������ ������
	this.palette_index = palette_index;
	this.module_name = module_name;	// module.$fld_Module_Name

	this.get_palette = function () {
		if(SET[this.palette_index]) return SET[this.palette_index].palette;
	};
	this.get_module_name = function () { 
		if(this.module) return this.module_name;
		if(SET[this.palette_index] && SET[this.palette_index].items[this.template]) return SET[this.palette_index].items[this.template][0];
	};
	this.multi = function () { 
		if(SET[this.palette_index] && SET[this.palette_index].items[this.template]) return SET[this.palette_index].items[this.template][1];
	};
	this.synopsis = function () { 
		if(SET[this.palette_index] && SET[this.palette_index].items[this.template]) return SET[this.palette_index].items[this.template][2];
	};
	this.color = function () { 
		if(SET[this.palette_index] && SET[this.palette_index].items[this.template]) return SET[this.palette_index].items[this.template][3];
	};
	this.serialize = function(i) { 
		return ('id'+i+'='+this.module) + ('&cell'+i+'='+this.cell.replace(/cell_/,'')) + ('&index'+i+'='+this.index) + ('&key'+i+'='+this.template); 
	}
	this.createElement = function(target) {

		var eItem = document.createElement( 'li' );
		eItem.style.backgroundColor = this.color() ? this.color() : '';
		eItem.title = this.get_module_name();
		eItem.palette = this.get_palette();
		eItem.palette_index = palette_index;
		eItem.module = module;
		eItem.template = template;
		eItem.multi = this.multi();

//		eItem.oncontextmenu = function () { alert('module:'+this.module+' palette:'+this.get_palette()+' template:'+this.template+' multi:'+this.multi+' title:'+this.title+"\nnext:"+(this.nextItem?this.nextItem.title:'undef')); return false;}
//		eItem.oncontextmenu = function () { alert(this.palette_index) }

		eItem.innerHTML = 
		(
			/cell/.test(target) ? 
		 	'<img class=pico src="/i/account/drop.gif" alt="�������" onclick=block_drop(this.parentNode)>' :
			 ''
		)
		+ (
			/cell/.test(target) ? 
			// ������
			('<a href="'+Href+this.module+'" onclick="return false"><img class=pico src="/i/account/'
			+ (
				this.module ? 
				'props.gif" alt="����������/�������� ��������"' :
				'edit.gif" alt="������ �������� ������ ����������"'
			)
			+ ' onclick=block_property(this.parentNode.parentNode)></a>') :
			// ������ ��������
			'<img class=pico src="/i/account/' + (this.module ? 'props.gif" alt="������"': 'help.gif" alt="' + this.synopsis() + '"') + ' ondragstart="return false;">'
		)
//		+this.index+'-'
		+( /cell/.test(target) ? (this.index+'.') : '')
		+this.get_module_name()
//		+'-i='+i
//		+'-module='+this.module
		return eItem;	
	};
}/*TBlock*/

Array.prototype.Exists = function(template) 
{
	var i;
	for(i in this)	// ���������� ��� ��������, � ��� ����� �-��
	{
		if (this[i] instanceof TBlock && this[i].template==template) return true; 
	}
	return false; 
}

/* �������� ������� ��������� � ������ �������� */
Array.prototype.Paint = function ()
{
	if (arguments.length==0) arguments = Targets;

	for (var k=0; k<arguments.length; k++) 
	{
		var target = arguments[k];
		var list=document.getElementById(target);
		if (!list) 
		{
			alert("�� ����� � HTML-���� Layout'� ������ #"+target+", ������� ���� � ������ Targets:\n"+Targets.toString()+"\n�� ������ �������� ������ � ���� ������!\n\n�������� ��� ������?\n��� ���:\nvar list=document.getElementById('"+target+"')");
			continue;
		}

		var li = list.childNodes;
		for(i=0;i<li.length;) list.removeChild( li[i] );
	
		if (list) 
		{
			for(i in this) if (this[i] instanceof TBlock && this[i].cell == target)
			list.appendChild( this[i].createElement(target) );
					
			DragDrop.makeListContainer( list );
			list.onDragOver = function() 
			{ 
				this.className = 'target active';

//				this.style["border"] = "1px dashed #00f"; 
//				this.style["backgroundColor"] = "yellow";
			};
			list.onDragOut = function() 
			{ 
				this.className = 'target';
//				this.style["border"] = "none"; 
//				this.style["backgroundColor"] = "white";
			};
		}
		else alert('Can not locate object '+target+'!');
	}
}/*array_Paint*/


Array.prototype.Delete = function(i) 
{
//	delete this[i]; return this; //- ��� �� �������� ���������� � Mozilla!!!
	return (this.slice(0,i)).concat(this.slice(i+1)) 
}

// ���������� ������� � �������
function block_sort_by_index(a, b) {
	 if (a.index < b.index) return -1;
	 if (a.index > b.index) return 1;
	 if (a.index == b.index) return 0;
}/*block_sort_by_index*/

Array.prototype.Serialize = function ()
{
	var series = [];

	var ul = document.getElementById('f').getElementsByTagName("UL");

	for (var target=0; target<ul.length; target++) if (/cell_/.test( ul.item(target).id ))
	{
		var cell = ul.item(target).id.replace(/cell_/,'');
		var li = ul.item(target).childNodes;

		for (var index=0; index<li.length; index++)
		{
			var i = series.length+1;

			var module = li.item(index).module;
			var template = li.item(index).template;
			var serialize = ('id'+i+'='+module) + ('&cell'+i+'='+cell) + ('&index'+i+'='+index) + ('&key'+i+'='+template);

			series[series.length] = serialize;
		}
		
	}

	var postdata = "";
	if (series.length) postdata += series.join("&");
	return postdata;
}/*array_Serialize*/


function block_openHelp(li)
{
//	return alert('block_openHelp!');

	if (li == null) return alert('�� ���� ����� ������ <LI>');
	var palette = li.palette;
	var palette_index = li.palette_index;

	var template = li.template;
	var synopsis = SET[palette_index] ? SET[palette_index].items[template][2] : '�� �������';
	var name = li.title;

	if (window.win && !win.closed) win.close();
	win = window.open('about:blank',2,'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1,width=400,height=300,top=100,left=100');
	var body = '<html><head>\n<title>'+name+' - ������</title>\n'
	 + '<body leftmargin=5 topmargin=5 rightmargin=5 bottommargin=5 bgcolor=#f5f5dc>\n'
	 + '<h4>'+name+'</h4>'
	 + synopsis
	 + '</body></html>';
	win.document.write(body);
	win.document.close();
	win.focus();
}/*block_openHelp*/


function block_checkState()
{ 
	if(request.readyState==4)
	{
	eval(request.responseText);
	delete request;
	window.location.href = Href+ID;
	CHANGED=0;
	}
}/*block_checkState*/


function block_property(li)
{
	if (li == null) return alert('�� ���� ����� ������ <LI>');
	var module = li.module;
	var name = li.title;

	ID = module;

	if (module>0)
	{
		document.forms['f'].elements['layout'].value=Block.Serialize();	

		if (CHANGED==0) {window.location.href = Href+module;}

		else if (main_AJAX(document.forms['f'], block_checkState)==true && confirm('��������� �� �������� �������������� ������ \047'+name+'\047,\n�� ��������� ������� ������?\n(\047Ok\047 - ����������)'))
		{window.location.href = Href+module;}
	}
	else alert('������ ������� �� �������� �������������� ������ \047'+name+'\047, �.�. �� �� �������� � ������� ������.')

}/*block_property*/



function block_drop(li)
{
	if (li == null) return alert('�� ���� ����� ������ <LI>');

	var module = li.module;
	var name = li.title;
	var multi = li.multi;
	var template = li.template;
	var palette_index = li.palette_index;
	var palette = li.palette;
	var i = li.id;

	if(confirm('������� ����"'+name+'" �� '+li.parentNode.id.replace(/cell_/,'������ ')+'?'))
	{
		if (multi>0) 
		{ 
			main_msg('������� ������� &laquo;'+name+'&raquo;'); 
			if (li.parentNode != null) li.parentNode.removeChild( li );
		}
		else 
		{
			main_msg('������� &laquo;'+name+'&raquo; ��������� � ������ �'+('panel_'+palette));
			li.module = 0; 

			var parent = document.getElementById('panel_'+palette);
			li.parentNode.removeChild( li );

			// TBlock(module,cell,index,template,palette_index,name)
			var newElement = (new TBlock(0,'panel_'+palette,0,template,palette_index,name)).createElement('panel_'+palette);
			parent.appendChild( newElement );
			DragDrop.makeItemDragable(newElement);

		}
		CHANGED=1;
	}
}/*block_drop*/

Helper.onDragStart = function (item)
{
	if (/cell_/.test(item.parentNode.id))
	{
		var cell = item.parentNode.id;
		main_msg('����� ������� &laquo;'+item.title+'&raquo; �� ������ �'+cell.replace(/cell_/,'')+'.');
	}
	else
	{
		main_msg('����� ������� &laquo;'+item.title+'&raquo; �� ������� <b>'+SET[item.palette_index].name+'</b>.');
	}

/*
	var top = parseInt(item.style["top"]) || 0;
	var left = parseInt(item.style["left"]) || 0;
	item.style["top"] = top+1+'px';
	item.style["left"] = left+1+'px';
*/

}

Helper.onDrag = function (item) 
{
	item.style["maxWidth"] = "250px";
}

Helper.onDragEnd = function (item) 
{
	var src = item.oldContainer.id;
	var dest = item.parentNode.id;

	// if the drag ends and we're still outside all containers
	// it's time to remove ourselves from the document
	// ����������, ���������� ���� ������ �����!
	if (item.isOutside) 
	{
		var container = item.oldContainer;	// ����� ������ �� id, � Mozilla ���� �����
		item.isOutside = false;

		var tempParent = item.parentNode; // ������� <UL>
		tempParent.removeChild( item ); // ������� <LI>
		container.appendChild( item );
		tempParent.parentNode.removeChild( tempParent ); // ������� ��� ������� <UL>

		DragUtils.swap(item, item.nextItem);

		main_msg('������� &laquo;'+item.title+'&raquo; ��������� �� ����� � ������ �'+dest.replace(/(cell|panel)_/,'')+'.');
	}
	else
	{
		// ������ ����������� � �������
		if (/panel_/.test(src) && /panel_/.test(dest))
		{
			if (src!=dest)
			{
				var container = document.getElementById( src );
				item.parentNode.removeChild( item );
				container.appendChild( item );
			}
			DragUtils.swap(item, item.nextItem)
			main_msg('������� &laquo;'+item.title+'&raquo; ��������� �� ����� � ������ �'+dest.replace(/panel_/,'')+' (������ ������������� � �������).');

		}
		// ����� �� �������
		else if (/panel_/.test(src))
		{
			if (item.multi==0) 
			{
				main_msg('������� &laquo;'+item.title+'&raquo; ��������� � ������ �'+dest.replace(/cell_/,'')+' (�����).');
			}
			else 
			{ 	
				// ������ ������� ������ ��� �������
				var container = document.getElementById( src );
				var Element = (new TBlock(0/*module*/,src,0/*index*/,item.template,item.palette_index,item.title)).createElement(src);
				container.appendChild( Element );
				DragDrop.makeItemDragable( Element );
				DragUtils.swap(Element, item.nextItem); // ����� ���� ������


				main_msg('������� &laquo;'+item.title+'&raquo; ���������� � ������ �'+dest.replace(/cell_/,'')+' (�����).');
			}

			// ������� ����� ���� � ������ ��� �� ������ ����, ��� ����������
			var newElement = (new TBlock(0/*module*/,dest,0/*index*/,item.template,item.palette_index,item.title)).createElement(dest);
			item.parentNode.replaceChild(newElement, item);
			DragDrop.makeItemDragable(newElement);
			CHANGED=1;
		}
					// ����������
		else if (src==dest) 
		{ 
			main_msg('�������� ����� �������� &laquo;'+item.title+'&raquo; � ������ �'+dest.replace(/cell_/,'')+'.');
			CHANGED=1;
		}
		// ����� �� ������ � �������� �������� � �������
		else if(/cell_/.test(src) && /panel_/.test(dest)) 
		{
			var container = document.getElementById( src );
			item.parentNode.removeChild( item );
			container.appendChild( item );
			DragUtils.swap(item, item.nextItem)
			main_msg('������ ������� &laquo;'+item.title+'&raquo; ������� ����� � �������, �� ��� ����� �������.');
		}
		else
		{
		 	main_msg('������� &laquo;'+item.title+'&raquo; ��������� � ������ �'+dest.replace(/cell_/,'')+'.');
			CHANGED=1;
		}

	}
	item.style["maxWidth"] = "100%";
}/*Helper.onDragEnd*/
