/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * ��� ������� ��� �������� �������������� ������

 * 2015-04-23
 
 module_ToggleCM(id)
 module_ToggleOptGroup(seek_table,checked)
 module_ShowAllHolders(checked)
 module_ChangeHolderTable(table)
 module_CheckTemplateRadio(form)
 module_SubmitForm(form)
 module_Preview(module)

*/

var SessionKey = (/s=(\d+)/.exec(window.location.href))[1];

function module_Wizard_Step3(value)
{
	if (!value) return alert('���� �� ������');
	else $('#wizard_message').html('������� \xab���������\xbb');
}//module_Wizard_Step3

/* Proto list wizard */
function module_Wizard_Step2(value)
{
        if (!value) $('#wizard_field, #wizard_message').html('');
	else if (value.indexOf('FieldMenu') >= 0) $.post('/cgi-bin/reestr_xmlhttp.cgi', {s:SessionKey,target:26,event:'Show',action:'wizard_step2',func:value}, function(data) {$('#wizard_field').html(data); $('#wizard_message').html('');});
	else {$('#wizard_message').html('������� \xab���������\xbb');$('#wizard_field').html('');}
}//module_Wizard_Step2

// ������� �� ������� defalt-sql
function module_Wizard_Step1() 
{
	var table = $('#table_select').val();	// �������

	if (!$(this).prop('checked')) $('#wizard_func, #wizard_field, #wizard_message').html('');
	else if(table.length) $.post('/cgi-bin/reestr_xmlhttp.cgi', {s:SessionKey,target:26,event:'Show',action:'wizard_step1',table:table}, function(data) {$('#wizard_func').html(data)});
	else
	{
	        $(this).prop('checked', false);
	        $('#wizard_field, #wizard_message').html('');
		alert('�������� ������� ������!')
	}
}//module_Wizard_Step1


// ��������/��������� ����� ��������� CodeMirror ��� Role/Case
function module_ToggleCM(id)
{
	if (id in window.CodeMirrorID)
	{
		var readOnly = window.CodeMirrorID[id].getOption('readOnly');
		window.CodeMirrorID[id].toTextArea();
		delete window.CodeMirrorID[id];

		var myObject = document.getElementById(id);

		if (myObject.value.length < 100)
		{
			var mode=myObject.getAttribute('mode');
			// ������ ������ textarea �� �����
			var myInput = document.createElement('input');
			myInput.setAttribute('name', myObject.name);
			myInput.setAttribute('mode', mode); 	// ��������������� �������� 'htmlmixed' ��� 'text/x-mariadb'
			myInput.value = myObject.value;
			myInput.id = id;
			myInput.disabled = readOnly;
			myObject.parentNode.replaceChild(myInput,myObject);
		}
		else
		{
			myObject.setAttribute('rows', 1);
			myObject.disabled = readOnly;
		}
	}
	else
	{
		// ������ ������ ������ �� textarea 
		var myObject = document.getElementById(id);
		var IsDisabled = myObject.disabled;	// <textarea disabled="disabled">

		var mode = 'text/x-mariadb';	// �������� �� ���������
		if (myObject.getAttribute('mode')) mode=myObject.getAttribute('mode');

		var myTextArea = document.createElement('textarea');
		myTextArea.setAttribute('name', myObject.name);
		myTextArea.setAttribute('mode', mode);
		myTextArea.value = myObject.value;
		myTextArea.id = id;
		myObject.parentNode.replaceChild(myTextArea,myObject);

		window.CodeMirrorID[id] = CodeMirror.fromTextArea(document.getElementById(id), {mode:mode,readOnly:IsDisabled}); 
	}
}//module_ToggleCM

