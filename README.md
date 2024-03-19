<!-- 
query for inert salary on backend table name : salaryDetails -->

<!-- 
SELECT SD.id,CONCAT(E.firstname,' ',E.lastname) AS Employee_Name,ST.salary_type AS Salary_Type,SD.amount AS Amount FROM SalaryDetails SD JOIN Employee E ON SD.Employee_id = E.id JOIN SalaryType ST ON SD.SalaryType_id = ST.id; -->






<!-- SELECT e.id AS Employee_id, e.firstname AS Employee_name, s.id AS Salary_id, st.salary_type AS SalaryType, sd.salarytypeAmount AS SalaryAmount

    -> FROM Employee e
    -> JOIN Salary s ON e.id = s.Employee_id
    -> JOIN SalaryDetails sd ON s.id = sd.salary_id
    -> JOIN SalaryType st ON sd.salarytype_id = st.id
    -> ORDER BY e.id, st.id; -->




<!-- update SalaryDetails set salarytypeAmount = "15000" where salary_id = 130 && salarytype_id = 1; -->


<!-- 
</body>

</html>


<!DOCTYPE html>
<html lang="en">

<head>

  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Star Admin2 </title>
  <!-- plugins:css -->
  <link rel="stylesheet" href="../vendors/feather/feather.css">
  <link rel="stylesheet" href="../vendors/mdi/css/materialdesignicons.min.css">
  <link rel="stylesheet" href="../vendors/ti-icons/css/themify-icons.css">
  <link rel="stylesheet" href="../vendors/typicons/typicons.css">
  <link rel="stylesheet" href="../vendors/simple-line-icons/css/simple-line-icons.css">
  <link rel="stylesheet" href="../vendors/css/vendor.bundle.base.css">
  <!-- endinject -->
  <!-- Plugin css for this page -->
  <link rel="stylesheet" href="../vendors/select2/select2.min.css">
  <link rel="stylesheet" href="../vendors/select2-bootstrap-theme/select2-bootstrap.min.css">
  <!-- End plugin css for this page -->
  <!-- inject:css -->
  <link rel="stylesheet" href="../css/vertical-layout-light/style.css">
  <!-- endinject -->
  <link rel="shortcut icon" href="../images/favicon.png">
  
  <style>
    /* Styling the anchor tag to look like a button */
    .btn-dark {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-align: center;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    /* Styling the anchor tag when hovered */
    .btn-dark:hover {
      background-color: #45a049;
    }

    /* Styling the actions column */
    .actions {
      text-align: right;
    }

    select {
      width: 100%;
      padding: 10px;
      font-size: 14px;
      margin-bottom: 15px;
    }


    /* Styling the anchor tag to look like a button */
    .new_data {
      display: inline-block;
      padding: 10px 20px;
      /* Adjust padding as needed */
      background-color: #4CAF50;
      /* Button background color */
      color: white;
      /* Button text color */
      text-align: center;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      /* Rounded corners */
      cursor: pointer;
    }

    /* Styling the anchor tag when hovered */
    .new_data:hover {
      background-color: #45a049;
      /* Darker green */
    }

    /* CSS styles for the close button */
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }


    #form-container {
      display: none;
      /* Hide the form by default */


    }
  </style>


</head>

