class FlackDialog {
    
    /**
     * Instantiate a new flack dialog.
     * @param {String} selectors the div element on the html.
     * @param {JSON} options dialog options
     *        { 
     *          isLoading: Boolean,
     *          icon: {name: String, style: String, size: String = "fa-2x"}
     *          title: String,
     *          message: String,
     *          input: {placeholder: String = "", value: String = ""}
     *          positiveButton: {text: String, onclick: Function = this.dismiss},
     *          negativeButton: {text: String, onclick: Function = this.dismiss}
     *        }
     */
    constructor(selector, options) {
        this.selector = selector;
        this.options = options;
    }



    // Getters and Setters
    /**
     * Sets the loading state of the dialog.
     * @param {Boolean} isLoading if true, shows a circular loading bar, hiding the icon if available, otherwise, shows the icon if available.
     */
    set isLoading(isLoading) {
        this.options.isLoading = isLoading;
        const loading_div = document.querySelector("#fd_loading_div");
        
        if (isLoading) {
            if (loading_div == null) {
                const flackdialogcontent = document.querySelector("#fd_content");
                this.__addLoading(flackdialogcontent);
            } else {
                const loading_spinner = loading_div.querySelector("#fd_loading_spinner");
                loading_spinner.className = "";
                loading_spinner.classList.add("spinner-border");
            }

        } else {
            if (loading_div != null) loading_div.remove();
            const icon = document.querySelector("#fd_icon");
            if (icon != null) icon.removeAttribute("hidden");
        }
    }
    get isLoading() {
        return Boolean(this.options.isLoading);
    }


    /**
     * Sets a font-awesome icon.
     * @param {Object} icon {name: String, style: String, size: String = "fa-2x"} or pass `null` to remove the icon.
     */
    set icon(icon) {
        const icon_i = document.querySelector("#fd_icon");

        if (icon != null) {
            if (typeof icon !== "object") throw new Error("icon() can only accept an object as it's argument");

            const newName = icon.name;
            const newStyle = icon.style;
            const newSize = icon.size;

            if (this.options.icon == null) this.options.icon = {}
            if (newName != null) this.options.icon.name = newName;
            if (newStyle != null) this.options.icon.style = newStyle;
            if (newSize != null) this.options.icon.size = newSize;
    
    
            if (icon_i == null) {
                // does not exist. create a new icon element.
                const flackdialogcontent = document.querySelector("#fd_content");
                this.__addIcon(flackdialogcontent, this.options.icon);
            
            } else {
                // already exists. just update the icon.
                icon_i.className = "";
                icon_i.classList.add(this.options.icon.name, this.options.icon.style, this.options.icon.size, "mb-3", "order-0");
            }

        } else {
            this.options.icon = icon;
            if (icon_i != null) icon_i.remove();
        }
    }


    /**
     * Sets the dialog title
     * @param {String} title the title text, or `null` if you want to remove the title.
     */
    set title(title) {
        const title_p = document.querySelector("#fd_title");
        this.options.title = title;

        if (title != null) {    
            if (title_p == null) {
                // does not exist. create a new title element.
                const flackdialogcontent = document.querySelector("#fd_content");
                this.__addTitle(flackdialogcontent, title);
                
            } else {
                // already exists. just update the title.
                title_p.innerHTML = title;
            }

        } else {
            if (title_p != null) title_p.remove();
        }
        
    }
    get title() {
        return this.options.title;
    }


    /**
     * Sets the dialog message.
     * @param message the message text, or `null` if you want to remove the message.
     */
    set message(message) {
        const message_p = document.querySelector("#fd_message");
        this.options.message = message;

        if (message != null) {
            if (message_p == null) {
                // does not exist. create a new message element.
                const flackdialogcontent = document.querySelector("#fd_content");
                this.__addMessage(flackdialogcontent, message);
            
            } else {
                // already exists. just update the message.
                message_p.innerHTML = message;
            }    

        } else {
            if (message_p != null) message_p.remove();
        }
        
    }
    get message() {
        return this.options.message;
    }


