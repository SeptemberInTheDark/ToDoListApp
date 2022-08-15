(function() {
  let listDeals = [],
      listName = '';

  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дел
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', function() {
      if (input.value !== '') {
        button.disabled = false;
      } else {
        button.disabled = true;
      }

    });

    return {
      form,
      input,
      button,

    };
  }

  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement('li');
    //Помещаем кнопки в элемент, который покажет их в одной группе
    let buttonGroup = document.createElement('div');
    //кнопка выполнить/отметить как выполненное
    let doneButton = document.createElement('button');
    //кнопка удалить
    let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента списка, а так же для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done == true) item.classList.add('list-group-item-success');

    //Добавляем обработчики на кнопки
    doneButton.addEventListener('click',function() {
      item.classList.toggle('list-group-item-success');

      console.log(obj.id);
      for (const listItem of listDeals) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;
        }
        saveList(listDeals, listName);
      }

    });

    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        item.remove();

        for (let i = 0; i < listDeals.length; i++) {
          if (listDeals[i].id == obj.id) {
            listDeals.splice(i, 1);
          }
        }
        saveList(listDeals, listName);
      }
    });

    //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,

    };
  }

  //получение элемента по уникальному id
  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id;
    }
    return max + 1;
  }

  //сохроанение дел для каждого отдельного человека
  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;
    listDeals = defArray;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    //Расшифровка
    let localData = localStorage.getItem(listName);
    console.log(localData);

    if (localData !== null && localData !== '') {
      listDeals = JSON.parse(localData);
    }

    for (const itemList of listDeals) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    //действие, чтобы страница не перезагружалась при отправке формы
    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewID(listDeals),
        name: todoItemForm.input.value,
        done: false
      }
      //Добавляем объект
      let todoItem = createTodoItem(newItem);


      listDeals.push(newItem);

      saveList(listDeals, listName);

      console.log(listDeals);
      //создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      todoItemForm.button.disabled = true;
      //обнуляем значение в поле, чтобы не пришлось стирать кго вручную
      todoItemForm.input.value = '';



    });
  }
  window.createTodoApp = createTodoApp;
})();
