// Fetch data from the server and populate the salary type dropdown
document.addEventListener('DOMContentLoaded', function () {
  var salaryTypes = [];
  // Fetch employee data for another dropdown

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
  fetch('/employee/show')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      employeeData = data;
      const employeeDropdown = document.getElementById('Employee-id');

      // Function to filter options based on search input
      function filterOptions(searchInput) {
        const filteredData = data.filter(employee => employee.employeeName.toLowerCase().includes(searchInput.toLowerCase()));
        employeeDropdown.innerHTML = ''; // Clear existing options
        filteredData.forEach(employee => {
          const option = document.createElement('option');
          option.value = employee.id;
          option.text = employee.employeeName;
          employeeDropdown.appendChild(option);
        });
      }

      // Populate initial options
      data.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.text = employee.employeeName;
        employeeDropdown.appendChild(option);
      });

      // Add an event listener to the dropdown for validation and search
      employeeDropdown.addEventListener('input', function () {
        const searchInput = this.value;
        filterOptions(searchInput);
      });
    })
    .catch(error => console.error('Error fetching data:', error));


  fetch('/salarytype/allsalarytype')
    .then(response => response.json())
    .then(data => {

      const salarytypeDropdown = document.querySelectorAll('#salary_type');

      salarytypeDropdown.forEach(dropdown => {

        data.forEach(salaryType => {
          const option = document.createElement('option');
          option.value = salaryType.id;
          option.textContent = salaryType.salary_type;
          dropdown.appendChild(option);
        });
      });
    })
    .catch(error => console.error('Error fetching data:', error));

  const rows = document.getElementById("updateInputs").querySelectorAll("#additionalUpdateInputs");
  console.log(rows.length);
});

// Function to open delete modal
function openDeleteModal(recordid) {
  document.getElementById('recordid').value = recordid;
  document.getElementById('recordidDisplay').innerText = ' ID: ' + recordid;
  $('#deleteidModal').modal('show');
}

// Function to open the form
function openForm() {
  document.getElementById("form-container").style.display = "block";
}

// Function to close the form
function closeForm() {
  document.getElementById("form-container").style.display = "none";
}

// Function to update form fields with salary data
function UpdateForm(id, salaryAmount, salaryCycle) {
  document.getElementById('id').value = id;
  document.getElementById('salaryAmount').value = salaryAmount;
  document.getElementById('salaryCycle').value = salaryCycle;
  $('#updateUserModal').modal('show');
};


// Function to add new salary fields
function addNewSalary() {
  const additionalInputs = document.getElementById('additionalInputs');
  const newFieldsContainer = document.getElementById('newFieldsContainer');
  const clonedFields = newFieldsContainer.cloneNode(true); // Clone existing fields
  // Add a class to the cloned element
  clonedFields.classList.add('clone');
  additionalInputs.appendChild(clonedFields); // Append cloned fields to the container

  // Attach event listeners to the newly added input fields
  const salaryAmountInputs = clonedFields.querySelectorAll('.salary-amount');
  salaryAmountInputs.forEach(input => {
    input.addEventListener('input', calculateTotalSalary);
  });
}
// Function to add new salary fields
function updateNewSalary() {
  const additionalInputs = document.getElementById('updateInputs');
  const newFieldsContainer = document.getElementById('additionalUpdateInputs');
  const clonedFields = newFieldsContainer.cloneNode(true); // Clone existing fields
  // Add a class to the cloned element
  clonedFields.classList.add('clone');

  // Reset values of all input elements in the cloned node
  clonedFields.querySelectorAll('input').forEach(input => {
    input.value = '';
  });

  // Reset values of all select elements in the cloned node
  clonedFields.querySelectorAll('select').forEach(select => {
    select.selectedIndex = -1; // Reset selection to default (no option selected)
  });

  // Reset values of all textarea elements in the cloned node
  clonedFields.querySelectorAll('textarea').forEach(textarea => {
    textarea.value = '';
  });

  additionalInputs.appendChild(clonedFields); // Append cloned fields to the container


  // // Attach event listeners to the newly added input fields
  // const salaryAmountInputs = clonedFields.querySelectorAll('.salary-amount');
  // salaryAmountInputs.forEach(input => {
  //   input.addEventListener('input', calculateTotalSalary);
  // });
}

// Function to calculate total salary
function calculateTotalSalary() {
  const salaryAmountInputs = document.querySelectorAll('.salary-amount');
  let totalSalary = 0;
  salaryAmountInputs.forEach(input => {
    const amount = parseFloat(input.value) || 0; // Convert input value to a number, default to 0 if NaN
    totalSalary += amount;
  });
  document.getElementById('total-salary').value = totalSalary.toFixed(2); // Update the total salary field
}

// Attach click event listener to the "Add New Salary" button
document.getElementById('addNewSalaryBtn').addEventListener('click', addNewSalary);
document.getElementById('updateNewSalaryBtn').addEventListener('click', updateNewSalary);



// Attach event listener to each salaryAmount input for initial rows
document.addEventListener('DOMContentLoaded', function () {
  const salaryAmountInputs = document.querySelectorAll('.salary-amount');
  salaryAmountInputs.forEach(input => {
    input.addEventListener('input', calculateTotalSalary);
  });
});
var myButton = document.getElementById('UpdateSalaryData');

function UpdateForm(salary_id) {
  fetch(`/salary/salarytypewithamount/${salary_id}`)
    .then(response => response.json())
    .then(data => {
      console.log("data", data)
      const arrayValues = data.result

      if (arrayValues.length > 1) {
        // Check if there is a clone inside the container
        debugger
        const clonedElement = document.getElementById('updateInputs').querySelectorAll(".clone");
        //If a clone exists, remove it
        if (clonedElement.length > 0) {
          clonedElement.forEach(item => {
            item.remove();
          })
        }
        for (var i = 0; i < arrayValues.length; i++) {
debugger
          if (i === 0) {
            $("#additionalUpdateInputs").find("select#salary_type").val(arrayValues[i].salarytype_id);
            $('#salary-amount').val(arrayValues[i].salarytypeAmount);
          } else {
            var clone = $('#additionalUpdateInputs').clone();
            clone.find('select').val(arrayValues[i].salarytype_id);
            clone.find('input').val(arrayValues[i].salarytypeAmount);
            // Add a class to the cloned element
            clone.addClass('clone'); // Use addClass jQuery method
            clone.appendTo('#updateInputs');

          }

        }
      } else if (arrayValues.length === 1) {
        $('#salary_type').val(arrayValues[0]);
      }

    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
}



// Function to be called when the "X" button is clicked
function deleteRow(button) {
  debugger
  const rows = document.getElementById("updateInputs").querySelectorAll(".clone");
  console.log(rows.length);
  if (rows.length > 0 && button.parentNode.parentNode.parentNode.classList.contains('clone')) {
    // Find the parent row element and remove it
    button.parentNode.parentNode.parentNode.remove();
  }
}