<body>
  <div class="main-panel">
    <div class="content-wrapper">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Salary</h4>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addRoleModal">
                      Add New salary <span class="mdi mdi-currency-inr"></span></button>
                    <tr>
                      <th>Id:</th>
                      <th>Employee Name</th>
                      <th>Salary Amount</th>
                      <th>Salary Cycle</th>
                      <th class="actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {{#each salary}}
                    <tr>
                      <td>{{this.id}}</td>
                      <td>{{this.employee_name}}</td>
                      <td>{{this.netSalary}}</td>
                      <td>{{this.salaryCycle}}</td>
                      <td class="actions">
                        <div class="dropdown">
                          <button class="btn btn-danger btn-sm dropdown-toggle" type="button"
                            id="dropdownMenuSizeButton3" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            Action
                          </button>
                          <div class="dropdown-menu" aria-labelledby="dropdownMenuSizeButton3">
                            <a class="dropdown-item"
                              onclick="UpdateForm('{{this.id}}','{{this.salaryAmount}}','{{this.salaryCycle}}')"
                              data-toggle="modal" data-target="#updateUserModal" id="UpdateSalaryData">edit</a>
                            <a class="dropdown-item" data-toggle="modal" data-target="#deleteidModal"
                              onclick="openDeleteModal('{{this.id}}')">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {{/each}}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- add Modal -->
  <div class="modal fade" id="addRoleModal" tabindex="-1" role="dialog" aria-labelledby="addRoleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addRoleModalLabel">salary info</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="forms-sample" action="/Salary/addsalary" method="post">
            <div class="form-group">
              <label for="Employee_id">Employee Name</label>
              <select class="form-select" id="Employee_id" name="Employee_id" required>
                <option value="">Select Employee </option>
              </select>
            </div>
            <div class="form-group" id="additionalInputs">
              <div class="row" >
                <!-- Existing fields for salary type and amount -->
                <div class="col-md-6">
                  <label for="salary_type">Select Type:</label>
                  {{!-- <select class="form-select" id="salary_type" name="SalaryType_id">
                    <option value="">Select </option>
                  </select> --}}
                </div>
                <div class="col-md-6">
                  <label for="salaryAmount">salaryAmount</label>
                  {{!-- <input type="text" class="form-select" id="salaryAmount" name="salaryAmount"
                    placeholder="salaryAmount"> --}}
                </div>
              </div>
              <div class="row" id="newFieldsContainer">
                <!-- Existing fields for salary type and amount -->
                <div class="col-md-6">
                  {{!-- <label for="salary_type">Select Type:</label> --}}
                  <select class="form-control" id="salary_type" name="SalaryType[]">
                    <option value="">Select </option>
                  </select>
                </div>
                <div class="col-md-6">
                  {{!-- <label for="salaryAmount">salaryAmount</label> --}}
                 <input type="text" class="form-control salary-amount" name="salarytypeAmount[]" placeholder="Salary Amount" required>
                </div>
              </div>
            </div>
            <!-- Container for new fields -->
            {{!-- <div id="newFieldsContainer"></div> --}}
            <div class="row">
              <div class="col-md-6">
                <button type="button" class="btn btn-success" id="addNewSalaryBtn">Add</button>
              </div>
              <div class="col-md-6">
                <label for="netSalary">Total Amount</label>
                <input type="text" class="form-control" id="total-salary" name="netSalary" placeholder="Total salary"  readonly>
              </div>
            </div>


            <div class="form-group">
              <label for="salaryCycle">salaryCycle</label>
              <input type="text" class="form-control" id="salaryCycle2" name="salaryCycle" placeholder="salaryCycle">
            </div>
            <button type="submit" class="btn btn-primary me-2" onclick="showToast(successfully added)">Submit</button>
        </div>
      </div>
    </div>
  </div>
  </div>

  {{!-- --}}

  <!-- Delete Modal -->
  <div class="modal fade" id="deleteidModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">Delete Record</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form id="deleteForm" action="/salary/deletesalary" method="post">
            <div class="form-group">
              <label for="id">Are you sure:</label>
              <input type="hidden" id="recordid" name="id" value="{{this.id}}">
              <p id="recordidDisplay"></p>
            </div>
            <button type="submit" class="btn btn-danger">Delete</button>
          </form>
        </div>
      </div>
    </div>
  </div>




  <!-- Update Modal -->
  <div class="modal fade" id="updateUserModal" tabindex="-1" role="dialog" aria-labelledby="updateUserModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="updateUserModalLabel">Update salary</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="forms-sample" action="/Salary/updatesalary" method="post">
            <div class="form-group">
              <label for="salary_id">Salary ID</label>
              <input class="form-control" id="salary_id" name="salary_id" readonly>
            </div>
            <div class="form-group" id="additionalInputs">
              <div class="row" >
                <!-- Existing fields for salary type and amount -->
                <div class="col-md-6">
                  <label for="salary_type">Select Type:</label>
                  {{!-- <select class="form-select" id="salary_type" name="SalaryType_id">
                    <option value="">Select </option>
                  </select> --}}
                </div>
                <div class="col-md-6">
                  <label for="salaryAmount">salaryAmount</label>
                  {{!-- <input type="text" class="form-select" id="salaryAmount" name="salaryAmount"
                    placeholder="salaryAmount"> --}}
                </div>
              </div>
              <div class="row" id="newFieldsContainer">
                <!-- Existing fields for salary type and amount -->
                <div class="col-md-6">
                  {{!-- <label for="salary_type">Select Type:</label> --}}
                  <select class="form-control" id="salary_type" name="SalaryType[]">
                    <option value="">Select </option>
                  </select>
                </div>
                <div class="col-md-6">
                  {{!-- <label for="salaryAmount">salaryAmount</label> --}}
                 <input type="text" class="form-control salary-amount" name="salarytypeAmount[]" placeholder="Salary Amount" required>
                </div>
              </div>
            </div>
            <!-- Container for new fields -->
            {{!-- <div id="newFieldsContainer"></div> --}}
            <div class="row">
              <div class="col-md-6">
                <button type="button" class="btn btn-success" id="addNewSalaryBtn">Add</button>
              </div>
              <div class="col-md-6">
                <label for="netSalary">Total Amount</label>
                <input type="text" class="form-control" id="total-salary" name="netSalary" placeholder="Total salary"  readonly>
              </div>
            </div>


            <div class="form-group">
              <label for="salaryCycle">salaryCycle</label>
              <input type="text" class="form-control" id="salaryCycle2" name="salaryCycle" placeholder="salaryCycle">
            </div>
            <button type="submit" class="btn btn-primary me-2" onclick="showToast(successfully added)">Submit</button>
        </div>
      </div>
    </div>
  </div>




  <script>
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


    document.addEventListener('DOMContentLoaded', function () {
      // Fetch data from the server and populate the dropdown
      fetch('/salarytype/allsalarytype')
        .then(response => response.json())
        .then(data => {
          const roleDropdown = document.getElementById('salary_type');
          data.forEach(Type => {
            const option = document.createElement('option');
            option.value = Type.id;
            option.textContent = Type.salary_type;
            roleDropdown.appendChild(option);
          });
        })
        .catch(error => console.error('Error fetching data:', error));
    });

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


    function UpdateForm(id, salaryAmount, salaryCycle) {
      document.getElementById('id').value = id;
      document.getElementById('salaryAmount').value = salaryAmount;
      document.getElementById('salaryCycle').value = salaryCycle;
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
    });



  </script>
 

  <script>
    // Function to add new fields for salary type and amount
    function addNewSalary() {
      const additionalInputs = document.getElementById('additionalInputs');
      const newFieldsContainer = document.getElementById('newFieldsContainer');
      const clonedFields = newFieldsContainer.cloneNode(true); // Clone existing fields
      additionalInputs.appendChild(clonedFields); // Append cloned fields to the container
    }

    // Add click event listener to the "Add New Salary" button
    document.getElementById('addNewSalaryBtn').addEventListener('click', addNewSalary);

 // Function to add new fields for salary type and amount
