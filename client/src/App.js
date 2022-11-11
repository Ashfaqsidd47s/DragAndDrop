import React, { useEffect, useState } from "react";
import "./app.css";
import axios from "axios";

function App() {

  const alphaList = ["A","B","C","D","E"];
  const symbols = ["+","-","*","/"];
  const [alphaValue,setAlphaValue] = useState([]);
  const [dragItem, setDragItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(-1);
  const [isSymbol, setIsSymbol] = useState(false);
  const [rhs, setRhs] = useState(null);
  const [equation, setEquation] = useState([]);
  const [sEquation, setSEquation] = useState([]);
  const [finalSymbol, setFinalSymbol] = useState(0);
  let finalEquation = equation.join();
  finalEquation = finalEquation.replace(/,/g, '');

  //fetching arraylist from mongodb server
  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const res = await axios.get("http://localhost:8800/636e6766add6f2fb7215bccb");
        setAlphaValue(res.data.numArr);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  },[])

  //override the default drag and drop states
  const overrideEventDefaults =(e)=>{
    e.preventDefault();
    e.stopPropagation();
  }

  const handelDragStart =(e, checkSymbol)=>{
    setDragItem(e.target.innerHTML);
    setIsSymbol(checkSymbol);
  }

  const handelDrop =(e)=>{
    overrideEventDefaults(e);
    setEquation([...equation, dragItem]);
    setSEquation([...sEquation,isSymbol]);
  }

  const handelDropBox = (e)=>{
    overrideEventDefaults(e);
    const coppyEquation = [...equation];
    coppyEquation.splice(dragOverItem +1, 0, dragItem);
    setEquation(coppyEquation);
    const coppySEquation = [...sEquation];
    coppySEquation.splice(dragOverItem +1, 0, isSymbol);
    setSEquation(coppySEquation);
  }

  const handelDelete = (e, index)=>{
    const coppyEquation = [...equation];
    coppyEquation.splice(index, 1);
    setEquation(coppyEquation);
    const coppySEquation = [...sEquation];
    coppySEquation.splice(index, 1);
    setSEquation(coppySEquation);
  }

  const handelRhs = (e)=>{
    let value = prompt("Please enter a integral value for right hand side of equation ");
    setRhs(value);
  }

  const handelEvaluate = (e)=>{ 
    alphaValue.map((item, index)=>(
      finalEquation = finalEquation.replaceAll(alphaList[index], item)
    ))
    // eslint-disable-next-line
    try {
      // eslint-disable-next-line
      eval(finalEquation);
    } catch (err) {
      window.alert("prease provide a valid equation ");
      return
    }
    if(finalSymbol === 1){
      // eslint-disable-next-line
      const result = eval(finalEquation) < rhs;
      window.alert("the result is - " + result );
    }
    if(finalSymbol === 2){
      // eslint-disable-next-line
      const result = eval(finalEquation) > rhs;
      window.alert("the result is - " + result );
    }
    if(finalSymbol ===0){
      window.alert("please provide the comparizon symbol (< >)");
    }
  }

  return (
    <div className="app">
      <div className="alphabets">
        {alphaList && alphaList.map((itme, index) => (
          <div className="alphabet"
            key={index}
            draggable
            onDragStart={(e)=> handelDragStart(e, false)}
          >
            {itme}
          </div>
        ))}
      </div>
      <div className="symbols">
          {symbols && symbols.map((item, index) =>(
            <div className="symbol"
              key={index}
              draggable
              onDragStart={(e)=> handelDragStart(e, true)}
            >
              {item}
            </div>
          ))}
          <div className="symbol" onClick={(e)=> setFinalSymbol(1)}>&#60;</div>
          <div className="symbol" onClick={(e)=> setFinalSymbol(2)}>&#62;</div>
          <div className="symbol" onClick={(e)=> handelRhs(e)}>Right Hand Side</div>
      </div>
      <div className="dropWrapper">
        <div className="dropContainer">
          <div className="equation"
            onDragEnter={(e)=>overrideEventDefaults(e)}
            onDragOver={(e)=>overrideEventDefaults(e)}
            onDragLeave={(e)=>overrideEventDefaults(e)}
            onDrop={(e)=> handelDrop(e)}
          >
          </div>
          <div className="test">
            {equation && equation.map((item, index) =>(
              <div className={sEquation[index] ?"eqItem eqItemSymbol" :"eqItem"}
                key={index}
                onDragEnter={(e)=>{
                  overrideEventDefaults(e)
                  setDragOverItem(index)
                }}
                onDragOver={(e)=>overrideEventDefaults(e)}
                onDragLeave={(e)=>overrideEventDefaults(e)}
                onDrop={(e)=> handelDropBox(e)}
              >
                {item}
                <div className="cros" onClick={(e)=>handelDelete(e, index)}>X</div>
              </div>
            ))}
            {finalSymbol !== 0 &&
              <div className="eqItem eqItemSymbol">
                {finalSymbol === 1? "<":">"}
                <div className="cros" onClick={(e)=> setFinalSymbol(0)}>X</div>
              </div>
            }
            {rhs && 
              <div className="eqItem rhs" >
                {rhs}
                <div className="cros" onClick={(e)=> setRhs(null)}>X</div>
              </div>
            }
          </div>
        </div>
      </div>
      <div className="evaluate" onClick={(e)=> handelEvaluate(e)}>
            Evaluate 
      </div>
      <div className="info">
        <h2>vlaues crossponding to alphabets </h2>
        {alphaList.map((item, index)=> (
          <div className="infoItem">
          {item} 
          <div>{alphaValue[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
