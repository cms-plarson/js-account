/*
 * CMS PLARSON
 * Author: Pavel Publichenko

 language_MainChange
 language_CheckMain
 language_SubmitForm

*/

/* Изменяем основной язык, блокиреум чекбокс */
function language_MainChange(value)
{
  var input = document.forms['f'].elements;
  for(i=0; i<input.length; i++) if (input.item(i).type == 'checkbox' && input.item(i).disabled == true)
  {
    input.item(i).disabled = input.item(i).checked = false;
  }

  var main = null;
  for(i=0; i<input.length; i++) if (input.item(i).type == 'checkbox')
  {
    if (input.item(i).name == value) input.item(i).disabled = input.item(i).checked = true;
  }

  if (!/\w{2}/.test(value))
  {
    for(i=0; i<input.length; i++) if (input.item(i).type == 'checkbox') input.item(i).disabled = input.item(i).checked = false;
  }
}

/* Провереяет, выбран ли основной язык прежде чем выбирать дополнительный */
function language_CheckMain(obj)
{
  if (!obj.form.elements['language_main']) 
  {
    alert("Не найден элемент language_main!");
    return false;
  }
  else if (!/\w{2}/.test(obj.form.elements['language_main'].value))
  {
    alert("Прежде чем выбрать дополнительный язык, выберите основной!");
    return false;
  }

  return true;
}

/* Сохраняем форму с языками */
function language_SubmitForm(form)
{
  if (!form.elements['language_main'].value) return true;

  var input = document.forms['f'].elements;
  var total=0;
  for(i=0; i<input.length; i++) if (input.item(i).type == 'checkbox' && input.item(i).checked == true) total++;

  if (total>1) return true;

  alert("Не выбран ни один дополнительный язык!\n\nЕсли выхотите удалить настройки, \xabОсновной язык\xbb установите в положение \xabНе выбран\xbb.\nЕсли вы хотите сохранить новые настройки, отметьте минимум 1 дополнительный язык.");
  return false;

}
