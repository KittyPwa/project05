function setForm(form,role){
  EmptyElement(form);
  for(var key in window.localStorage){
    if (key.startsWith(role)){
      var option = document.createElement("option");
      key = key.substr(1);
      option.value = key;
      option.text = load(key, itemEnum.ENTITY).name;
      form.appendChild(option);
    }
  }
}  

function EmptyElement(elem){
  while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
  }
}

function toggleElement(elem,name) {
  
  EmptyElement(elem);

  if (!elem.firstChild || elem.name != name) {
    elem.name = name;

    var announcer = document.createElement("P");
    announcer.innerHTML = name + " :";
    elem.appendChild(announcer);

    var form = document.createElement("form");
    form.name = "assign" + name;
    form.action="javascript:;";
    name = lowerFirstLetter(name);
    form.setAttribute("onChange", name + "=load(" + name + "Form.options[" + 
    name + "Form.options.selectedIndex].value, itemEnum.ENTITY);");
    
    var select = document.createElement("select");
    select.id = name + "Form";
    form.appendChild(select);

    setForm(select,itemEnum.ENTITY[0]);
    elem.appendChild(form);
  }
}

function extractFromObjects() {
  console.log(document.getElementsByClassName('object'))
  var object = document.getElementsByClassName('object')[0];
  object.src = "htmlElements/mainMenu.html"

  var win = object.contentWindow; // reference to iframe's window
  // reference to document in iframe
  var doc = object.contentDocument? object.contentDocument: object.contentWindow.document;
  // reference to form named 'demoForm' in iframe
  var elem = doc.getElementById('MainMenu');

  /*var doc = object.contentDocument? object.contentDocument: object.contentWindow.document;
  elem = doc.getElementById('MainMenu')*/
  console.log(object)
  console.log(doc)
  console.log(elem)
}

extractFromObjects()