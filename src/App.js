import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';


function App() {
  let [todolist,setTodolist]=useState([]);
  let saveTodoList=(event)=>{
    let toname=event.target.toname.value;
    if(!todolist.includes(toname)){
      let finaltodo=[...todolist,toname]
      setTodolist(finaltodo)
    }
    else{
      alert("the activity is already listed...");
    }
    event.preventDefault();
  }
  let list=todolist.map((value,index)=>{
    return(
      <TodolistItems  value={value} indexNo={index
      } todolist={todolist} setTodolist={setTodolist} />
    )
  });
  return (
    <div className="App">
      <h1>ToDo List</h1>
      <form onSubmit={saveTodoList}>
      <input
          type="text"
          name='toname'
        />
        <button>Save</button>
      </form>
      <div className='outerdiv'>
      <ul>
        {list}
      </ul>
      </div>
    </div>
  );
}

export default App;

function TodolistItems({value,indexNo,todolist,setTodolist}){
  let [status,setStatus]=useState(false);
  let deleteTask =()=> {
    let updatedTasks = todolist.filter((_, i) => i !== indexNo);
    setTodolist(updatedTasks);
  };
  let checkStatus=()=>{
    setStatus(!status)
  }
  return(
    <li className={(status)?'completeTodo':''} onClick={checkStatus}>{indexNo+1}. {value} <span onClick={deleteTask}>&times;</span></li>
  );
}