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
      <TodolistItems value={value}/>
    )
  });
  return (
    <div className="App">
      <h1>ToDo List</h1>
      <form onSubmit={saveTodoList}>
        <input type="text" name="toname"></input>
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

function TodolistItems({value}){
  return(
    <li>{value} <span>&times;</span></li>
  );
}