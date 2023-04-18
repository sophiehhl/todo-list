const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListBtn = document.querySelector('[data-delete-list-btn]')

const listDisplayContainter = document.querySelector('[data-list-display-container')
const listTitleElement = document.querySelector('[data-list-title]')
const listCount = document.querySelector('[data-list-count')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form')
const newTaskInput = document.querySelector('[data-new-task-input')
const clearCompleteTasks = document.querySelector('[date-clear-completed-task]')

const LOCAL_STORAGE_LIST_KEY = 'myTasks.myLists'
const LOCAL_STORAGE_SELECTED__ID_KEY = 'myTasks.mySelectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED__ID_KEY)

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase()=== 'li'){
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

tasksContainer.addEventListener('click', e =>{
    if (e.target.tagName.toLowerCase() === 'input'){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete =  e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createList(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

clearCompleteTasks.addEventListener('click', e =>{
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

deleteListBtn.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

function createList(name){
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name){
    return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender(){
    save()
    render()
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED__ID_KEY, selectedListId)
}

function render() {
    clearElement(listsContainer)
    renderList()

    const selectedList = lists.find(list => list.id === selectedListId)

    if (selectedListId == null){
        listDisplayContainter.style.display = 'none'
    } else{
        listDisplayContainter.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

function renderTasks(selectedList){
    selectedList.tasks.forEach( task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList){
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTasksCount === 1 ? "task" : "tasks"
     listCount.innerText = `${incompleteTasksCount} ${taskString} remaining`
}

function renderList(){
    clearElement(listsContainer)
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId){
             listElement.classList.add('active-list')
            }
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()