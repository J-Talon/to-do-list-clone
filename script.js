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
    var idCount = 0;

    // Event delegator for the document
    document.body.addEventListener('click', (event) => {

        // Store id of the DOM element triggered
        const ELE_ID = event.target.id;

        switch (true) {

            // Create, move, and restore tasks
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

    function addTask(id) {
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
            case id === ADD_BTN.id:
                container_ID = 'task-list';         
                createElement(PARENT_DIV, DIV + "-" + idCount, USER_INPUT_DESCR.value, container_ID);
                // Reset the text field of input element
                USER_INPUT_DESCR.value = '';
                idCount++;
                return;

            // Case for when we select item in Delete List and click restore button
            case id === 'popup-restore':
                container_ID = 'task-list';
                // Reset popup to display none
                POPUP_HISTORY.style.display = 'none';
                // Remove task from Delete List
                DELETE_LIST.removeChild(document.querySelector('#'+div_ID));
                createElement(PARENT_DIV, div_ID, clicked_Task_Descr, container_ID);
                return;

            // if the id === 'popup-done' or id === 'popup-delete' when popup container displays by clicking on item in Task List
            default:
                // Get the suffix of the button using the .split().pop() methods and use to define the history-done-list or history-delete-list
                container_ID = 'history-' + id.split('-').pop() + '-list';
                // Reset popup to display none
                POPUP_TASK.style.display = 'none';
                // Remove task from Task List
                TASK_LIST.removeChild(document.querySelector('#'+div_ID));
                createElement(PARENT_DIV, div_ID, clicked_Task_Descr, container_ID);
                return;                
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