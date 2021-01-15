document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', () => compose_email(null));

    // By default, load the inbox
    load_mailbox('inbox');
    setup_composeform();
    setup_actionbuttons();
});


function setup_actionbuttons() {
    const archiveBtn = document.querySelector("#show-archive-btn");
    const replyBtn = document.querySelector("#show-reply-btn");

    archiveBtn.addEventListener("click", (e) => {
        // Archive or Unarchive accordingly.
        const email_id = archiveBtn.dataset.emailId;
        const email_archived = toBoolean(archiveBtn.dataset.archived);

        archiveBtn.dataset.archived = !email_archived;
        fetch(`/emails/${email_id}`, {
            method: "PUT",
            body: JSON.stringify({ archived: !email_archived })
        
        }).then(() => {
            changeArchiveBtn(!email_archived);
            load_mailbox("inbox")
        })
    });


    replyBtn.addEventListener("click", (e) => {
        compose_email();
    });
}

function changeArchiveBtn(archived) {
    const archiveBtn = document.querySelector("#show-archive-btn");
    if (archived) {
        archiveBtn.innerHTML = "Unarchive"
        archiveBtn.classList.remove("btn-light")
        archiveBtn.classList.add("btn-dark")
    } else {
        archiveBtn.innerHTML = "Archive"
        archiveBtn.classList.remove("btn-dark")
        archiveBtn.classList.add("btn-light")
    }
}



function setup_composeform() {
    const composeForm = document.querySelector("#compose-form");
    composeForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Grab the data to send
        const recipients = document.querySelector("#compose-recipients").value.trim();
        const subject = document.querySelector("#compose-subject").value.trim();
        const body = document.querySelector("#compose-body").value.trim();

        // Send the email
        const postdata = {
            recipients: recipients,
            subject: subject,
            body: body
        }
        const url = composeForm.dataset.url;
        const options = {
            method: "POST",
            body: JSON.stringify(postdata)
        }

        fetch(url, options)
            .then(response => {
                if (response.status == 201) {
                    // Email sent!
                    load_mailbox("sent");

                } else {
                    // An error occured.
                    response.json().then(value => {
                        alert(value.error)
                    });
                }
            });
    })
}


function compose_email(data) {
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#show-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector("#compose-form").reset();

    if (data != null) {
        const recipient = data.recipient;
        const subject = data.subject;
        const body = data.body;

        // Prefill
        document.querySelector("#compose-recipients").value = recipient;
        document.querySelector("#compose-subject").value = subject;
        document.querySelector("#compose-body").value = body;

    }
}


function load_mailbox(mailbox) {
    // Show the mailbox and hide other views
    const emailsView = document.querySelector('#emails-view');
    emailsView.style.display = 'block';
    emailsView.innerHTML = ""; // clear
    document.querySelector('#compose-view').style.display = 'none'; // hide the compose view.
    document.querySelector('#show-view').style.display = 'none'; // hide the show view.

    // Show the mailbox name
    const h3_pagetitle = document.createElement("h3");
    const pagetitle = mailbox.charAt(0).toUpperCase() + mailbox.slice(1);
    h3_pagetitle.innerHTML = pagetitle
    emailsView.appendChild(h3_pagetitle)

    // Load emails for this mailbox
    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(emails => {
            const ul = document.createElement("ul")
            ul.classList.add("list-group")

            emails.forEach(email => {
                const li = crateEmailListItemElement(email, mailbox)
                ul.appendChild(li)
            });

            emailsView.appendChild(ul);
        })
}


/**
 * Load the email.
 * @param {*} email 
 */