// ������������ ��� module_ShowAllHolders, module_ChangeHolderTable
function module_ToggleOptGroup(seek_table,checked)
{
	if (!document.getElementById('holder_select')) return;

	var group = document.getElementById('holder_select').getElementsByTagName('optgroup');
	// ���� �������� �������, ����� ���������� ��� �� <optgroup>
	var option = document.getElementById('holder_select').options[document.getElementById('holder_select').selectedIndex];
	var optgroup = option.parentNode;
	var holder_table = optgroup.getAttribute('table');

	for(i=0; i<group.length; i++) 
	{
		var group_table = group[i].getAttribute('table');
		if (!group_table) ;							// ������ ������ "�������� ..."
		else if (checked) group[i].style.display='';				// �������� ��
		else if (group_table == seek_table) group[i].style.display='';		// ��������� � ������� ��������
		else if (group_table == holder_table) group[i].style.display='';	// ��������� � �������� ��������� ��������
		else group[i].style.display='none';
	}
}//module_ToggleOptGroup

// ���������� ��� �������� �������� ������ ������ ������ 
function module_ShowAllHolders(checked)
{
	var table = document.getElementById('table_select').value;
	module_ToggleOptGroup(table,checked);
}//module_ShowAllHolders

// �������� ������� module_table
function module_ChangeHolderTable(table)
{
	if (!document.getElementById('holder_select')) return;
	if (!document.getElementById('holder_name')) return;

	document.getElementById('holder_select').value = 0;	// ���������� ��������
	document.getElementById('holder_name').value='';	// ���������� ��������

	// ���������� �������� �������
	$('#wizard_func, #wizard_field, #wizard_message').html('');
	$('input[type=checkbox][name*=default-sql_]').prop('checked',false);

	module_ToggleOptGroup(table,document.getElementById('holder_all').checked);
}//module_ChangeHolderTable

/*---------------------------------------------------------------------------*/

// ���������� �������� �����������, ����� - 0
// ������������ � module_family.html
function module_CheckTemplateRadio(form)
{
	var id=0;
	var elements=form.elements;
	for (i=0; i<elements.length;i++)// if (elements[i].value)
	{
		var type=elements[i].type;
		var name=elements[i].name;
		var checked=elements[i].checked;
		var value=elements[i].value;
		if (/\d+/.test(value) && type == 'radio' && name == 'template' && checked) id=value;
	}
	return id;
}/*module_CheckTemplateRadio*/

/* ���������� ������ */
function module_SubmitForm(form)
{
	if (form.template && !form.template.value && !module_CheckTemplateRadio(form)) {alert('������:\n\n�� �� ������� ������!'); return false;}

	if (form.module_holder && form.module_holder.value==0 && form.holder_name.value=='' && form.module_tie && form.module_tie.length==2 && form.module_tie[0].checked)
	{
		alert("������:\n\n�� ������������ ������������ ������, ������ �������� ���������� ������������ ����� ������.\n������� �������� ��� ������!"); 
		form.holder_name.focus(); 
		return false;
	}
	if (form.module_holder && form.module_holder.value==0 && form.holder_name.value=='' && form.module_tie && form.module_tie.length==3 && form.module_tie[0].checked)
	{
		alert("������:\n\n�� ������������ ������������ ������, ������� ������� �������� ������ ��� ������.\n������� �������� ��� ������ ��� ���������� �������� � ������������ ������!"); 
		return false;
	}

	// ��������� ��������� ������ � ������� ���� layout
	if (window.Block) form.elements['layout'].value='exists&'+Block.Serialize();

	return main_AJAX(form);	// ���������� � account_main.js
}/*module_SubmitForm*/


