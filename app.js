// this function waits for the DOM to fully load
window.onload = function() {

    const createBtn = document.querySelector('#create-items');
    const taskDescr = document.querySelector('#task-description');
    const nums = /^[0-9]+$/;
    var idCount = 1;


    createBtn.addEventListener('click', () => {
        /* When #create-items button clicked, create a div element for the task and append inside #list-container */
    
        // Check that text box isn't empty
        if(!taskDescr.value) {
            alert('Input task and description...');
            return;
        }

        const parentDiv = document.createElement("div");          
        const childDiv = document.createElement("div");

        // Define classnames and id for the newly created elements
        parentDiv.className = "flex-hor";
        // parentDiv.id = "task-item";
        childDiv.id = 'task-item' + idCount;
        childDiv.className = "created-items";  

        // Retreive text value from input element
        childDiv.innerHTML = taskDescr.value;

        // Destructing/pattern matching 
        const [doneBtn, deleteBtn] = buttonMaker();

        // Append all elements to the parentDiv element
        parentDiv.append(childDiv, doneBtn, deleteBtn);

        // Append parentDiv element to the #list-container
        document.getElementById("list-container").appendChild(parentDiv);

        // Reset the text field of input element
        taskDescr.value = '';

        idCount++;

        // Debugging purposes only---------
        // console.log(document.getElementById('task-item' + idCount).innerHTML);
        // idCount++;
    });

    function buttonMaker() {
        /* Helper function to make done and delete buttons for each task item created */

        const done = document.createElement("button");
        const delBtn = document.createElement("button"); 

        done.id = "done-button" + idCount;
        delBtn.id = "delete-button" + idCount; 

        done.appendChild(document.createTextNode('Done'));              
        delBtn.appendChild(document.createTextNode('Delete'));

        return [done, delBtn];
    }

    // This event delegation is for the dynamically created "done" and "delete" buttons
    document.addEventListener('click', (event) => {

        const btnID = event.target.id;

        if(btnID.startsWith("done")){
            
            console.log(btnID);
        }

        return;

        // const doneItemBtn = document.querySelector('#done-button');
        // const delItemBtn = document.querySelector('#delete-button');

        // if(doneItemBtn) {
        //     funcDone(doneItemBtn);
        // }
        // else{
        //     funcDel();
        // }
    });

    function funcDone(doneItemBtn) {
        // todo: https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript
        doneItemBtn.addEventListener('click', () => {
            /* When #done-button is clicked, item from #list-container removed and palced into #done-container */

            // const taskDescr = document.querySelectorAll('#task-item'+nums);
            // console.log(taskDescr[1]);
            // const taskDiv = document.createElement('div');
            // taskDiv.innerHTML = taskDescr.value;

            // // Append parentDiv element to the #list-container
            // document.getElementById("done-container").appendChild(taskDiv);

            return;

        });
    }

    function funcDel(){
        return;
    }



    

}