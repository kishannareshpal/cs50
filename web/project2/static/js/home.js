// constants.
const LOCALSTORAGE_LAST_SELECTED_CHANNEL = "lastselectedchannel"

// holds the socket connection.
var socket;


document.addEventListener('DOMContentLoaded', () => {
    
    // connect websockets
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    setupChannelsSelection();
    setupChannelCreationModal();
    setupMessagingForm(); // setup the messaging form on the bottom.
    
    // setupChannelCreationPopup();
    
    // hide the topbar and message input by default
    showNoContentMessage(true);
    // setTopbarAndBottomBarVisible(false);
    // setupTopbarScrollBehavior();

    socket.on('connect', () => {
        // socket is connected succesfully.
        console.log("SocketIO connected!")

        const btns_toggleSidebar = document.querySelectorAll(".btn_toggleSidebar");

        btns_toggleSidebar.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                
                const buttonLocation = btn.dataset.location;
                const sidebar = document.querySelector(".sidebar");
                $(sidebar).toggleClass("hidden-on-mobile shown-on-mobile"); // this will toggle between these two classes.

                // // buttonLocation === "topbar"
                // if (sidebar.classList.contains("hidden-on-mobile")) {
                //     sidebar.classList.remove('hidden-on-mobile')
                //     sidebar.classList.add('shown-on-mobile')

                // } else {
                //     sidebar.classList.remove('shown-on-mobile')
                //     sidebar.classList.add('hidden-on-mobile')
                // }
                return false; // prevent navigation to the href. and act as a button only :)
            })
        })
    })
    

    socket.on('channel joined', (data) => {
        console.log("joined", data)
        // setTopbarAndBottomBarVisible(true)
        // Load previous messages for this channel.
        const ul_conversations = document.querySelector("#ul_conversations")
        ul_conversations.innerHTML = ""; // clear list. then add.
        const messages = data.messages; // prep the messages.
        addMessageToConversation(messages) // add it to the list.
        showNoContentMessage(false);
    })


    socket.on('message sent', (data) => {
        const messages = []
        messages.push(data)
        addMessageToConversation(messages); // display the message on the conversation list.
    });


    socket.on('message deleted', (data) => {
        // remove the msg from the list
        console.log("deleted", data)

        const msgid = data.msgid;
        const messages = document.querySelectorAll(`#ul_conversations li`)
        
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.dataset.msgid == msgid) {
                message.remove()
                break;
            }
        }
    })

    socket.on('channel created', (data) => {
        console.log("created", data);

        const channelname = data.channelname;
        if (channelname != null) {
            // channel created succesfully.
            // append the channel to the channel list
            // <a class="channel-list-item" href="#" data-channelname="{{ channelname }}">
            //     👥 {{ channelname }}
            // </a>
            const channelsList = document.querySelector('#channels')
            
            const a = document.createElement('a');
            a.classList.add('channel-list-item');
            a.href="#";
            a.dataset.channelname = channelname;
            a.innerHTML = `${channelname}`;
            channelsList.append(a);

            // update the channel selections
            setupChannelsSelection();

        }
    })

});


//////// Setups
function setupChannelsSelection() {
    const channelsList = document.querySelector('.channels-list');
    const channelListItems = channelsList.querySelectorAll('.channel-list-item');
    channelListItems.forEach(channel => {
        channel.onclick = () => {
            // First set the state to selected.
            const currentlyActive = channelsList.querySelector('.active');
            if (currentlyActive != null) currentlyActive.classList.remove('active') // remove the highlight from the previous selected item.
            channel.classList.add('active') // highlight the newly selected item.

            // Now add your action here:
            const channelname = channel.dataset.channelname;
            console.log(`Selected channel: ${channelname}`)
            localStorage.setItem(LOCALSTORAGE_LAST_SELECTED_CHANNEL, channelname)
            joinChannel(channelname)
        }

        //  auto-select the last channel.
        const lastSelectedChannel = localStorage.getItem(LOCALSTORAGE_LAST_SELECTED_CHANNEL, null)
        if (channel.dataset.channelname == lastSelectedChannel) {
            if(!channel.classList.contains('active')) channel.click() // only if not yet selected.
        }

    })
}

