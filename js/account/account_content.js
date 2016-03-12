/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * ��� ������ � ������� ��������� �����
 * ������ 2014-04-03

 content_ButtonUpdate()
 content_MoveItems(button)
 content_CopyItems(button)
 content_ChangeMember(select)
 content_tdEdit(object)
 content_Serialize() �� ������ � main_SerializeForm(form) �� account_main.js
 content_Load(form)
 content_RemoveItems(button)
 content_SubmitForm(form)
 content_Toggle(object)
 content_ToggleList(obj)
 content_ChangeSet(obj)
 content_ClickSet(obj)
 content_transliteNameToURL()


*/

// ������ ������
var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_safari = navigator.userAgent.indexOf('Safari') > -1;
if ( is_chrome && is_safari ) is_safari = false;


/* �������� � ��������� �������� ������ */
function content_ShowPan(obj) 
{ 
//	document.getElementById(obj.value).style.display = obj.checked ? 'table' : 'none'; 
//	Select(obj.value)

  if(o=document.getElementById(obj.value))
  {
    if (obj.checked) {o.style.display='table'; main_msg('������� ������ '+obj.value+'.');}
    else {o.style.display='none'; main_msg('������� ������ '+obj.value+'.');}

    if(obj.checked) cookies_Set(obj.value, 'true');
    else cookies_Delete(obj.value);
    
  }
}


var Items = [];
function content_ButtonUpdate()
{
	var input = document.forms['f'].elements;
	Items = [];
	for(i=0;i<input.length;i++) if (/_\d+_item$/.test(input.item(i).name) && input.item(i).checked) Items[Items.length] = input.item(i);
}//content_ButtonUpdate

function content_MoveItems(button)
{
	if (Items.length > 0)
	{
		var name = [];
		for(i=0;i<Items.length;i++) name[name.length] = Items[i].name;

		document.forms['f'].elements['event'].value='Move';
		if (confirm("��������� �������:\n" + name.join(", ") + "\n����������?")) 
		{
//			button.disabled = true; // � IE �� ��������!
			return true;
		} else return false;
	}
	alert("������� �������� �������, ������� �� ����������� ���������.")
	return false;
}//content_MoveItems

function content_CopyItems(button)
{
	if (Items.length > 0)
	{
		var name = [];
		for(i=0;i<Items.length;i++) name[name.length] = Items[i].name;

		document.forms['f'].elements['event'].value='Copy';
		if(confirm("�������� �������:\n" + name.join(", ") + "\n����������?")) 
		{
//			button.disabled = true; 
			return true
		} else return false;
	}
	alert("������� �������� �������, ������� �� ����������� �����������.")
	return false;
}//content_CopyItems

function content_ChangeMember(select)
{
	if (Items.length > 0)
	{
		return true;
	}
	alert("�������� ������� ��� �������� ��� �����������, ����� �������� ��������");
	return false;
}//content_ChangeMember


/*
����������� ����� � ����� � �������. �������� ������� �� ��� ��������. 
*/
function content_tdEdit(object) 
{
	if (!arguments[0] || arguments[0].tagName != 'TD') object = this;

	var node = object.firstChild ? object.firstChild : object;
	var value = object.firstChild ? node.value : "";
	if ((node.nodeType == 3) || (object.firstChild == null))	 // Text node
	{
		var newNode = document.createElement('input');
		newNode.setAttribute('type', 'text');
		newNode.value = node.nodeValue;
		if (object.firstChild) object.replaceChild(newNode, node); else object.appendChild(newNode);
		object.firstChild.focus();
	}
	else
	{
		if (node.type == 'checkbox') 
		{
			var values = node.title.split('|');
			value = (node.checked == true) ? values[0] : values[1]; // ����� ������ ��������, ���� ��������
		}

		newNode = document.createTextNode(value);
		if (object.firstChild) object.replaceChild(newNode, node); else object.appendChild(newNode);
	}

}/*content_tdEdit*/

// ��������� �������� �� ������
function content_Serialize()
{
	var str="";
	var uid=null;
	var result = [];
	var eTBody = document.getElementById('list').getElementsByTagName('tbody')[0];

	if (!eTBody) return;

	var index=0;
	for(i=0;i<eTBody.rows.length;i++) if (uid = eTBody.rows[i].id)
	{
		index ++;
		result[result.length] = 'list_'+index+'='+uid;	// ��������� ������
		var cells=eTBody.rows[i].cells;

		for(j=0;j<cells.length;j++) if (id=cells[j].id)
		{
			if (cells[j].firstChild && cells[j].firstChild.nodeType==1) content_tdEdit(cells[j]);	// ����� �������� ������������ � YES|NO

			var value = encodeURIComponent(cells[j].innerHTML); // �������� � UTF-8
			result[result.length] = id+'='+value;
		}
	}

//	console.log(result.join('&'))
	return result.join('&');
}/*serialize*/


