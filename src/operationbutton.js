import { actions } from "./App"

export default function operationbutton( {dispatch , opration}){
    return <button onClick={() => dispatch({type: actions.choose_op, payload: {opration}})}>{opration}</button>
}