function addNewSalary() {
    const additionalInputs = document.getElementById('additionalInputs');
    const newFieldsContainer = document.getElementById('newFieldsContainer');
    const clonedFields = newFieldsContainer.cloneNode(true); // Clone existing fields
    additionalInputs.appendChild(clonedFields); // Append cloned fields to the container
    
    // Attach event listeners to the newly added input fields
    const salaryAmountInputs = clonedFields.querySelectorAll('.salary-amount');
    salaryAmountInputs.forEach(input => {
      input.addEventListener('input', calculateTotalSalary);
    });
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

  // Attach event listener to each salaryAmount input for initial rows
  document.addEventListener('DOMContentLoaded', function () {
    displayMessage('salary','3000')
    const salaryAmountInputs = document.querySelectorAll('.salary-amount');
    salaryAmountInputs.forEach(input => {
      input.addEventListener('input', calculateTotalSalary);
    });
  });

  </script>
<script>
    var myButton = document.getElementById('UpdateSalaryData');

    function UpdateForm(salary_id) {

   

      fetch(`/salary/salarytypewithamount/${salary_id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
        
          var idInput = document.getElementById('salary_id');
          var salarytype_idinput = document.getElementById('salarytype_id');
          var salarytypeAmountinput = document.getElementById('salarytypeAmount');

        
          

          
           idInput.value = data.salary_id;
          salarytype_idinput.value = data.salarytype_idinput;
          salarytypeAmountinput.value = data.salarytypeAmountinput;



          const checkboxContainer = document.getElementById('checkboxContainer');

          const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]');

      
          checkboxes.forEach(function (checkbox) {

           
            if (permissionToCheck.includes(checkbox.value)) {
           
              checkbox.checked = true;
            }
          });
          console.log('data :', data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  </script>

   {{!--
  <script src="../vendors/js/vendor.bundle.base.js"></script> --}}

  <script src="../vendors/typeahead.js/typeahead.bundle.min.js"></script>
  <script src="../vendors/select2/select2.min.js"></script>


  <!-- Custom js for this page-->
  <script src="../js/file-upload.js"></script>
  <script src="../js/typeahead.js"></script>
  <script src="../js/select2.js"></script>
  <!-- End custom js for this page-->


</body>

</html> -->