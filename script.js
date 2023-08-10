// Function waits for the DOM to fully load
window.onload = function() {

    const CREATEBTN = document.querySelector('#create-items');
    const TASKDESCR = document.querySelector('#task-description');
    var idCount = 1;
    
    // This event delegation is for the dynamically created "done" and "delete" buttons
    document.body.addEventListener('click', (event) => {

        var btnID = event.target.id;

        if(btnID.startsWith('done_button-') || btnID.startsWith('delete_button-')) {
            moveTask(btnID);
        }

        return;

    });

    function moveTask(ID) {
        /* Move tasks to either the #done-container or #delete-container */
        
        // Get the idCount of the associated element
        var idDigit = ID.split("-").pop();

        // Get the button id prefix
        var idPrefix = ID.split("_").shift();
        
        const PARENTDIV = document.getElementById('div-' + idDigit);
        const TASKTEXT = document.getElementById('child-' + idDigit).innerHTML;
        const HISTORYCONTAINER = document.getElementById(idPrefix + '-container');

        // Move task to #done-container or #delete-container
        const newDiv = document.createElement('div');
        newDiv.innerHTML = TASKTEXT;
        newDiv.className = 'history'
        HISTORYCONTAINER.appendChild(newDiv);        

        // Remove the task from #list-container div
        PARENTDIV.remove();
    }

        CREATEBTN.addEventListener('click', () => {
        /* When #create-items button clicked, create a div element for the task and append inside #list-container */
    
        // Check that text box isn't empty
        if(!TASKDESCR.value) {
            alert('Input task and description...');
            return;
        }

        const PARENTDIV = document.createElement("div");          
        const CHILDDIV = document.createElement("div");

        // Define classnames and id for the newly created elements
        PARENTDIV.className = "flex-hor";
        CHILDDIV.className = "created-items"; 
        PARENTDIV.id = 'div-' + idCount;
        CHILDDIV.id = 'child-' + idCount;

        // Retreive text value from input element
        CHILDDIV.innerHTML = TASKDESCR.value;

        // Destructing/pattern matching 
        const [doneBtn, deleteBtn] = buttonMaker();

        // Append all elements to the PARENTDIV element
        PARENTDIV.append(CHILDDIV, doneBtn, deleteBtn);

        // Append PARENTDIV element to the #list-container
        document.getElementById("list-container").appendChild(PARENTDIV);

        // Reset the text field of input element
        TASKDESCR.value = '';

        idCount++;

        return;
    });

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

}