function content_Load(form)
{
	var array = new Array();

	var elements=form.elements;
	for (i=0; i<elements.length;i++) if ((name=elements[i].name) && name.search(/^_load/)>=0 && elements[i].checked)
	{
		array[array.length]=elements[i].title;
	}

	if (array.length)
	{
		document.getElementById('loadform').innerHTML = '<table class=window>'+
		'<thead><tr><td>�������� ������ �� �����</td></tr></thead>'+
		'<tr><td>'+
		'<table class=window1>'+
		'<col width=40%><col width=60%>'+
		'<tr><td>���� .txt � ������������� ������ ���������:</td><td><input type=file name=load> <font color=red>������ � �������:</font></td></tr>'+
		'<tr><td colspan=2><span style="padding:2px; font-family:Courier; background-color:black; color:white;">'+array.join('|')+'</span></td></tr>'+
		'</table>'+
		'</td></tr>'+
		'</table>';
	}
	else
	{
		document.getElementById('loadform').innerHTML ='';
	}

//	alert(array.join(","));
}/*content_Load*/

// ������� ���������� ������� �� ������
function content_RemoveItems(button)
{
	if (Items.length > 0)
	{
		var name = [];
		for(i=0;i<Items.length;i++) name[name.length] = Items[i].name.replace(/_item$/,'').replace(/^_/,'');

		document.forms['f'].elements['event'].value='Remove';
		if(confirm("�� ������������� ������� ������� �������:\n" + name.join(", ") + "\n����������?")) 
		{
//			button.disabled = true; 
			return true;
		} else return false;
	}
	alert("������� �������� �������, ������� �� ����������� �������.")
	return false;
}//content_RemoveItems

function content_SubmitForm(form)
{
	if (form.elements['event'].value == 'submenu_show') return true;

//	�� ������� ����� ���������� ��������� �������������� ��� �������� � ��� �����
	form.elements['serialized'].value=content_Serialize();
	return true;
}/*content_SubmitForm*/


// ����������� ��������
function content_Toggle(object) 
{
	var cookie = cookies_Get(object.name);
	if (cookie) cookies_Delete(object.name);
	else cookies_Set(object.name,'true');
	document.location.href=document.location.href;
}//content_Toggle


// 2014-04-03
function content_ToggleList(obj)
{
	var col = $(obj).parent().parent().children().index($(obj).parent());

	$('#list tbody tr').each(function() {
		$(this).find('td').eq(col).find('input[type=checkbox]').each(function() { $(this).prop('checked', !$(this).prop('checked')); })
	});

	content_ButtonUpdate();
}//content_ToggleList

/* ����������/�������� �������� � ���������� */
function content_ChangeSet(obj)
{
	$(obj).prev().val(obj.value);
}//content_ChangeSet
function content_ClickSet(obj)
{
	if($(obj).hasClass('plus_one')) 
	{
		var td = $(obj).parent().parent();
		var set = $(obj).parent().clone();
		set.find('span').removeClass('plus_one').addClass('minus_one');
		td.append(set);
	}
	
	if($(obj).hasClass('minus_one')) { $(obj).parent().remove() }
}//content_ClickSet



/* 2014-09-17 */
function content_transliteNameToURL() 
{
//	console.log($("#_chr_link").val())
	if ( $("#_chr_link").val() == '' ) $("#_chr_name").syncTranslit({destination: $('#_chr_link') });
	else return false;
}

$(document).ready(function() {
	//����������
	$(".tablesorter").tablesorter(); 
	
	// URL �� ���������
	$("#_chr_name").keyup(function() { content_transliteNameToURL() });

	//�������� ������� ��������������
	$("#list[class='tablesorter window3'] tbody tr[class!=nodrag] td[class*='dragHandle']").each(function(){
		$(this).parent().hover(function() {
	        	$(this).children("td[class*='dragHandle']").addClass('showDragHandle');
	    	},
		function() {
        		$(this).children("td[class*='dragHandle']").removeClass('showDragHandle');
	    	})
	});
	//�������������� �����
	$("#list[class='tablesorter window3']").tableDnD({dragHandle: "dragHandle", onDragClass: "ondrop"});

	var input = document.forms['f'].elements; for(i=0;i<input.length;i++) if (/_\d+_item$/.test(input.item(i).name))	input.item(i).onclick = content_ButtonUpdate;

	// �������
	$('table.filter input.switch').click(function() {this.form.submit()})
	$('table.filter input.date').datepicker({dateFormat: 'yy-mm-dd'});



	//�������� ����������� ���������
	$('.datepicker').datepicker({dateFormat: 'yy-mm-dd', showOn: "button", buttonImage: "/i/account/dayselect.gif"});
	$('.datetimepicker').datetimepicker({dateFormat: 'yy-mm-dd', showOn: "button", buttonImage: "/i/account/dayselect.gif"});

	// ���������/���������� (�������) �������� �������
	var lang = ['ru','en','de','it','es','fr', 'vn'];

	$.each(lang, function( index, value ) {
		if ($('#'+value).size() && cookies_Get(value)=='true')
		{
			$('#'+value).css({'display' : 'table'});
			$('input[type=checkbox][name="language"][value="'+value+'"]').prop('checked', true);
		}
	});


	// ���������� textarea � ������� CodeMirrror
	$('form#f textarea.codemirror').each(function() {
		var textarea = this;
		var mode = $(this).attr('mode');
		var IsDisabled = $(this).prop('disabled');	// <textarea disabled="disabled">

		var container = $(this).parents('.window1:eq(0)');
		if (container.css('display') != 'table') return;	// codemirror �� ����� �������� �� �������� ������

		// ����� �� ���������� window.CodeMirrorID[id] ��� � ��� ����������, ������ ��� ��� AJAX

		CodeMirror.fromTextArea(textarea, {mode:mode,readOnly:IsDisabled,matchTags:{bothTags:true}}); 
	});

});

