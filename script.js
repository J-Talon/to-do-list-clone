// Function waits for the DOM to fully load
window.onload = function() {

    const CREATE_BTN = document.querySelector('#create-items');
    const TASK_DESCR = document.querySelector('#task-description');
    const DIV = "div";
    var idCount = 1;
    
    // This event delegation is for the dynamically created "done" and "delete" buttons
    document.body.addEventListener('click', (event) => {

        var btnID = event.target.id;

        if (btnID == CREATE_BTN.id) {
            createTask();
            return;
        }

        if(btnID.startsWith('done_button-') || btnID.startsWith('delete_button-')) {
            moveTask(btnID);
            return;
        }
    });


       function createTask() {
        /* When #create-items button clicked, create a div element for the task and append inside #list-container */
    
        // Check that text box isn't empty
        if(!TASK_DESCR.value) {
            alert('Input task and description...');
            return;
        }

        const PARENT_DIV = document.createElement(DIV);          
        const CHILD_DIV = document.createElement(DIV);

        // Define classnames and id for the newly created elements
        PARENT_DIV.className = "flex-hor";
        CHILD_DIV.className = "created-items"; 
        PARENT_DIV.id = DIV + "-" + idCount;
        CHILD_DIV.id = 'child-' + idCount;

        // Retreive text value from input element
        CHILD_DIV.innerHTML = TASK_DESCR.value;

        // Destructing/pattern matching 
        const [doneBtn, deleteBtn] = buttonMaker();

        // Append all elements to the PARENT_DIV element
        PARENT_DIV.append(CHILD_DIV, doneBtn, deleteBtn);

        // Append PARENT_DIV element to the #list-container
        document.getElementById("list-container").appendChild(PARENT_DIV);

        // Reset the text field of input element
        TASK_DESCR.value = '';

        idCount++;

        return;
    }

    function buttonMaker() {
        /* Helper function to make done and delete buttons for each task item created */

        const done = document.createElement("button");
        const delBtn = document.createElement("button"); 

        done.id = "done_button-" + idCount;
        delBtn.id = "delete_button-" + idCount; 

        done.appendChild(document.createTextNode('Done'));              
        delBtn.appendChild(document.createTextNode('Delete'));

        return [done, delBtn];
    }

    function moveTask(ID) {
        /* Move tasks to either the #done-container or #delete-container */
        
        // Get the idCount of the associated element
        var idDigit = ID.split("-").pop();

        // Get the button id prefix
        var idPrefix = ID.split("_").shift();
        
        const PARENT_DIV = document.getElementById(DIV + "-" + idDigit);
        const TASK_TEXT = document.getElementById('child-' + idDigit).innerHTML;
        const HISTORY_CONTAINER = document.getElementById(idPrefix + '-container');

        // Move task to #done-container or #delete-container
        const newDiv = document.createElement(DIV);
        newDiv.innerHTML = TASK_TEXT;
        newDiv.className = 'history'
        HISTORY_CONTAINER.appendChild(newDiv);        

        // Remove the task from #list-container div
        PARENT_DIV.remove();
    }

}