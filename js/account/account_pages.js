/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * 2012.05.25 ��������� �� JQuery
 * 2014-03-27 ��� parent ������ ID ������� ������ page_qs

 TPage(props)
 page_insertRow(eBodyRow)

 page_dblclick() 
 page_ParentSelect()
 page_BodySelect()
 page_HeadSelect()
 page_BranchSelect()

 page_DrawPageList()
 page_NewRow(i,module)
 page_JSON()
 page_TotalDestroy()
 page_SubmitForm1(form)
 page_SubmitForm2(form)


*/




$(document).ready(function() {
	//�������������� �����
	$("#panel[class='window3']").tableDnD({dragHandle: "dragHandle", onDragClass: "ondrop"});
});

var Swatches = new Array(
new TPage({title:'�������',qs:'', menu:true}),
new TPage({title:'� ��������',qs:'about', menu:true, cache:true}),
new TPage({title:'�������',qs:'catalog', menu:true}),
new TPage({title:'�����-����',qs:'pricelist', menu:true}),
new TPage({title:'���������',qs:'products', menu:true}),
new TPage({title:'�������',qs:'news', menu:true}),
new TPage({title:'��������',qs:'vacancies', menu:true, cache:true}),
new TPage({title:'��������',qs:'delivery', menu:true, cache:true}),
new TPage({title:'��������',qs:'contacts', menu:true, cache:true}),
new TPage({title:'������',qs:'article', menu:true, cache:true}),
new TPage({title:'���������',qs:'portfolio', menu:true, cache:true}),
new TPage({title:'�����������',qs:'poll', menu:true}),
new TPage({title:'��������',qs:'gbook', menu:true}),

new TPage({title:'����',qs:'photo', menu:true, cache:true}),
new TPage({title:'��������',qs:'partners', menu:true, cache:true}),
new TPage({title:'�����',qs:'forum', menu:true}),
new TPage({title:'�����',qs:'search'}),

new TPage({title:'�������',qs:'profile', menu:true}),
new TPage({title:'�����������',qs:'reg'}),
new TPage({title:'������������',qs:'user', cache:true}),
new TPage({title:'����������� ������',qs:'pass'}),

new TPage({title:'�������',qs:'basket'}),
new TPage({title:'�������',qs:'shop', menu:true}),
new TPage({title:'����� ������',qs:'order', menu:true}),
new TPage({title:'�������� ��-����',qs:'payonline', menu:true}),

new TPage({title:'Rank Tracker',qs:'rank'}),
new TPage({title:'� �����',qs:'webring', cache:true}),
new TPage({title:'����������',qs:'stat'}),

new TPage({title:'����� �����',qs:'sitemap', cache:true}),
new TPage({title:'[sitemap xml]',qs:'site_map', cache:false})

);

var page_href;
var qa_Module;

/*
function page_Toggle(id)
{
	if (o=document.getElementById(id)) o.style.display = (o.style.display!='none') ? 'none' : 'block';
}/*page_Toggle*/


