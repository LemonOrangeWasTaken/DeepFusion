class dropout_node{ // <-- change this to match your node
    // fields
    constructor(UUID, dataUUID, wipe_data=true) {

        this.menu_template = [ // set menu template field (uuid)
            {
                "<>" : "h3",
                "style" : "margin-bottom:1%",
                "html" : "Dropout"
            },{
                "<>" : "hr",
                "style" : "width: 30%; opacity:0.1; color: white",
            },{
                "<>" : "section",
                "class" : "input-parent-container",
                "html" : [
                    {
                        "<>" : "p",
                        "class" : "unselectable section-text",
                        "text" : "Probability (%):",
                    },{ // slider 1
                        "<>" : "section",
                        "class" : "slider-container",
                        "html" : [
                            {
                                "<>" : "input",
                                "type" : "range",
                                "min" : "0",
                                "max" : "99",
                                "value" : "${chance}",
                                "class" : "slider",
                                "id" : "${uuid}prob-slider",
                            }, {
                                "<>" : "input",
                                "type" : "number",
                                "class" : "number-box",
                                "id" : "${uuid}prob",
                            }
                        ],
                    },
                    // bottom padding
                    {
                        "<>" : "section",
                        "style" : "width:100%; height:1.5rem;"
                    }
                ],
            }
        ]

        this.node_template = [ // set node template field
            { // node in triangle
                "<>" : "div",
                "class" : "node-in",
                "id" : "${id_tag}in"
            }, {
                "<>" : "div",
                "class" : "node-drag",
                "id" : "${id_tag}header",
                "html": [{ // display node title
                        "<>" : "h3",
                        "class" : "unselectable node-title",
                        "style" : "cursor:move",
                        "text" : "Dropout"
                    }, { // horizontal line
                        "<>" : "hr"
                    }, { // display node display
                        "<>" : "p",
                        "id" : "${id_tag}info-prob",
                        "class" : "unselectable node-text",
                        "style" : "cursor:move",
                        "html" : "Probability: 3%"
                    }, { // horizontal line
                        "<>" : "hr"
                    }, { // status
                        "<>" : "p",
                        "class" : "unselectable node-text",
                        "style" : "cursor:move",
                        "html" : "Click To Modify"
                    }]
            }, { // node out
                "<>" : "div",
                "class" : "node-out",
                "id" : "${id_tag}out"
            }
        ]

        this.uuid = UUID; // set node uuid field
        this.data_uuid = dataUUID; // set data uuid field
        let empty_node_data = { // set default data field
           
            // DATA CONTENT GOES HERE
            "prob":3,

            // outdim is requrired by ALL nodes that produces an output. It must be an array, with integers inside.
            "outdim":null, // shape = any
            "indim":null // shape = any
        } 
        localStorage.setItem(this.data_uuid, JSON.stringify(empty_node_data)) // write empty data to local storage
        
        //                                                           v-- set a unique node code. check standards.js for node codes
        create_node(this, "do") // create a visual node 
        
        // CALLBACK DEFINITIONS
        this.populate_menu = data => { // populate menu with data
            let menu_container = create_menu_container() // create the container
            menu_container.innerHTML = json2html.render([{"uuid" : this.uuid}], this.menu_template) // render the tempalte
            render_menu(menu_container)
          
            // add event listeners for all the sliders and controls
            update_menu_slider(this, "prob", "Probability", "%", true) // the probability slider
            sync_data_all() // DO NOT DELETE THIS LINE
        }

        this.sync_data = () => {
            return // if syncying data from one attribute to another is required, delete this line and implement it below

            let new_data = JSON.parse(localStorage.getItem(this.data_uuid))

            // DATA SYNCING GOES HERE

            localStorage.setItem(this.data_uuid, JSON.stringify(new_data))
        }
    }
}