function setupChannelCreationModal() {
    const btn_showModal = document.querySelector("#btn_showModal"); // the button to make the modal pop up.

    btn_showModal.onclick = () => {
        const dialogtitle = "Create";
        const dialogmessage = "Add a new public channel";

        const dialog = new FlackDialog("#flackdialog", {
            title: dialogtitle,
            message: dialogmessage,
            input: { 
                placeholder: "channel name..",
                autofocus: true
            },
            positiveButton: {
                text: "Create",
                disableOnEmptyInput: true,
                onclick: () => {
                    dialog.isLoading = true;
                    dialog.title = "Creating your channel"
                    dialog.message = null;
                    dialog.input = {disabled: true}
                    dialog.positiveButton = {disabled: true}

                    const channelname = dialog.inputValue;

                    socket.emit("create channel", {
                        "channelname": channelname
            
                    }, function(message, status) {
                        console.log("from first", message, status)
                        dialog.isLoading = false

                        if (status === 200) {
                            // channel created
                            dialog.icon = {
                                name: "fa-check",
                                style: "fas"
                            }
                            dialog.input = null;
                            dialog.title = "Created"
                            dialog.message = `<b>${channelname}</b> is now available to join`
                            dialog.negativeButton = null;
                            dialog.positiveButton = {
                                disabled: false,
                                text: "Join now",
                                onclick: () => {
                                    // hide the dialog..
                                    dialog.dismiss();
                                    // and then join the newly created channel.
                                    const newlycreatedchannel = document.querySelector(`[data-channelname="${channelname}"]`)
                                    if (newlycreatedchannel) newlycreatedchannel.click();
                                }
                            }
                        
                        } else if (status === 400) {
                            // channel already exists
                            dialog.input = {disabled: false} // reenable the input
                            dialog.message = dialogmessage
                            dialog.title = "Channel already exists!"
                            dialog.positiveButton = {disabled: false}

                            setTimeout(() => {
                                dialog.title = dialogtitle;
                            }, 1500);
                        }
                    })
                }
            },
            negativeButton: {
                text: "Cancel",
            }
            
        });
        dialog.show();
    }
}


function setupMessagingForm() {
    const input_message = document.querySelector('#input_message');
    const btn_sendMessage = document.querySelector("#btn_sendMessage");
    btn_sendMessage.setAttribute("disabled", ""); // disable the send message button by default.

    // handle sending message:
    btn_sendMessage.addEventListener("click", () => {
        // grab the text message from the input
        const text = input_message.value.trim();
        if (text.length == 0) {
            // the message contains zero-valid-characters.
            return;
        }

        // grab the user displayname
        const displayname = document.querySelector('#displayname').dataset.displayname;
        // grab the selected channel name
        const channelname = localStorage.getItem(LOCALSTORAGE_LAST_SELECTED_CHANNEL, null);
        if (channelname == null) {
            // no channel was selected.
            return;
        }

        // send the message
        socket.emit("send message", {
            'displayname': displayname,
            'channelname': channelname,
            'text': text

        }, (data) => {
            // clear the message input. and focus again.
            console.log("Message sent!", data)
            input_message.value = ""
            input_message.focus();
        })
    })

    // handle message input keydown event. enable/disable the send message button based on the value of this input:
    input_message.addEventListener("keyup", function(event) {
        const value = event.target.value.trim(); // grab the message input value.
        if (value.length === 0) { // validate
            // the input has no text...
            btn_sendMessage.setAttribute("disabled", "") // disable the send message button
        } else {
            // the input has text...
            btn_sendMessage.removeAttribute("disabled") // enable the send message button
        }

        // Allow sending message on 'Enter' key pressed.
        if (event.keyCode === 13) {
            // on enter key pressed...
            btn_sendMessage.click(); // send the message
        }
    });
}








//////// Utilities Function
/**
 * Add messages to the conversation ul.
 * @param {Array} messages the messages array you want to add.
 * @example 
 *      // create the list
 *      messages = []
 *      message = {
 *          'text': 'Hi dude!!'
 *          'displayname': 'kishannareshpal',
 *          'timestamp': 'TODO'
 *      }
 *      messages.push(message)
 *      // add it
 *      addMessageToConversation(messages)
 * 
 */