function page_insertRow(eBodyRow)
{
	var href = page_href + '&' + qa_Id + '=' + this.id + '&' + qa_Module + '=' + (this.module ? this.module : window.layout);

	$(this.menu ? '<td valign=top><input type=checkbox checked></td>' : '<td><input type=checkbox></td>')
		.data('page_menu',this.menu).appendTo(eBodyRow);
	$('<td valign=top class=dragHandle nowrap><img src="/i/account/move-arr.gif" width=18 height=17 align=absmiddle style="cursor:move;" alt=""></td>').appendTo(eBodyRow);
	$("<td><a href='"+ href + "' onclick=\""+(this.id==0 ? "alert('������ ������� �� �������� �������������� ������, �.�. �������� �� ���������'); return false" : "return true;")+"\">"+this.id+"</a></td>").appendTo(eBodyRow);		// page_id
	$('<td title="������� ���� ��� ����� ���������" class=editable>'+(this.proto ? this.module : '<b>'+this.module+'</b>')+'</td>')
		.data('page_module',this.module).dblclick(page_BodySelect).appendTo(eBodyRow);

	$(this.proto ? "<td valign=top><input type=checkbox checked onclick=\042return confirm('������������ ����� ����� ����������, ����������?')\042></td>" : '<td><input type=checkbox disabled></td>')
		.data('page_proto',this.proto).appendTo(eBodyRow);

	$('<td title="������� ���� ��� ����� HEAD-������" class=editable>'+(this.head>0?this.head_name:0)+'</td>')
		.data('page_head',this.head).dblclick(page_HeadSelect).appendTo(eBodyRow);

	$('<td valign=top title="������� ���� ��� �������������� �������� ��������" class=editable>'+this.title+'</td>')
		.data('page_title',this.title).dblclick(page_dblclick).appendTo(eBodyRow);
	$('<td valign=top title="������� ���� ��� �������� ������������ ��������" class=editable>'+this.parent+'</td>')
		.data('page_parent',this.parent).dblclick(page_ParentSelect).appendTo(eBodyRow);

	$('<td valign=top title="������� ���� ��� �������� ������ �������" class=editable>'+(this.branch?this.branch_name:'')+'</td>')
		.data('page_branch',this.branch).dblclick(page_BranchSelect).appendTo(eBodyRow);

	$('<td valign=top title="������� ���� ��� �������� ����� ���������" class=editable>'+(this.domain?this.domain:'')+'</td>')
		.data('page_domain',this.domain).dblclick(page_dblclick).appendTo(eBodyRow);
	$('<td valign=top title="������� ���� ��� �������������� ������ ��������" class=editable>'+(this.qs?this.qs:'')+'</td>')
		.data('page_qs',this.qs).dblclick(page_dblclick).appendTo(eBodyRow);

	$(this.cache ? '<td valign=top><input type=checkbox checked></td>' : '<td><input type=checkbox></td>')
		.data('page_cache',this.cache).appendTo(eBodyRow);

	$('<td valign=top title="����� ������� �� ��������">'+this.total+'</td>').appendTo(eBodyRow);

	$('<td valign=top><input type=checkbox title="���������� ��������"></td>')
		.data('make_copy',0).appendTo(eBodyRow);
	$("<td valign=top><input type=checkbox onclick=\"return !this.checked || confirm('������� �������� \xab"+this.id+"\xbb?')\"><img src='/i/account/drop.gif' class=pico2 title='������� �������� \xab"+this.id+"\xbb'></td>")
		.data('remove',0).appendTo(eBodyRow);

	$(eBodyRow).attr('id', this.id);
}/*page_insertRow*/



/* ����������� */

function TPage(props)
{
	// ��������� �� ���������
	this.id=0;	// ���������� ������������� �������� � ������� $tbl_Site
	this.index=0;
	this.module=0;
	this.parent=0;
	this.domain='';
	this.menu=false;
	this.proto=true;
	this.cache=false;
	this.head=0;
	this.total=0;
	this.branch=null;
	this.branch_name=null;
	this.charset='windows-1251';

	for (key in props) this[key] = props[key];

	this.insertRow=page_insertRow;
}/*TPage*/


// Double click ��� ��������������
function page_dblclick() 
{
	var td = $(this);
	if(td.find('input[type=text]').length) 
	{
		var value = td.find('input:first').val();
		td.text(value);
		var data = td.data();
		for (key in data) td.data(key, value); 	// ��� ������������ ����
	}
	else 
	{
		var input = $('<input>',{type:'text'}).val( td.text() );
		td.html('').append(input);
		input.focus();
	}
}/* page_dblclick */

function page_ParentSelect()
{
	var td = $(this);
	var value = td.text();

	if (td.find('select').length) return false;
	var current = td.parents('tr').attr('id');

	var sel = $('<select>');
	$('<option>').attr('value', 0).text('��� ��������').appendTo(sel);

	$('#panel tbody tr').each(function(i) {

		var id = $(this).attr('id');
		if (id == current) return;

		var row = {};
		$('td', this).each(function(){
			var data = $(this).data();	// � ������ TD ������ ���� data-key
			for (key in data) row[key] = $(this).data(key);
		});

		$('<option>').attr('value', id).text(row.page_title).attr('selected', id==value).appendTo(sel);
	});

	sel.change(function() { td.data('page_parent', $(this).val()); });

	td.html('').append(sel);
//	sel.focus();
}/* page_ParentSelect */


// ����� ���������
function page_BodySelect()
{
	var td = $(this);
	var value = td.data('page_module');

	if (td.find('select').length) return false;

	var sel = $('<select>');

	BodyList.map(function(module) {
		$('<option>').attr('value', module.module_id).text(module.module_name).attr('selected', module.module_id==value).appendTo(sel);
	});

	sel.change(function() { td.data('page_module', $(this).val()); });
	td.html('').append(sel);
}/* page_BodySelect */

// ����� HEAD-������
function page_HeadSelect()
{
	var td = $(this);
	var value = td.data('page_head');

	if (td.find('select').length) return false;

	var sel = $('<select>');

	HeadList.map(function(module) {
		$('<option>').attr('value', module.module_id).text(module.module_name).attr('selected', module.module_id==value).appendTo(sel);
	});

	sel.change(function() { td.data('page_head', $(this).val()); });
	td.html('').append(sel);
}/* page_HeadSelect */

