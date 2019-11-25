const toDo = document.querySelector('#toDo');

const form = document.querySelector('.addPanel');

const input = document.querySelector('.inputThing');

const addThing = document.querySelector('.addThing');

const inputSearch = document.querySelector('.inputSearch');

const searchThing = document.querySelector('.searchThing');


let counter = 0;

let addCounter = 0; // dodany jeszcze jeden counter poniewaz, gdy powiedzmy zaznaczajac (checked) osiagnie task: 0, to jesli zrobie if(counter===0) i wyczysc mi z toDo counterPanel to wyczysci mi koleczko z licznikiem mimo, ze jeszcze ich nie usunalem za pomoca remove, a addCounter liczy dodane taski i jak wszystkie taski beda usuniete to dopiero wtedy mi usun counterPanel za pomoca if(addCounter===0)

let taskTable = [];


input.placeholder = 'Insert your task...'; //placeholder inputa
inputSearch.placeholder = 'Search your trask...'; //placeholder inputa do wyszukiwania


//Stworzenie panelu counter i dodanie go jako dziecko toDo, zeby bylo na samym koncu w celu obliczenia ilosci zadan
const counterPanel = document.createElement('div');
counterPanel.className = 'taskCounter';
const counterP = document.createElement('p');



//Stworzenia div listPanel i dodanie go do diva toDo
const listPanel = document.createElement('div');
listPanel.className = 'listPanel';
toDo.appendChild(listPanel);


//Stworzenie listy ul o klasie itemList
const taskList = document.createElement('ul')
taskList.className = 'itemList';


//Wyszukiwania zadanego taska
const searchTask = (event) => {
    event.preventDefault();
    const searchValue = inputSearch.value.toLocaleLowerCase();
    let searchSpecificTask = [...taskTable];
    searchSpecificTask = searchSpecificTask.filter(item => item.textContent.toLocaleLowerCase().includes(searchValue));
    listPanel.textContent = '';
    searchSpecificTask.forEach(li => listPanel.appendChild(li));
}


//dodawanie i usuwanie przekreslenia jesli klikniemy na dodana rzecz
const checkedTask = (event) => {
    event.target.classList.toggle('checkItem'); //dodanie i usuniecie klasy checkItem

    //jesli li posiada klase checkItem, czyli zaznaczylem sobie, ze kupilem to zmniejsz liczbe
    if (event.target.classList.contains('checkItem')) {
        counter -= 1;
        counterP.textContent = `Tasks: ${counter}`;
    } else { //a jak spowrotem zaznaczylem, ze jeszcze nie kupilem to zwieksz liczbe
        counter += 1;
        counterP.textContent = `Tasks: ${counter}`;
    }
}

//musze zdobyc index usuwanego

//usuniecie rzeczy(zadania), po kliknieciu w button remove item
const removeTask = (event) => {
    event.preventDefault();
    console.log(event.target.parentNode);
    event.target.parentNode.remove();
    //pobranie indexu elementu, ktory bedzie do usuniecia, zeby odjac go od tablicy, bo jakbym robil taskTable.splice(event.target.parentNode, 1), to by mi nieprawidlowo usuwalo, przy search, usuwalo by mi zawsze pierwszy element jaki jest (z samej gory), w zwykylm usuwaniu, kiedy nie usuwam niczego w search, to by dzialalo (czyli te elementy, ktore sa po dodaniu poprzez Add)
    //https://stackoverflow.com/questions/8801787/get-index-of-clicked-element-using-pure-javascript
    const index = [...taskTable].indexOf(event.target.parentNode);
    console.log(index);
    taskTable.splice(index, 1); //usun z tablicy wskazany do usuniecia
    addCounter -= 1;
    counter -= 1; // jak usune wszystkie dodane taski to usun mi z listPanelu klase listPanelBorder, zeby niebylo niepotrzebnego bordera
    counterP.textContent = `Tasks: ${counter}`;
    //counterP.textContent = `Number of tasks to do: ${counter}`;

    if (event.target.previousElementSibling.classList.contains('checkItem')) { // jesli li ma klase checkItem to dodaj counter jest to w celu, ze jak zrobie check to mi wtedy usunie z countera, ze niby juz cos kupilem i jak dodatkowo nacisne remove majac checked to wtedy moge wyjsc na minus, bo dwa razy mi counter na minus zrobi, a to jest w celu zeby tak sie nie dzialo
        counter += 1;
        counterP.textContent = `Tasks: ${counter}`;
    }
    if (counter === 0) { // jak usune wszystkie dodane taski to usun mi z listPanelu klase listPanelBorder, zeby niebylo niepotrzebnego bordera
        listPanel.classList.remove("listPanelBorder");
    }
    if (addCounter === 0) { //usun counterPanel jesli addCounter jes rowny 0
        toDo.removeChild(counterPanel);
    }
}

//Dodawanie taska
const addTask = (event) => {
    event.preventDefault(); //zeby nie odswiezalo po dodaniu
    //'zabranie' wpisanego inputa i przekazanie jego wartosci do zmiennej task
    const task = input.value;

    if (task === '') {
        return false;
    }

    //utworzenie diva i nadanie mu klasy itemContainer
    //form od diva jest lepszy do takich zadan, chociaz i za pomoca diva zadziala
    const taskContainer = document.createElement('form');
    taskContainer.className = 'itemContainer';

    //utworzenie li i nadanie mu klasy item
    const taskItem = document.createElement('li');
    taskItem.className = 'item';


    //utworzenie buttona i nadanie mu klasy removeItem i napisu w postaci Remove Item
    const taskItemRemove = document.createElement('button');
    taskItemRemove.className = 'removeItem';

    //kazdy nowy li ma nazwe taka jaka wpisalem w input
    taskItem.textContent = task;

    //do listy ul dodaj div itemContainer
    taskList.appendChild(taskContainer);

    //w dive itemContainer dodaj li
    taskContainer.appendChild(taskItem);

    //dodaj klase removeItem do form itemContainer
    taskContainer.appendChild(taskItemRemove);

    //do diva listPanel dodaj liste ul o nazwie itemList (taskList)
    listPanel.appendChild(taskList);

    input.value = '';

    addCounter += 1;

    counter += 1;
    counterP.textContent = `Tasks: ${counter}`;

    if (counter === 1) { //jesli mam juz jeden element to dodaj do listPanel klase listPanelBorder
        listPanel.className += ' listPanelBorder';

        //i dodaj do toDo counterPanel
        counterPanel.appendChild(counterP);
        toDo.appendChild(counterPanel);
    }
    taskTable.push(taskContainer);

    taskContainer.querySelector('button').addEventListener('click', removeTask);

    taskItem.addEventListener('click', checkedTask);
}

addThing.addEventListener('click', addTask);

//jesli nacisne enter i input nie jest pusty to uruchom funkcje dodajaca task
document.body.addEventListener('keydown', function (event) {
    if (event.keyCode === 13 && input.value != '') {
        document.body.addEventListener('submit', addTask);
    }
});

inputSearch.addEventListener('input', searchTask);