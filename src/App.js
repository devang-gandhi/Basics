import { useReducer } from "react";
import Digitbutton from "./digitbutton";
import Operationbutton from "./operationbutton";
import "./fancy.css"

export const actions = {
    add_digit : 'add-digit',
    clear : 'clear',
    delete_digit : 'delete-digit',
    choose_op : 'choose-operation',
    evaluate : 'evaluate',
}

function reducer(state, { type, payload}){
    switch(type) {
        case actions.add_digit:

            if(state.overwrite){
                return{
                    ...state,
                    currentop: payload.digit,
                    overwrite: false,
                }
            }

            if(payload.digit=== "0" && state.currentop === "0") return state
            if(payload.digit=== "." && state.currentop.includes(".")) return state
            return {
                ...state,
                currentop: `${state.currentop || ""}${payload.digit}`,
            }

        case actions.choose_op:
            if(state.currentop == null && state.previousop == null){
                return state
            }

            if(state.currentop == null){
                return{
                    ...state,
                    operation: payload.opration,
                }
            }

            if(state.previousop == null){
                return {
                    ...state,
                    operation: payload.opration,
                    previousop: state.currentop,
                    currentop: null,   
                }
            }

            return{
                ...state,
                previousop : evaluate(state),
                operation: payload.opration,
                currentop : null
            }

        case actions.clear:
            return {}

        case actions.delete_digit:
            if(state.overwrite) {
                return{
                    ...state,
                    overwrite: false,
                    currentop: null,
                }
            }
            
        if(state.currentop == null) return state
        if(state.currentop.length === 1){
            return{
                ...state,
                currentop: null,
            }
        }

        return{
            ...state,
            currentop: state.currentop.slice(0, -1)
        }

        case actions.evaluate:
            if(state.operation == null || state.currentop == null || state.previousop == null){
                return state
            }

        return{
            ...state,
            overwrite : true,
            previousop : null,
            operation : null,
            currentop : evaluate(state),
        }
    }
}

function evaluate({currentop, previousop, operation}){
    const prev = parseFloat(previousop)
    const curr = parseFloat(currentop)

    if(isNaN(prev) || isNaN(curr)) return ""

    let comp = ""

    switch(operation){
        case "+":
            comp = prev + curr
            break

        case "-":
            comp = prev - curr
            break

        case "*":
            comp = prev * curr
            break        

        case "/":
            comp = prev / curr
            break     
    }
    return comp.toString()
}

const int_format = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})

function formatting(operand){
    if(operand == null) return  
    const[integer, decimal] = operand.split('.')

    if(decimal ==null) return int_format.format(integer)
    return `${int_format.format(integer)}.${decimal}`
}

function App() {

    const [{currentop, previousop, operation}, dispatch] = useReducer(reducer, {})
 return (
     <div className="calculator-grid">
         <div className="output">
             <div className="previous-op">{formatting(previousop)}{operation}</div>
             <div className="current-op">{formatting(currentop)}</div>
         </div>
         <button className="span-two" onClick={() => dispatch({type : actions.clear})}>AC</button>
         <button onClick={() => dispatch({type : actions.delete_digit})}>DEL</button>
         <Operationbutton opration="/" dispatch={dispatch} />
         <Digitbutton digit="1" dispatch={dispatch} />
         <Digitbutton digit="2" dispatch={dispatch} />
         <Digitbutton digit="3" dispatch={dispatch} />
         <Operationbutton opration="*" dispatch={dispatch} />
         <Digitbutton digit="4" dispatch={dispatch} />
         <Digitbutton digit="5" dispatch={dispatch} />
         <Digitbutton digit="6" dispatch={dispatch} />
         <Operationbutton opration="+" dispatch={dispatch} />
         <Digitbutton digit="7" dispatch={dispatch} />
         <Digitbutton digit="8" dispatch={dispatch} />
         <Digitbutton digit="9" dispatch={dispatch} />
         <Operationbutton opration="-" dispatch={dispatch} />
         <Digitbutton digit="." dispatch={dispatch} />
         <Digitbutton digit="0" dispatch={dispatch} />
         <button className="span-two" onClick={() => dispatch({type : actions.evaluate})}>=</button>
   
     </div>
 )
}

export default App;