// ����� ������ �������
function page_BranchSelect()
{
	var td = $(this);
	var value = td.data('page_branch');

	if (td.find('select').length) return false;

	var sel = $('<select>').css({'width':'100%', 'box-sizing':'border-box'});
	$('<option>').attr('value', '').text('���').appendTo(sel);

	BranchList.map(function(branch) {
		$('<option>').attr('value', branch.branch_id).text(branch.branch_name+' ('+branch.domains+')').attr('selected', branch.branch_id==value).appendTo(sel);
	});

	sel.change(function() { td.data('page_branch', $(this).val()); });
	td.html('').append(sel);
}/* page_HeadSelect */


function page_DrawPageList()
{
	var eTable = document.getElementById( 'panel' );
	var eTBody = eTable.getElementsByTagName( 'tbody' )[0];

	for(i=0;i<PageList.length;i++)
	{
		var NewPage = new TPage(
			{
				id:		PageList[i].page_id,		// ���������� ������������� �������� � ������� $tbl_Site
				index:		PageList[i].page_index,
				module:		PageList[i].page_module,	// �� ���� body ��� layout ��� ��������
				body_name:	PageList[i].body_name,
				head:		PageList[i].page_head,
				head_name:	PageList[i].head_name,
				parent:		PageList[i].page_parent,
				title:		PageList[i].page_title, 
				qs:		PageList[i].page_qs, 
				branch:		PageList[i].page_branch,
				branch_name:	PageList[i].branch_name,
				domain:		PageList[i].page_domain,
				menu:		(PageList[i].page_menu==1),	// true ��� false 
				cache:		(PageList[i].page_cache==1),	// true ��� false 
				proto:		(PageList[i].proto==1),		// true ��� false 
				charset:	PageList[i].page_charset,
				total:		PageList[i].total
			});

		var eBodyRow = eTBody.insertRow(i);	// ��������� ����� TD
		NewPage.insertRow(eBodyRow);
	}

	return true;
}/*page_DrawPageList*/


/*
function page_DeleteRow(object)
{
	row = object.rowIndex;
	var eTBody = document.getElementById( 'panel' );
	eTBody.deleteRow(row);
}/*page_DeleteRow*/

/* ���������� ����� �������� / ������� ����� �������� */
function page_NewRow(i,module)
{
	var eTBody = document.getElementById( 'panel' ).getElementsByTagName( 'tbody' ).item(0);
	var eBodyRow = eTBody.insertRow(eTBody.rows.length);
	var n = eTBody.rows.length;

	if (!arguments[1]) module=0;

	if(i==0) // ����� ��������
	{
		var NewPage = new TPage({title:'����� '+n, qs:'page'+n, menu:true, module:module});
		NewPage.insertRow(eBodyRow);
	}
	else // ��������� �������� �� ���������
	{
		var NewPage = Swatches[i-1];
		NewPage.module = module;
		NewPage.insertRow(eBodyRow);
	}
}/*page_NewRow*/


function page_JSON()
{
	var json = [];

	$('#panel tbody tr').each(function(i) {
	
		var id = $(this).attr('id');
		var row = {};
		row.page_id = id;
		row.page_index = i;

		$('td', this).each(function(){

			var selected = null;

			if($(this).find('input[type=text]').length) $(this).dblclick();		// �� ��� �������� ����� ��������������
			if($(this).find('select').length) { selected = $(this).find('select').val(); $(this).text( selected ); }

			var data = $(this).data();	// � ������ TD ������ ���� data-key
			for (key in data) 
			{
				row[key] = $(this).find('input[type=checkbox]').length>0 ? ($(this).find('input[type=checkbox]').prop('checked')?1:0) : (selected == null) ? $(this).data(key) : selected;
//				if (key == 'page_module') alert(id + ' : ' + row[key])
			}
		});
		json.push(row);
	});

	return JSON.stringify(json);
}/* page_JSON */

function page_TotalDestroy()
{
	var eTBody = document.getElementById( 'panel' );
	if (eTBody) for(i=1;i<eTBody.rows.length;) eTBody.deleteRow(1);
	
	PageList.length=0;
}/*page_TotalDestroy*/

// ���������� ������ �������
function page_SubmitForm1(form)
{
	form.elements['json_data'].value=page_JSON();
//	alert(form.elements['json_data'].value);return false;
	return main_AJAX(form);
}/*page_SubmitForm1*/


// ���������� ������ �����
function page_SubmitForm2(form)
{
	if (form.name.value=='') alert('�� �� ������ ��� ��� ������!');
	else return main_AJAX(form);

	return false;
}/*page_SubmitForm2*/