    /**
     * Sets the positiveButton props
     * @param {Object} positiveButton {text: String, onclick: Function} or pass null to remove the positive button.
     */
    set positiveButton(positiveButton) {
        const positive_button = document.querySelector("#fd_positivebutton");

        if (positiveButton != null) {
            if (typeof positiveButton !== "object") throw new Error("positiveButton() can only accept an object as it's argument");

            const newText = positiveButton.text;
            const newOnclick = positiveButton.onclick;
            const newDisableOnEmptyInput = positiveButton.disableOnEmptyInput;
            const newDisabled = positiveButton.disabled;

            if (newText != null) this.options.positiveButton.text = newText;
            if (newOnclick != null) this.options.positiveButton.onclick = newOnclick;
            if (newDisabled != null) this.options.positiveButton.disabled = newDisabled;
            if (newDisableOnEmptyInput != null) this.options.positiveButton.disableOnEmptyInput = newDisableOnEmptyInput;
    
    
            if (positive_button == null) {
                // does not exist. create a new icon element.
                const flackdialogbuttonsflex = document.querySelector("#fd_buttonsflex");
                this.__addPositiveButton(flackdialogbuttonsflex, this.options.positiveButton);
            
            } else {
                // already exists. just update the button.
                positive_button.innerHTML = this.options.positiveButton.text;
                positive_button.onclick = this.options.positiveButton.onclick;
                if (this.options.positiveButton.disabled) {
                    positive_button.setAttribute("disabled", "")
                } else {
                    positive_button.removeAttribute("disabled")
                }
            }

        } else {
            this.options.positiveButton = positiveButton;
            if (positive_button != null) positive_button.remove();
        }
    }

    /**
     * Sets the negativeButton props
     * @param {Object} negativeButton {text: String, onclick: Function} or pass null to remove the negative button.
     */
    set negativeButton(negativeButton) {
        const negative_button = document.querySelector("#fd_negativebutton");

        if (negativeButton != null) {
            if (typeof negativeButton !== "object") throw new Error("negativeButton() can only accept an object as it's argument");

            const newText = negativeButton.text;
            const newOnclick = negativeButton.onclick;
            const newDisableOnEmptyInput = negativeButton.disableOnEmptyInput;
            const newDisabled = negativeButton.disabled;

            // update the necessary
            if (newText != null) this.options.negativeButton.text = newText;
            if (newOnclick != null) this.options.negativeButton.onclick = newOnclick;
            if (newDisabled != null) this.options.negativeButton.disabled = newDisabled;
            if (newDisableOnEmptyInput != null) this.options.negativeButton.disableOnEmptyInput = newDisableOnEmptyInput;
    
    
            if (negative_button == null) {
                // does not exist. create a new icon element.
                const flackdialogbuttonsflex = document.querySelector("#fd_buttonsflex");
                this.__addNegativeButton(flackdialogbuttonsflex, this.options.negativeButton);
            
            } else {
                // already exists. just update the button.
                negative_button.innerHTML = this.options.negativeButton.text;
                negative_button.onclick = this.options.negativeButton.onclick;
                if (this.options.negativeButton.disabled) {
                    negative_button.setAttribute("disabled", "")
                } else {
                    negative_button.removeAttribute("disabled")
                }
            }

        } else {
            this.options.negativeButton = negativeButton;
            if (negative_button != null) negative_button.remove();
        }
    }


