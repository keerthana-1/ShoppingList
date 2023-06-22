const formitem = document.getElementById("item-form");
const inptext=document.getElementById("item-input");
const itemlst=document.getElementById("item-list");
const filter=document.getElementById("filter");
const clearbtn=document.getElementById("clear");
const items=itemlst.querySelectorAll("li");
const formbtn = formitem.querySelector("button");
let iseditMode=false;

function addItem(e){
    e.preventDefault();
    
    if(inptext.value === '' || inptext.value === ' ')
    {
        alert("enter valid input");
        return
    }

    if(iseditMode){

        const itemToEdit = itemlst.querySelector('.edit-mode');

        removeItemsFromLocalstorage(itemToEdit.textContent);
        console.log(itemToEdit.classList);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        iseditMode=false;

    }
    else{

        if(checkDuplicates(inptext.value)){
            alert("Item already exists");
            inptext.value="";
            return;
        }
    }
    

    addItemToDOM(inptext.value)
    addItemtoLocalStorage(inptext.value);
    checkUI();
    inptext.value="";      
    
}

function checkDuplicates(item){

    const itemsInStorage=getItemsFromLocalStorage();
    return itemsInStorage.includes(item);
}

function addItemToDOM(item){

    const li=document.createElement("li");
    const button=document.createElement("button");
    button.classList="remove-item btn-link text-red";
    const i=document.createElement("i");
    i.classList="fa-solid fa-xmark";
    const inp = document.createTextNode(item);
    li.appendChild(inp);
    li.appendChild(button);
    button.appendChild(i);
    itemlst.append(li);
}

function addItemtoLocalStorage(item){
    let itemsInStorage = getItemsFromLocalStorage();

    itemsInStorage.push(item);
    localStorage.setItem('items',JSON.stringify(itemsInStorage));
}

function getItemsFromLocalStorage(){

    let itemsInStorage;
    if(localStorage.getItem('items') === null){
        itemsInStorage=[]
    }
    else{

        itemsInStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsInStorage;
}

function removeItem(e){

    if(e.target.parentElement.classList.contains('remove-item')){
        if(confirm("Are you sure?")){
            e.target.parentElement.parentElement.remove();
            removeItemsFromLocalstorage(e.target.parentElement.parentElement.textContent);    
        }
        checkUI();
    }
    else{

        setItemToEdit(e.target);
    }
}

function removeItemsFromLocalstorage(item){

    let itemsInStorage = getItemsFromLocalStorage();
    itemsInStorage = itemsInStorage.filter((i) => i!=item);

    localStorage.setItem('items',JSON.stringify(itemsInStorage));

}

function setItemToEdit(item){

    iseditMode=true;

    itemlst.querySelectorAll('li').forEach((i)=> i.classList.remove("edit-mode"));

    item.classList.add("edit-mode");
   
    formbtn.innerHTML='<i class="fa-solid fa-pen"></i> Update Item';
    
    formbtn.style.backgroundColor="green";
    inptext.value=item.textContent;


}

function clearAllItems(e){
    
    while(itemlst.firstChild){
        itemlst.firstChild.remove();
    }
    localStorage.removeItem('items');
   checkUI();
   
}

function checkUI(){

    inptext.value="";

    const items=itemlst.querySelectorAll("li");
    if(items.length === 0){
        filter.style.display='none';
        clearbtn.style.display='none';
    }
    else{
        filter.style.display='block';
        clearbtn.style.display='block';
    }

    formbtn.innerHTML='<i class="fa-solid fa-plus"></i> Add Item';
    formbtn.style.backgroundColor="#333";
    iseditMode=false;
}

function filterItems(e){

    const items=itemlst.querySelectorAll("li");
    console.log(e.target.value);
    const filtertext=e.target.value.toLowerCase();

    items.forEach(
        (item)=> 
       { const i=item.firstChild.textContent.toLowerCase();
        if(i.indexOf(filtertext)!=-1){
            item.style.display="flex";
        }
        else{
            item.style.display="none";
        }

       } );
}

function displayItems(e){

    const itemsInStorage = getItemsFromLocalStorage();
    console.log(itemsInStorage);
    itemsInStorage.forEach((item)=>
        addItemToDOM(item));

        checkUI();
}

formitem.addEventListener('submit',addItem);
itemlst.addEventListener('click',removeItem);
clearbtn.addEventListener('click',clearAllItems);
filter.addEventListener('input',filterItems);
document.addEventListener('DOMContentLoaded',displayItems);
checkUI();