window.onload = () => {

    const ADD_BTN = document.querySelector('#add-item');
    const USER_INPUT_DESCR = document.querySelector('#task-description');
    const POPUP_TASK = document.querySelector('#popup-task-list');
    const POPUP_HISTORY = document.querySelector('#popup-history-list');
    const TASK_LIST = document.querySelector('#task-list');
    const DONE_LIST = document.querySelector('#history-done-list');
    const DELETE_LIST = document.querySelector('#history-delete-list');    
    const DIV = "div";
    var clicked_Task_Descr = '';
    var div_ID = '';



//////////////////Names of the tables in the SQL server
    const TASKS_TABLE = "tasks";
    const DONE_TABLE = "done";
    const DELETED_TABLE = "deleted";

    const ACTION = "action";
    const ID_HEADER = "id";
    const CONTENT_HEADER = "content";
    const REM_TABLE = "old_table";
    const ADD_TABLE = "new_table";
    const TABLE_HEADER = "table";

    const ACTION_NEW = 'new';
    const ACTION_LOAD = "load";
    const ACTION_MOVE = 'move';


///////////////////////////


loadEntries();

///////////////////////////

//this function adds a value to the database and returns the id of the task. 
//we then use this id to assign an id to the element on the HTML
async function getIdAndAdd(content) {

    //fetching from the /dev/new gateway
    let response = await fetch("http://localhost:80/dev/new", 
    {
      method:"POST", 

      //the body has the action we want to perform and the content
      body: JSON.stringify({[ACTION]: ACTION_NEW, [CONTENT_HEADER]: content}),
      headers: {'Content-Type':'application/json'},
    });

    //we need to await the data otherwise we'll return before the promise is completed, resulting in an undefined value
    let data = await response.text();
    return data;
}

//////////////////////////////////////////////////////////

/*
This function sends a request to the NodeServer to move a task from one DB table to another DB table
Takes an ID of the task to move, alongside which table it is currently in, and which table it should be moved to.
*/
async function moveTask(currentTable, newTable, id) {
    let response = await fetch("http://localhost:80/dev/move", 
    {
      method:"POST", 
      body: JSON.stringify({[ACTION]: ACTION_MOVE, [REM_TABLE]: currentTable, [ADD_TABLE]: newTable, [ID_HEADER]: id}),
      headers: {'Content-Type':'application/json'},
    });

    let status = await response.text();
    return status;

}


//helper function to take all elements of a dictionary and create html elements out of them
 function load(entries, listName) {
    for (let [id, text] of Object.entries(entries)) {

        let parentDiv = document.createElement(DIV);
        parentDiv.className = "task-item";
        createElement(parentDiv, DIV+"-"+id, text, listName);
    }
}

async function loadEntries() {
    let entries = undefined;
    let response = undefined;

    //////////////////////
    //we are getting all entries from the tasks table, turning the string returned into a dict, and then calling load(entries, listName)
    response = await fetch("http://localhost:80/dev/load", {
        method:"POST", 
        body: JSON.stringify({[ACTION]: ACTION_LOAD, [TABLE_HEADER]: TASKS_TABLE}),
        headers: {'Content-Type':'application/json'},
    }
);

   entries = await response.text();
   load(await JSON.parse(entries), 'task-list');


////////////////////
   //done table
   response = await fetch("http://localhost:80/dev/load", {
    method:"POST", 
    body: JSON.stringify({[ACTION]: ACTION_LOAD, [TABLE_HEADER]: DONE_TABLE}),
    headers: {'Content-Type':'application/json'},
 }
);

entries = await response.text();
load(await JSON.parse(entries), 'history-done-list');

////////////////////////
//deleted table
response = await fetch("http://localhost:80/dev/load", {
    method:"POST", 
    body: JSON.stringify({[ACTION]: ACTION_LOAD, [TABLE_HEADER]: DELETED_TABLE}),
    headers: {'Content-Type':'application/json'},
 }
);

entries = await response.text();
load(await JSON.parse(entries), 'history-delete-list');



}





//////////////////////////////////////////////////////////

    // Event delegator for the document
    document.body.addEventListener('click', async (event) => {

        // Store id of the DOM element triggered
        const ELE_ID = event.target.id;

        switch (true) {

            // Create, move, and restore tasks
            //if the button pressed is the button to add a task
            case ELE_ID == ADD_BTN.id || ELE_ID === 'popup-done' || ELE_ID === 'popup-delete' || ELE_ID === 'popup-restore':
                addTask(ELE_ID);
                return;
            
            // Display popup box showing the contents of the selected task in Task, Done, and Delete Lists, displaying associated buttons in box
            case ELE_ID.startsWith('div-'): 
                // Store contents of the selected task item 
                clicked_Task_Descr = event.target.innerHTML;
                // Store id of the selected task div element
                div_ID = ELE_ID;
                disp_Popup(ELE_ID);
                return;               
            
            // Close popup box when close button is clicked
            case ELE_ID === 'popup-close':
                POPUP_TASK.style.display = 'none';
                POPUP_HISTORY.style.display = 'none';
                return;
        }

    });




    ////////////////////////////////////////////////////////////////

    async function addTask(id) {

        /* Create items and put into Task List; 
           Move item from Task List to Done List or Delete List;
           Restore tasks back to Task List from Delete List*/
   
        var container_ID;

        // When user clicks Add button, make sure the input field is NOT empty
        if (id === ADD_BTN.id && !USER_INPUT_DESCR.value) {
            alert('Input task and description...');
            return;
        }      

        // Create div element and Define classnames and id for the newly created element
        const PARENT_DIV = document.createElement(DIV); 
        PARENT_DIV.className = "task-item";

        switch(true) {

            // Case for when input field is filled and click Add button
            case id === ADD_BTN.id:  {
                container_ID = 'task-list';  ///parent that's holding the div

                let taskID = await getIdAndAdd(USER_INPUT_DESCR.value);
    
                createElement(PARENT_DIV, DIV + "-" + taskID, USER_INPUT_DESCR.value, container_ID);
                // Reset the text field of input element
                USER_INPUT_DESCR.value = '';
                return;
            }

            // Case for when we select item in Delete List and click restore button
            case id === 'popup-restore': {
                container_ID = 'task-list';
                // Reset popup to display none
                POPUP_HISTORY.style.display = 'none';
                // Remove task from Delete List
                DELETE_LIST.removeChild(document.querySelector('#'+div_ID));
                createElement(PARENT_DIV, div_ID, clicked_Task_Descr, container_ID);

                let idNumerical = div_ID.split("-").pop();
                await moveTask(DELETED_TABLE, TASKS_TABLE, idNumerical);

                return;
            }

            // if the id === 'popup-done' or id === 'popup-delete' when popup container displays by clicking on item in Task List
            default:
                {
                // Get the suffix of the button using the .split().pop() methods and use to define the history-done-list or history-delete-list
            
                let idNumerical = div_ID.split("-").pop();
                //curtable, newtable, id

                //depending on the button id, we are moving the task from the unfinished tasks table to either the done or deleted
                //table
               if (id === 'popup-done') {
                await moveTask(TASKS_TABLE, DONE_TABLE, idNumerical);
               }
               else if (id === 'popup-delete') {
                await moveTask(TASKS_TABLE, DELETED_TABLE, idNumerical);
               }
               
                // container_ID = 'history-' + idNumerical + '-list';  <-- this is wrong, cause it got "history-n-list", which no element has
                container_ID = 'history-'+id.split("-").pop()+"-list";

                // Reset popup to display none
                POPUP_TASK.style.display = 'none';
                // Remove task from Task List
                TASK_LIST.removeChild(document.querySelector('#'+div_ID));
                
                createElement(PARENT_DIV, div_ID, clicked_Task_Descr, container_ID);
                return;
            }              
        }
    }

    function createElement(div_Ele, div_ID, div_Text, container_ID) {
        /* Function creates div elements for the tasks and appends to the container_ID provided */

        // Assign the div element the following text from user input
        div_Ele.id = div_ID;
        div_Ele.innerHTML = div_Text;


        // Append PARENT_DIV element to the #list-container
        document.getElementById(container_ID).appendChild(div_Ele);  

        return;

    }

    function disp_Popup(ELE_ID) {
        /* Function used to display the popup box based on the List container the item selected is in*/

        var popup_Content;

        // Display popup associated with Task List
        if(TASK_LIST.contains(document.querySelector('#' + ELE_ID))) {
            popup_Content = document.querySelector('#popup-task-list #modify-descr');
            popup_Content.innerHTML = clicked_Task_Descr;
            POPUP_TASK.style.display = 'block';
        }
        // Display popup assocuated with Done List and Delete List
        else {

            popup_Content = document.querySelector('#popup-history-list #modify-descr');
            popup_Content.innerHTML = clicked_Task_Descr;

            if (DONE_LIST.contains(document.querySelector('#' + ELE_ID))) {                
                document.getElementById('popup-restore').style.display = 'none';
            }
            else {
                document.getElementById('popup-restore').style.display = 'inline-block';
            }

            POPUP_HISTORY.style.display = 'block';
        }       

    }

}

