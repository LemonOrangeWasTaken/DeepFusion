// a list of things that are new to this version
let new_updates = [
    "+ Remedied performance drop when uploading training files.",
    "+ Terminal font size can now be customized.",
    "+ Minor UI changes to buttons.",
    "+ Fixed bugs."
]

// list of known commands
const ALL_CMDS = {
    "help" : value=>{
        if(value.length === 1){
            if(value[0] === "checknet"){
                dflog(supportmsg, "Check if the current model can be used for training, or have any errors.", null)
            } else if(value[0] === "trainnet"){
                dflog(supportmsg, "Train the current model, given that it is valid.", null)
                dflog(blankmsg, "Model must be valid, and IO file must exist.", pref="&emsp;Prerequisites: ")
            } else if(value[0] === "testnet"){
                dflog(supportmsg, "Test the current model on some random data.", null)
                dflog(blankmsg, "Model must be valid and trained.", pref="&emsp;Prerequisites: ")
            } else if(value[0] === "exportnet"){
                dflog(supportmsg, "Export the current model to a TensorFlow model for external usage.", null)
                dflog(blankmsg, "Model must be compiled or trained.", pref="&emsp;Note: ")
            } else if(value[0] === "compnet"){
                dflog(supportmsg, "Export the current model to a TensorFlow model for external usage.", null)
            } else if(value[0] === "delnode"){
                dflog(supportmsg, "Deletes the currently selected node.", null)
            } else if(value[0] === "clear"){
                dflog(supportmsg, "Clears the terminal.", null)
            }

            else{
                dflog(blankmsg, `Unknown command: ${value[0]}`, null, indent="0.5vw")
            }
        } else{
            dflog(supportmsg, "Type \"help [command]\" for more information on that command.<br>---")
            dflog(blankmsg, "Check the network\"s validity.", pref="checknet: ")
    
            dflog(blankmsg, "Train the current model", pref=" trainnet: ")
            
            dflog(blankmsg, "Test the current model", pref="testnet: ")
            
            dflog(blankmsg, "Export the current model", pref="exportnet: ")
            dflog(blankmsg, "Compile the current model for export", pref="compnet: ")
            dflog(blankmsg, "Delete the selected node", pref="delnode: ")
            dflog(blankmsg, "Clear the terminal", pref="clear: ")
        }
    },"whatsnew" : ()=>{
        dflog(blankmsg, "Here are the latest and greatest changes:<br>")
        dflog(blankmsg, new_updates.join("<br>"), null, 0.75)
    },"license" : ()=>{
        dflog(blankmsg, "DeepFusion is a free and opensource software licensed under the GPL3 license.")
        dflog(blankmsg, "<br>You may click on any of the copyright messages at the bottom of this webapp to view the full license as well as the contact information. Or you can click <a href=\"../license-info\" target=\"_blank\">here</a>.")
    },"checknet" : ()=>{
        dflog(blankmsg, "<span style=\"color:#39ff14\">OK</span>")
        check_network(true)
    },"trainnet" : ()=>{
        dflog(blankmsg, "<span style=\"color:#39ff14\">OK</span>")
        train_net()
    },"testnet" : ()=>{
        dflog(blankmsg, "<span style=\"color:#39ff14\">OK</span>")
        test_net_random()
    },"exportnet" : ()=>{
        export_net()
    },"compnet" : ()=>{
        compile_net()
    },"delnode":()=>{
        dflog(blankmsg, "<span style=\"color:#39ff14\">OK</span>")
        delete_selected_node()
    },"clear":()=>{
        // delete everything in terminal
        terminal.innerHTML="";
        update_term_scroll()
    },"echo": value => {
        console.log(value.join(" "))
        dflog(blankmsg, value.join(" "))
    }
}

function parse_cmd(command){
    let parts = command.split(" ")

    let execute = null
    let values = []
    let attributes = {}
    // look for command
    for(let i = 0; i < parts.length; i++){
        if(parts[i] !== ""){
            if(execute === null){ // find execution portion
                execute = parts[i]
            } else { // find values or attributes
                if(parts[i][0] === "-"){
                    // add attribute
                    let attr = parts[i].substring(1)
                    let value = i < parts.length-1 ? parts[i+1] : ""
                    attributes[attr] = value
                    i += i < parts.length-1 ? 1 : 0
                } else {
                    // add value
                    values.push(parts[i])
                }
            }
        }    
    }

    return [execute, values, attributes]
}

function execute_cmd(cmd, val, attr, orig){
    dflog(defaultinput, orig)

    // detect validity of command first
    if(!Object.keys(ALL_CMDS).includes(cmd)){
        // if command unknown
        dflog(errormsg, `Unknown command: ${cmd}`)
        return
    }

    ALL_CMDS[cmd](val, attr)

    // quick little trick to set the terminal to always at the bottom
    var messageBody = document.querySelector(".terminal");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
}

function update_term_scroll(){
    // quick little trick to set the terminal to always at the bottom
    var messageBody = document.querySelector(".terminal");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
}

function dflog(template, msg, pref=null, indent=0){
    let htmlObject = document.createElement("span");
    htmlObject.style.margin = `0.2rem 0 0 ${indent}rem`;
    if(pref !== null){
        htmlObject.innerHTML = json2html.render({"msg" : msg, "pref" : pref}, template);
    } else {
        htmlObject.innerHTML = json2html.render({"msg" : msg}, template);
    }
    terminal.appendChild(htmlObject);

    update_term_scroll()
    update_terminal_font()
}