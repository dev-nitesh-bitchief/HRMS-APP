// Function to open the form
function openForm() {
    document.getElementById("form-container").style.display = "block";
}

// Function to close the form
function closeForm() {
    document.getElementById("form-container").style.display = "none";
}
function openDeleteModal(recordid) {
    document.getElementById('recordid').value = recordid;
    document.getElementById('recordidDisplay').innerText = 'ID: ' + recordid;
    $('#deleteidModal').modal('show');
}

function UpdateForm(id, role_id, status) {
    document.getElementById('id').value = id;
    document.getElementById('Role_name').value = Role_name;
    document.getElementById('status').value = status;
    $('#updateUserModal').modal('show');
};


document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the server and populate the dropdown
    fetch('/employee/show')
        .then(response => response.json())
        .then(data => {
            const roleDropdown = document.getElementById('Employee_id');
            data.forEach(drop => {
                const option = document.createElement('option');
                option.value = drop.id;
                option.textContent = drop.employeeName;
                roleDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));



    // Fetch data from the server and populate the dropdown
    fetch('/role/showroles')
        .then(response => response.json())
        .then(data => {
            const roleDropdown = document.getElementById('roleName1');
            data.forEach(showroles => {
                const option = document.createElement('option');
                option.value = showroles.id;
                option.textContent = showroles.roleName;
                roleDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));


    // Fetch data from the server and populate the dropdown
    fetch('/role/showroles')
        .then(response => response.json())
        .then(data => {
            const roleDropdown = document.getElementById('roleName');
            data.forEach(showroles => {
                const option = document.createElement('option');
                option.value = showroles.id;
                option.textContent = showroles.roleName;
                roleDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));





    //match username is available or not
    const usernameInput = document.getElementById('usernameInput');
    const usernameStatus = document.getElementById('usernameStatus');

    usernameInput.addEventListener('input', () => {
        const username = usernameInput.value;

        fetch(`/users/checkUsername?username=${username}`)
            .then(response => response.json())
            .then(data => {
                debugger
                if (data.exists) {
                    usernameStatus.textContent = 'Username not available';
                    usernameStatus.style.color = 'red';
                    usernameStatus.style.display = "block";
                  
                } else {
                    usernameStatus.textContent = ''; // username available, clear error message
                }
            })
            .catch(error => {
                console.error('Error checking username availability:', error);
                usernameStatus.textContent = 'Error checking username availability';
                usernameStatus.style.color = 'red';
            });
    });



    //match password and confirm password 
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatchStatus = document.getElementById('passwordMatchStatus');

    confirmPasswordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password === confirmPassword) {
            passwordMatchStatus.textContent = ''; // Passwords match, clear error message
        } else {
            passwordMatchStatus.textContent = 'Passwords do not match';
            passwordMatchStatus.style.color = 'red';
            passwordMatchStatus.style.display = "block";
        }
    });

});





//function for check all field are fill or not.

function validateForm() {
    var username = document.getElementById("usernameInput").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var Employee_id = document.getElementById("Employee_id").value;

    if (username === "" || password === "" || confirmPassword === "") {
        alert("all fields are required");
        return false; // Prevent form submission
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false; // Prevent form submission
    }

    // Check if the username is available
    var usernameStatus = document.getElementById("usernameStatus").textContent;
    if (usernameStatus !== "") {
        alert("Username is not available");
        return false; // Prevent form submission
    }

    // Check if the employee_id is not selected
    var Employee_id = document.getElementById("Employee_id").value;
    if (Employee_id === "") {
        alert("select employee ");
        return false; // Prevent form submission
    }


    return true; // Allow form submission
}