    /**
     * Sets the dialog input props
     * @param {Object} input {placeholder: String = "", value: String = ""} or pass null to remove the input.
     */
    set input(input) {
        const input_input = document.querySelector("#fd_input");

        if (input != null) {
            if (typeof input !== "object") throw new Error("input() can only accept an object as it's argument");

            const newPlaceholder = input.placeholder;
            const newValue = input.value;
            const newDisabled = input.disabled;

            if (newPlaceholder != null) this.options.input.placeholder = newPlaceholder;
            if (newValue != null) this.options.input.value = newValue;
            if (newDisabled != null) this.options.input.disabled = newDisabled;
    
            if (input_input == null) {
                // does not exist. create a new icon element.
                const flackdialogcontent = document.querySelector("#fd_content");
                this.__addInput(flackdialogcontent, this.options.input);
            
            } else {
                // already exists. just update the input.
                input_input.placeholder = this.options.input.placeholder;
                input_input.value = this.options.input.value;
                if (this.options.input.disabled) {
                    input_input.setAttribute("disabled", "")
                } else {
                    input_input.removeAttribute("disabled")   
                }
            }

        } else {
            this.options.input = input;
            if (input_input != null) input_input.remove();
        }
    }
    get inputValue() {
        const input = document.querySelector("#fd_input");
        if (input == null) return null;
        return input.value;
    }



    
    /**
     * Call this after setting all the options
     */
    show() {
        // <div id="flackdialog" class="modal fade" tabindex="-1" role="dialog">
        //     <div class="modal-dialog modal-sm modal-dialog-centered">
        //         <div class="c-modal modal-content px-3 py-4 text-center">
        //             <i id="fd_icon" hidden class="fa-lg mb-3"></i>
        //             <div class="d-flex justify-content-center">
        //                 <div id="fd_progress" hidden role="status"></div>
        //             </div>
        //             <p hidden id="fd_title" class="title font-weight-bolder m-1"></p>
        //             <p hidden id="fd_message" class="message font-weight-normal"></p>
        //             <input hidden id="fd_input" type="text" placeholder="name your channel..." class="c-input text-center font-weight-normal mb-3">
        
        //             <div class="row justify-content-around mt-1">
        //                 <div class="col">
        //                     <button id="fd_negativebutton" type="button" class="c-button--secondary mb-0 w-100" data-dismiss="modal">Cancel</button>
        //                 </div>
        //                 <div class="col">
        //                     <button hidden id="fd_positivebutton" type="button" class="c-button--primary mb-0 w-100"></button>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        // create the dialog.
        const flackdialog = document.querySelector(this.selector);
        flackdialog.classList.add("modal", "fade");
        flackdialog.tabIndex = "-1";
        flackdialog.setAttribute("role", "dialog")

        const flackdialogparent = document.createElement("div");
        flackdialogparent.classList.add("modal-dialog", "modal-sm", "modal-dialog-centered");

        const flackdialogcontent = document.createElement("div");
        flackdialogcontent.id = "fd_content";
        flackdialogcontent.classList.add("c-modal", "modal-content", "px-3", "py-4", "text-center", "d-flex", "flex-column");

        // <div class="row justify-content-around mt-1">
        //     <div class="col">
        //         <button id="fd_negativebutton" type="button" class="c-button--secondary mb-0 w-100" data-dismiss="modal">Cancel</button>
        //     </div>
        //     <div class="col">
        //         <button hidden id="fd_positivebutton" type="button" class="c-button--primary mb-0 w-100"></button>
        //     </div>
        // </div>

        flackdialogparent.appendChild(flackdialogcontent)
        flackdialog.appendChild(flackdialogparent);

        
        // grab the options
        const isLoading = this.options.isLoading == null ? false : this.options.isLoading; // boolean
        if (isLoading == null) this.options.isLoading = false;
        const icon = this.options.icon; // json {name: String, style: String, Size: String = "fa-lg"}
        const title = this.options.title; // string
        const message = this.options.message; // string
        const input = this.options.input; // json {placeholder: String, value: String}
        const positiveButton = this.options.positiveButton; // json {text: String, onclick: fn}
        const negativeButton = this.options.negativeButton;

        
        if (icon != null) {
            // validate first:
            if (typeof icon !== 'object') throw new Error("the icon property should be of type object");
            this.__addIcon(flackdialogcontent, icon);
        }
        
        if (isLoading) {
            if (typeof isLoading !== 'boolean') throw new Error("the isLoading property should be of type boolean");
            this.__addLoading(flackdialogcontent);
        }

        if (title != null) {
            if (typeof title !== 'string') throw new Error("the title property should be of type string");
            // <p id="fd_title" class="title font-weight-bolder m-1"></p>
            this.__addTitle(flackdialogcontent, title);
        }

        if (message != null) {
            if (typeof message !== 'string') throw new Error("the message property should be of type string");
            // <p hidden id="fd_message" class="message font-weight-normal"></p>
            this.__addMessage(flackdialogcontent, message);
        }

        
        if (input != null) {
            if (typeof input !== 'object') throw new Error("the input property should be of type object");
            // <input id="fd_input" type="text" placeholder="name your channel..." class="c-input text-center font-weight-normal mb-3"></input>
            this.__addInput(flackdialogcontent, input);
        }

        const buttons_flex = document.createElement("div");
        buttons_flex.id = "fd_buttonsflex";
        buttons_flex.classList.add("d-flex", "flex-wrap", "justify-content-center", "mt-1", "order-5");
        flackdialogcontent.appendChild(buttons_flex);


        if (negativeButton != null) { // json {text: String, onclick: Function}
            if (typeof negativeButton !== "object") throw new Error("the negativeButton property should be of type object")
            this.__addNegativeButton(buttons_flex, negativeButton);
        }

        if (positiveButton != null) { // json {text: String, onclick: Function}
            if (typeof positiveButton !== "object") throw new Error("the positiveButton property should be of type object")
            this.__addPositiveButton(buttons_flex, positiveButton);
        }



        // finally show the dialog.
        $(this.selector).off();
        $(this.selector).on('shown.bs.modal', () => {
            if (input != null) {
                const input_input = document.querySelector("#fd_input");
                if (input.autofocus) input_input.focus();
            }
        })

        $(this.selector).modal('show');
        $(this.selector).on('hidden.bs.modal', () => {
            // reset the dialog when it is closed.
            document.querySelector(this.selector).innerHTML = "";
        });
    }