function load_email(email_id, from_mailbox) {
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#show-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    const archiveBtn = document.querySelector("#show-archive-btn");
    const replyBtn = document.querySelector("#show-reply-btn");


    if (from_mailbox == "sent") {
        // Hide the archive btn.
        archiveBtn.style.display = 'none';
    }

    fetch(`/emails/${email_id}`)
        .then(response => response.json())
        .then(email => {
            // Present the email content
            document.querySelector("#show-from").innerText = email.sender
            document.querySelector("#show-recipients").innerText = formatRecipients(email.recipients);
            document.querySelector("#show-timestamp").innerText = `${from_mailbox == "sent" ? "Sent" : "Received"} ${formatDate(email.timestamp)}`
            document.querySelector("#show-subject").innerHTML = email.subject;
            document.querySelector("#show-body").innerHTML = marked(email.body);

            if (from_mailbox != "sent") {
                archiveBtn.style.display = '';
                // Show the archive btn.
                archiveBtn.dataset.emailId = email.id;
                archiveBtn.dataset.archived = email.archived;
                changeArchiveBtn(email.archived);
            }


            replyBtn.onclick = () => {
                compose_email({
                    recipient: email.sender,
                    subject: (!email.subject.startsWith("Re: ") ? "Re: " : "") + email.subject,
                    body: `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`
                })
            }

            // Mark this email as read
            if (!email.read) {
                fetch(`/emails/${email_id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        read: true
                    })
                })   
            }
        })
}


/**
 * Basically transform the array of recipients into a comma separated string.
 * Also replaces own email with "me"!
 * 
 * @param {Array} recipients the list of recipients
 * @returns comma separated string of elements in the array. Replaces current user's email with "me".
 * 
 * @example
 * const recipients1 = ["kishan[at]live.com", "steve[at]gmail.com"]
 * const recipients2 = ["bob[at]gmail.com", "kishan[at]live.com", "steve[at]gmail.com"]
 * formatRecipients(recipients1, ownEmail);
 * formatRecipients(recipients2, ownEmail);
 * // returns:
 * // "to: me, steve[at]gmail.com"
 * // "to: bob[at]gmail.com, me, steve[at]gmail.com"
 */
function formatRecipients(recipients) {
    const ownEmail = document.querySelector("#me").dataset.myEmail;
    let formatedRecps = "to ";
    recipients.forEach((recipientEmail, index) => {
        if (ownEmail == recipientEmail) {
            formatedRecps += "me";

        } else {
            formatedRecps += `${recipientEmail}`;
        }

        if (index < recipients.length - 1) {
            formatedRecps += ", " // separate every two elements with a comma and a space.
        }
    })
    return formatedRecps;
}


function crateEmailListItemElement(email, mailbox) {
    /**
     * <li>
     *    <col>
     *      <unread-dot-row>
     *      <email-row>
     *      <time-row>
     *    <col>
     *    <subject>
     * </li>
     * 
     */

    const li = document.createElement("li")
    li.classList.add("list-group-item", "list-group-item-action")
    li.style.cursor = "pointer";
    if (email.read) {
        li.classList.add("is-read");
    }

    const emailP = document.createElement("p");
    emailP.title = email.sender;
    emailP.classList.add("m-0");
    if (!email.read) {
        emailP.classList.add("font-weight-bold")
    } else {
        emailP.classList.add("text-muted")
    }


    if (mailbox == "sent") {
        emailP.textContent = formatRecipients(email.recipients);
    } else {
        emailP.textContent = email.sender;
    }

    const timeSmall = document.createElement("small");
    timeSmall.title = email.timestamp;
    timeSmall.classList.add("text-muted");
    timeSmall.innerText = formatDate(email.timestamp);

    const emailAndTimeRowDiv = document.createElement("div");
    emailAndTimeRowDiv.classList.add("row");
    if (!email.read) {
        const col0 = document.createElement("div");
        col0.classList.add("col", "col-auto", "pr-0");
        col0.innerHTML = `<span class="unread-dot bg-primary"></span>`
        emailAndTimeRowDiv.appendChild(col0);
    }
    const col1 = document.createElement("div");
    col1.classList.add("col");
    col1.appendChild(emailP)
    const col2 = document.createElement("div");
    col2.classList.add("col", "col-auto");
    col2.appendChild(timeSmall);
    emailAndTimeRowDiv.appendChild(col1);
    emailAndTimeRowDiv.appendChild(col2);

    const subjectDiv = document.createElement("div");
    subjectDiv.classList.add("text-truncate")
    if (!email.read) {
        subjectDiv.style.color = "#000"
    }
    subjectDiv.innerText = email.subject;

    li.appendChild(emailAndTimeRowDiv);
    li.appendChild(subjectDiv);


    // View clicked email
    li.addEventListener("click", () => {
        load_email(email.id, mailbox);
    })
    
    return li;
}


function formatDate(timestamp) {
    const months = ["January", "February", "March", "April", "May", "June", "Julu", "September", "October", "December"]
    const time = new Date(timestamp);
    const today = new Date();

    const month = months[time.getMonth()];
    const date = time.getDate();
    const year = time.getFullYear();
    const hour = (time.getHours() < 10 ? '0' : '') + time.getHours();
    const minutes = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();

    if (today.getFullYear() != year) {
        return `${month} ${date}, ${year} (${hour}h${minutes})`

    } else {
        return `${month} ${date} (${hour}h${minutes})`
    }
}



/**
 * Convert a "true" or "false" string to boolean type
 * @param {*} str "true" or "false" string to be converted to boolean type.
 * @returns {boolean} true if string is "true" otherwise false.
 */
function toBoolean(str) {
    return str == "true";
}