var timeout;

document.addEventListener('DOMContentLoaded', () => {
    // Page loaded
    const displayname_input = document.querySelector("#displayname");
    const password_input = document.querySelector("#password");
    
    displayname_input.addEventListener("input", (event) => {
        clearTimeout(timeout);

        const value = event.target.value;
        const valuelength = value.trim().length;
        if (valuelength < 4 || valuelength > 18) {
            // reset input
            displayname_input.parentElement.classList.remove('is-success', 'is-invalid');
            return;
        }

        timeout = setTimeout(function () {
            // perform validation
            $.ajax(`/api/user/${value}`, {
                complete: (response, responseText) => {
                    const status = response.status;
                    if (status === 200) {
                        // display name is available to use
                        displayname_input.parentElement.classList.add('is-success');
                        displayname_input.parentElement.classList.remove('is-invalid');
                    } else {
                        // display name is already taken
                        displayname_input.parentElement.classList.remove('is-success');
                        displayname_input.parentElement.classList.add('is-invalid');
                    }

                }
            })

        }, 750);
    })
})