    // dismisses the dialog.
    dismiss() {
        $(this.selector).modal('hide');
    }







    // Utilities
    __insertChildAtIndex (parent, child, index) {
        if (!index) index = 0
        if (index >= parent.children.length) {
          parent.appendChild(child)
        } else {
          parent.insertBefore(child, parent.children[index])
        }
    }



    __addLoading(flackdialogcontent) {
        const loading_div = document.createElement("div");
        loading_div.id = "fd_loading_div";
        loading_div.classList.add("order-1");
        const loading_spinner = document.createElement("div");
        loading_spinner.id = "fd_loading_spinner";
        loading_spinner.classList.add("spinner-border");
        loading_spinner.setAttribute("role", "status")
        loading_div.appendChild(loading_spinner);
        
        // hide the icon if necessary
        const icon = flackdialogcontent.querySelector("#fd_icon");
        if (icon != null) icon.setAttribute("hidden", "");
        
        flackdialogcontent.appendChild(loading_div);
    }

    __addIcon(flackdialogcontent, icon) {
        const name = icon.name;
        const style = icon.style; // "far" or "fab" or "fas" or "fal" or "fad"
        const size = icon.size == null ? "fa-2x" : icon.size; // defaults to "fa-2x"
        if (icon.size == null) this.options.icon.size = "fa-2x";
        
        // <i id="fd_icon" class="fa-lg mb-3"></i>
        const icon_i = document.createElement("i");
        icon_i.id = "fd_icon";
        icon_i.classList.add(name, style, size, "mb-3", "order-0");
        flackdialogcontent.appendChild(icon_i)
    }

    __addTitle(flackdialogcontent, title) {
        const title_p = document.createElement("p");
        title_p.id = "fd_title";
        title_p.classList.add("title", "font-weight-bolder", "m-1", "order-2");
        title_p.innerHTML = title;
        flackdialogcontent.appendChild(title_p);
    }

    __addMessage(flackdialogcontent, message) {
        const message_p = document.createElement("p");
        message_p.id = "fd_message";
        message_p.classList.add("message", "font-weight-normal", "order-3");
        message_p.innerHTML = message;
        flackdialogcontent.appendChild(message_p);
    }

