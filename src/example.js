import React, { Component } from "react";  
import ReactDOM from "react-dom";
import {classifyPassword} from "../password-strentgh"
import "./example.scss";

class App extends Component {
    render() {
        const { password = "" } = (this.state || {});
        var classification;
        try {
            classification = classifyPassword(password)
        } catch (error) {
            classification = {
                classification: "Invalid",
                hints: [error.message]
            }
        }
        return <div className={classification.classification}>
                    <div>
                        <h3>{classification.classification}</h3>
                        <input value={password} onChange={()=>this.setState({password: event.target.value})}></input>
                        <div className="hints">
                            {classification.hints.map((h,i)=><div key={i}>{h}</div>)}
                        </div>
                        
                    </div>
                    
                </div>
            
    }
}

ReactDOM.render(<App></App>, document.getElementById("root"));