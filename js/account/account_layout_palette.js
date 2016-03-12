/*
 * CMS PLARSON
 * Author: Pavel Publichenko
 * Все функции для ренедринга палитры
 * 2015-06-28
 *

 palette_Init(SET)
 palette_Templates(SET)
 palette_Toggle(palette)

 Используется в module_layout.html

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



/* Создаём пустые палитры */
function palette_Init(SET)
{
  var parent = document.getElementById('panel');

  for (palette_index in SET) // loop in groups (aka pages)
  {
  	var palette = SET[palette_index].palette;
  	var cell = 'panel_'+palette;	// здесь palette_index это индекс, а не номер палитры

	var eTableContainer = document.createElement( 'table' );
	eTableContainer.border = 1;
	eTableContainer.className = 'window';
	eTableContainer.style.width = '200px';

	var eTHead    = document.createElement( 'thead' );
	var eHeadRow  = document.createElement( 'tr' );
	var eHeadCell = document.createElement( 'td' );
	eHeadCell.innerHTML = "<img id='head_"+palette+"' src='/i/account/" + (SET[palette_index].status?'mini.gif':'max.gif') +"' alt='" + (SET[palette_index].status?'Свернуть':'Развернуть') +"' class=pico onclick=palette_Toggle('"+palette_index+"')>"+SET[palette_index].name;

	eHeadRow.appendChild( eHeadCell );
	eTHead.appendChild( eHeadRow );

	var eTBody    = document.createElement( 'tbody' );
	var eBodyRow  = document.createElement( 'tr' );
	var eBodyCell = document.createElement( 'td' );

	var eList     = document.createElement( 'ul' );
	eList.id      = cell;
	eList.className = 'target';
	eList.style.display = SET[palette_index].status ? 'block':'none';
	eBodyCell.appendChild( eList );

//	eBodyCell.height = 20;
	eBodyRow.appendChild( eBodyCell );
	eTBody.appendChild( eBodyRow );

	eTableContainer.appendChild( eTHead );
	eTableContainer.appendChild( eTBody );
	parent.appendChild( eTableContainer );

	Targets[Targets.length] = cell;
  }
}/*palette_Init*/


// Сортировка шаблонов в палитре по названию
function palette_sort_by_name(a, b) {
	 if (a.data[0] < b.data[0]) return -1;
	 if (a.data[0] > b.data[0]) return 1;
	 if (a.data[0] == b.data[0]) return 0;
}/*block_sort*/


/* загрузка шаблонов в палитру */
function palette_Templates(SET)
{
  for (palette_index in SET) // loop in groups (aka pages)
  {
    var palette = SET[palette_index].palette;
    var cell = 'panel_'+palette;

    var items = [];
    for(template in SET[palette_index].items) items[items.length] = {data:SET[palette_index].items[template], id:template};
    items.sort( palette_sort_by_name );	// сортируем по названию

    for(i=0; i<items.length; i++) //SET ассоциативный массив
    {
      var template = items[i].id;
      var template_name = items[i].data[0];
      var multi = items[i].data[1];

      if (!Block.Exists(template) || multi) 
      {
        Block[Block.length] = new TBlock(0,cell,i, template,palette_index,template_name);	// module,cell,index, template,palette_index,template_name
      }
    }
  }
}/*palette_Templates*/


/* Открываем и закрываем палитру */
function palette_Toggle(palette_index)
{
  var palette = SET[palette_index].palette;

  if (o=document.getElementById('panel_'+palette)) o.style.display = (o.style.display!='none') ? 'none' : 'block';

  if (o=document.images['head_'+palette])
  {
    if (/mini.gif$/.test(o.src)) {o.src = '/i/account/max.gif'; o.alt='Развернуть'; main_msg('Свернули палитру &laquo;'+SET[palette_index].name+'&raquo;'); }
    else {o.src = '/i/account/mini.gif'; o.alt='Свернуть';  main_msg('Развернули палитру &laquo;'+SET[palette_index].name+'&raquo;');}
  }
  else alert('can not find '+'_set_'+palette)

}/*palette_Toggle*/

/*---------------------------------------------------------------------------*/