    __addInput(flackdialogcontent, input) {
        this.options.input.placeholder = (input.placeholder == null) ? "" : input.placeholder; // placeholder
        this.options.input.value = (input.value == null) ? "" : input.value; // value
        this.options.input.autofocus = (input.autofocus == null) ? true : input.autofocus; // autofocus
        this.options.input.disabled = (input.disabled == null) ? false : input.disabled; // disabled

        const input_input = document.createElement("input");
        input_input.id = "fd_input";
        input_input.classList.add("c-input", "text-center", "font-weight-normal", "mb-3", "order-4");
        input_input.type = "text";
        input_input.placeholder = this.options.input.placeholder;
        input_input.value = this.options.input.value;
        if (this.options.input.disabled) {
            input_input.setAttribute("disabled", ""); // disable the input
        }

        input_input.addEventListener("keyup", function(event) {
            const value = event.target.value.trim();
            this.options.input.value = value;
            if (value.length === 0) {
                // the input has no text...
                if (this.options.positiveButton != null) {
                    const isDisableable = this.options.positiveButton.disableOnEmptyInput;
                    if (isDisableable && !this.options.positiveButton.disabled) {
                        const positive_button = document.querySelector("#fd_positivebutton");
                        positive_button.setAttribute("disabled", "") // disable the positive button
                    }
                }

                if (this.options.negativeButton != null) {
                    const isDisableable = this.options.negativeButton.disableOnEmptyInput;
                    if (isDisableable) {
                        const negative_button = document.querySelector("#fd_negativebutton");
                        negative_button.setAttribute("disabled", "") // disable the negative button
                    }
                }
            } else {
                const positive_button = document.querySelector("#fd_positivebutton");
                const negative_button = document.querySelector("#fd_negativebutton");
                if (positive_button != null && !this.options.positiveButton.disabled) positive_button.removeAttribute("disabled") // reenable the positive button
                if (negative_button != null && !this.options.negativeButton.disabled) negative_button.removeAttribute("disabled") // reenable the negative button

            }

        }.bind(this));
        flackdialogcontent.appendChild(input_input);
    }

    __addPositiveButton(flackdialogbuttonsflex, positiveButton) {
        this.options.positiveButton.text = (positiveButton.text == null) ? "" : positiveButton.text;
        this.options.positiveButton.onclick = (positiveButton.onclick == null) ? this.dismiss.bind(this) : positiveButton.onclick;
        this.options.positiveButton.disableOnEmptyInput = (positiveButton.disableOnEmptyInput == null) ? true : positiveButton.disableOnEmptyInput;
        this.options.positiveButton.disabled = (positiveButton.disabled == null) ? false : positiveButton.disabled;

        const buttons_col = document.createElement("div");
        buttons_col.classList.add("m-1", "order-1")

        // <button id="fd_positivebutton" type="button" class="c-button--primary mb-0 w-100"></button>
        const button = document.createElement("button");
        button.id = "fd_positivebutton";
        button.type = "button";
        button.classList.add("c-button--primary", "w-100")
        button.innerHTML = this.options.positiveButton.text;
        button.onclick = this.options.positiveButton.onclick;

        if (this.options.positiveButton.disabled) button.setAttribute("disabled", "");

        if (this.options.positiveButton.disableOnEmptyInput) {
            if (this.options.input != null) {
                if (this.options.input.value === "") button.setAttribute("disabled", ""); // disable the positive button   
            }
        }

        buttons_col.appendChild(button);
        flackdialogbuttonsflex.appendChild(buttons_col);
    }


    __addNegativeButton(flackdialogbuttonsflex, negativeButton) {
        this.options.negativeButton.text = (negativeButton.text == null) ? "" : negativeButton.text;
        this.options.negativeButton.onclick = (negativeButton.onclick == null) ? this.dismiss.bind(this) : negativeButton.onclick;
        this.options.negativeButton.disableOnEmptyInput = (negativeButton.disableOnEmptyInput == null) ? false : negativeButton.disableOnEmptyInput;
        this.options.negativeButton.disabled = (negativeButton.disabled == null) ? false : negativeButton.disabled;
    
        const buttons_col = document.createElement("div");
        buttons_col.classList.add("m-1", "order-0")

        // <button id="fd_positivebutton" type="button" class="c-button--primary mb-0 w-100"></button>
        const button = document.createElement("button");
        button.id = "fd_negativebutton";
        button.type = "button";
        button.classList.add("c-button--secondary", "w-100")
        button.innerHTML = this.options.negativeButton.text;
        button.onclick = this.options.negativeButton.onclick;

        if (this.options.negativeButton.disabled) button.setAttribute("disabled", "");
        
        if (this.options.negativeButton.disableOnEmptyInput) {
            if (this.options.input != null) {
                if (this.options.input.value === "") button.setAttribute("disabled", "") // disable the positive button   
            }
        }

        buttons_col.appendChild(button);
        flackdialogbuttonsflex.appendChild(buttons_col);
    }
}