function addMessageToConversation(messagesToAdd) {
    if (!(messagesToAdd instanceof Array)) {
        // the argument is not of type array. should not continue!
        throw "Provide an Array as an argument to this function. See the function's jsdoc for usage example.";
    }

    const ul_conversations = document.querySelector('#ul_conversations');
    const user_displayname = document.querySelector('#displayname').dataset.displayname;

    messagesToAdd.forEach((message) => {
        /**
            <li>
                <div class="--me|--they">
                    <p class="user">@kishannareshpal</p>
                    <p class="text">{{ _message }}</p>
                    <p class="info">{{ time }}</p>
                </div>
            </li>
        **/
        const message_id = message.id;
        const message_text = message.text;
        const message_displayname = message.displayname;
        const message_time = new Date(message.timestamp + " UTC");
        const time = moment(message_time)

        const isSentByMe = user_displayname == message_displayname; // the message is sent by me.

        // create the message element.
        const li = document.createElement("li");
        li.dataset.msgid = message_id;
        li.classList.add("vivify", "duration-550")
        
        const bubble = document.createElement("div");
        bubble.classList.add(isSentByMe ? "--me" : "--they"); // this style position the bubble accordingly.

        if (!isSentByMe) {
            // only if this message was not sent by me:
            const p_user = document.createElement("p"); // holds the user display name.
            p_user.classList.add('user')
            p_user.innerHTML = `@${message_displayname}`;
            bubble.appendChild(p_user);
        }
        
        const p_text = document.createElement("p"); // holds the message text on the bubble.
        p_text.classList.add('text')
        p_text.innerHTML = message_text;

        const p_info = document.createElement("p"); // holds the local time the message was sent, on the bubble. and any extras.
        p_info.classList.add('info') // makes the text muted and small.

        if (isSentByMe) {
            const a_deletemessage = document.createElement("a"); // used for deleting the message you sent.
            a_deletemessage.classList.add('info', 'mr-3');
            a_deletemessage.href = '#';
            a_deletemessage.innerHTML = 'Delete';
            a_deletemessage.onclick = (e) => {
                console.log("deleting this: " + message_id)
                socket.emit("delete message", {
                    channelname: localStorage.getItem('selectedchannelname'),
                    msgid: message_id
                })
                return false;
            }
            p_info.appendChild(a_deletemessage) // add the delete button
        }
        p_info.append(`${time.format('H:mm')}`) // add the item

        bubble.appendChild(p_text); // the message text
        bubble.appendChild(p_info); // the extras (hour, and delete button if the sentissentbyme)

        li.appendChild(bubble) // add the bubble to the li.
        ul_conversations.appendChild(li) // append the message to the convo.
    })

    // auto-scroll to the most-recent message on the list.
    const last_li = $('#ul_conversations li:last-child')
    if (last_li.length != 0) {
        $('html, body').animate({
            scrollTop: (last_li.offset().top - 500)
        }, 300);
    }

}


/**
 * Sets the topbar and bottombar either visible or hidden.
 * @param {Boolean} show 
 */
function showNoContentMessage(show) {
    if (show) {
        document.querySelector('#nocontent').classList.add("d-flex")
        document.querySelector('#nocontent').removeAttribute('hidden');
        document.querySelector('#topbar').setAttribute('hidden', '');
        document.querySelector('#ul_conversations').setAttribute('hidden', '');
        document.querySelector('#bottombar').setAttribute('hidden', '');  
    } else {
        document.querySelector('#nocontent').classList.remove("d-flex")
        document.querySelector('#nocontent').setAttribute('hidden', '')
        document.querySelector('#topbar').removeAttribute('hidden');
        document.querySelector('#ul_conversations').removeAttribute('hidden');
        document.querySelector('#bottombar').removeAttribute('hidden'); 
    }
}


/**
 * Joins a new channel and shows the previously sent messages.
 * @param {String} channel the channel name.
 */
function joinChannel(channelname) {
    // Set the channel title on the topbar.
    const p_channelTitle = document.querySelector('#title')
    p_channelTitle.innerHTML = channelname;
    
    // Now join the channel through web
    socket.emit("join channel", {
        "channelname": channelname
    }, () => {
        localStorage.setItem('selectedchannelname', channelname) // save this last selected channel, so when i open this website later, it remembers :) sweeeeeet!
        // document.querySelector("#input_message").focus();
    })
    return false;
}



function setupTopbarScrollBehavior() {
    const topbar = document.querySelector("#topbar");
    window.addEventListener('scroll', function(e) {
        let scrollYposition = window.scrollY;
        if (scrollYposition > 50) {
            topbar.classList.add("scroll")
        } else {
            topbar.classList.remove("scroll")
        }
    })
}