/*
���������� ������ � ����� ����
*/
function module_Preview(module)
{
	var BODY='';
	var re = new RegExp(('_'+(module?module:'\\d+')+'_'),"");

	var elements=document.forms['f'].elements;
	var children=document.forms['f'].getElementsByTagName("TEXTAREA");

	for (i=0;i<children.length;i++) if (!module || re.test(children[i].name))
	{
		var HTML = children[i].value;
		var m = children[i].name.replace(/^_(\d+)_.*/,"$1");
		var re2 = new RegExp(('_'+m+'_'),"");


		HTML = HTML.replace(/&#60;/,"<");
		HTML = HTML.replace(/&#62;/,">");
		HTML = HTML.replace(/<!--.*?-->/g,"");

		for (j=0; j<elements.length;j++) if (re2.test(elements[j].name))
		{
			var name=elements[j].name.replace(/_\d+_\d+_/,"");
			var value=(elements[j].tagName=='BUTTON') ? elements[j].innerHTML : elements[j].value;

			var place = new RegExp(("##"+name+"##"),"ig");
			HTML = HTML.replace(place,value);
			HTML = HTML.replace(/##<(\d+)>##/,"������ �$1");
		}
		HTML = HTML.replace(/[-a-zA-Z]+=""/g,"");
		HTML = HTML.replace(/[-a-zA-Z]+:;/g,"");

		if(BODY) BODY += '<hr>';
		BODY += HTML;
	}

	BODY = '<html><head><title>���������� ������</title><head/><body>'+BODY+'</body></html>';

	if(window.win && !win.closed) // ���� �������
	{
		win.document.body.innerHTML = BODY;
		win.focus();
	}
	else // ���� ������� ��� �� ����������
	{
		win = window.open('about:blank',1,'toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=1,resizable=1,width=600,height=400,top=100,left=100');
		win.document.write(BODY);
		win.document.close();
		win.focus();
//		oInterval = window.setInterval("if (oInterval && window.win && !win.closed) {win.focus()} else {window.clearInterval(oInterval); alert('�Ѩ!');}",5000);
	}

	return false;
}/*module_Preview*/

/*---------------------------------------------------------------------------*/

var Sub = "var value=this.value; "+
	"value = value.replace(new RegExp('<(!--)([^>]*)(--)>', 'g'), \"\"); "+
	"value = value.replace(new RegExp('<[^>]+>','gi'), \"\"); "+
	"main_msg('������ �������� '+this.name.replace(/_\d+_\d+_/,'')+'='+value+'.'); CHANGED=1;";



$(function() {

	// ��������� ������ ����������
	var pos = $('table.container').offset();
	var left = parseInt(pos.left)+parseInt($('table.container').width());
	var right = parseInt($(window).width()) - left;
	var floatbutton = $('<div></div>').addClass('tip savebutton floatbutton').css({right: right+'px'}).attr('tip', '��������� ����� ��� ������������').text('���������').appendTo('body');
	//	floatbutton.position({of: $('table.container'), my: 'right-10 top+50', at: 'right top', collision: "flipfit"});
	floatbutton.click(function() {module_SubmitForm(document.getElementById('f'))});

	// Binding keys
	// http://habrahabr.ru/post/25511/
	// ���������� �� Ctrl+S � ��������
	$(document).bind('keydown', "Ctrl+return", function assets() {
		IsFormOk(document.getElementById('f'));
	        return false;
	});

	/* ��������� ������� fieldset, div ���� ���� ���� */
	$.each( ['usage_container', 'structure_container', 'family_container', 'html_container', 'layout_container', 'design_container', 'case_container',
		'toproto_container', 'remove_container', 'extra_container', 'save_container',
		'config_container', 	// ������ � ��� ������ �� �������� ������, ����� ���� ������ ���� Toggle ��� ��� HTML ��� ��������� codemirror
		'part_f', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7', 'part8'],
		function(index,value) 
		{
			if (cookies_Get(value)) {
				$('#'+value).css({display:'block'})
			}
		}
	);


	// ColoPicker
	$('form#f input.color').colorpicker();

	// ���������� textarea � ������� CodeMirrror
	$('form#f textarea.codemirror').each(function() {
		var textarea = this;
		var mode = $(this).attr('mode');
		var id = $(this).attr('id');
		var IsDisabled = $(this).prop('disabled');	// <textarea disabled="disabled">

		var container = $(this).parents('.fieldset-container:eq(0)');
		if (container.css('display') != 'block') return;	// codemirror �� ����� �������� �� �������� ������

		// CodeMirrorID - ������ ������ ID, ���������� �����������, ����������� � account_main.js var CodeMirrorID={};
		if (!(id in window.CodeMirrorID)) window.CodeMirrorID[id] = CodeMirror.fromTextArea(textarea, {mode:mode,readOnly:IsDisabled,matchTags:{bothTags:true}}); 
	});

	// �������� "�� ���������" - HTML-��� module_html
	$('#html_container input[type=checkbox][name*=default_html_]').click(function(){
		var name = $(this).attr('for');
		var IsChecked = $(this).prop('checked');	// ������� "������������ ������ �� ���������"
		$('#html_container textarea[name=' + name + ']').prop('disabled', IsChecked);	// ��������/��������� �������� textarea, � ������� �������� ������ CodeMirror
		if (name in window.CodeMirrorID) window.CodeMirrorID[name].setOption('readOnly',IsChecked); 
	});
	                                   
	// �������� "�� ���������" - ���� module_role
	$('#case_container input[type=checkbox][name*=default_role_], #extra_container input[type=checkbox][name=default_role]').click(function(){
		var name = $(this).attr('for');
		var IsChecked = $(this).prop('checked');	// ������� "������������ ���� �� ���������"
		$('input[type=radio][name=' + name + ']').prop('disabled', IsChecked);
	});

	// �������� "�� ���������" - ������� module_case
	$('#case_container input[type=checkbox][name*=default_case_], #extra_container input[type=checkbox][name=default_case]').click(function(){
		var name = $(this).attr('for');
		var IsChecked = $(this).prop('checked');	// ������� "������������ case �� ���������"
		$('[name=' + name + ']').prop('disabled', IsChecked);
		if (name in window.CodeMirrorID) window.CodeMirrorID[name].setOption('readOnly',IsChecked); 
	});

	// �������� "�� ���������" - �������� (Design)
	$('#f input[type=checkbox][name*=default_property_]').click(function(){
		var name = $(this).attr('for');
		var value = $(this).val();
		var IsChecked = $(this).prop('checked');	// ������� "������������ case �� ���������"
		if (IsChecked) $('[name=' + name + ']').val(value);
		$('[name=' + name + ']').prop('disabled', IsChecked);
	});


	// �������� � ��������
	// Default-SQL
	$('input[type=checkbox][name=default-sql]').click(module_Wizard_Step1);

	$('input[type=checkbox][name=load-file]').click(function(){
		var checkbox = this;
		var id = $(this).attr('for');
		var textarea = document.getElementById(id);
		var mode = $(textarea).attr('mode');
		var name = $(textarea).attr('name');

/*
		var formData = new FormData();
		formData.append('s', SessionKey);
		formData.append('target', 26);
		formData.append('event', 'Show');
		formData.append('action','load-file');
		formData.append('name',name);

		$.ajax({
			url: '/cgi-bin/reestr_xmlhttp.cgi',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,

			success: function(data) {
				$(textarea).prop('disabled',false);
				$(textarea).val(data); 

				window.CodeMirrorID[id] = CodeMirror.fromTextArea(textarea, {mode:mode,readOnly:false,matchTags:{bothTags:true}});
				$(checkbox).prop('disabled',true);
			}
		});

		return;
*/

		$.post('/cgi-bin/reestr_xmlhttp.cgi', {s:SessionKey,target:26,event:'Show',action:'load-file',name:name}, 
			function(data) { 
				$(textarea).prop('disabled',false);
				$(textarea).val(data); 

				window.CodeMirrorID[id] = CodeMirror.fromTextArea(textarea, {mode:mode,readOnly:false,matchTags:{bothTags:true}});
				$(checkbox).prop('disabled',true);
			});
	});



	/* ��������� ������ �������� */
	children = document.forms['f'].getElementsByTagName("select");
	for (i=0;i<children.length;i++)
	{
		el = children[i];
		s = el.onchange;
		if (s) {
			s = s.toString();
			s = s.replace(RegExp("^[\s\n]*function[^{]*\\{",'gi'), "");
			s = s.replace(RegExp("\\}[\s\n]*$",'gi'), "");
		}
		el.onchange = new Function(Sub+s);
	}

	main_msg('��������� - ����� ������� ������ &laquo;���������&raquo; (Ctrl+Enter)',2);

	var stat=main_StatusXMLHTTP();
	if (document.forms['f'].elements['xml']) document.forms['f'].elements['xml'].checked=stat;

});