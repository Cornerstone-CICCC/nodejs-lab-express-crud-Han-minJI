const employeeList = document.querySelector(".employee-list");
const searchResult = document.querySelector(".search-result");
const addForm = document.getElementById("add-form");
const editForm = document.getElementById("edit-form");
const searchForm = document.getElementById("search-form");

// Get employees
const getEmployees = async () => {
  const res = await fetch("http://localhost:3501/employees", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to get employees: ${response.statusText}`);
  }

  const data = await res.json();
  console.log(data);
  return data;
};

// /employee
const readEmployee = async (id) => {
  const res = await fetch(`http://localhost:3501/employees/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to get employees: ${response.statusText}`);
  }

  const data = await res.json();
  console.log(data);
  return data;
};

const addEmployee = async (firstname, lastname, age, isMarried) => {
  const res = await fetch("http://localhost:3501/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // When doing POST/PUT/PATCH, you need to set the Content-Type
    },
    body: JSON.stringify({ firstname, lastname, age, isMarried }),
  });

  if (!res.ok) {
    throw new Error(`Failed to add employee: ${response.statusText}`);
  }

  const data = await res.json(); // Returned employee data
  console.log(data);
  build();
};

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstnameInput = addForm.querySelector("#firstname-add").value;
  const lastnameInput = addForm.querySelector("#lastname-add").value;
  const ageInput = addForm.querySelector("#age-add").value;
  const isMarried = addForm.querySelector("#is-married-add").checked;
  await addEmployee(firstnameInput, lastnameInput, ageInput, isMarried);
  addForm.reset();
});

const updateEmployee = async (id, firstname, lastname, age, isMarried) => {
  const res = await fetch(`http://localhost:3501/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // When doing POST/PUT/PATCH, you need to set the Content-Type
    },
    body: JSON.stringify({ firstname, lastname, age, isMarried }),
  });

  if (!res.ok) {
    throw new Error(`Failed to add employee: ${response.statusText}`);
  }
  const data = await res.json();
  console.log(data);
  build();
};

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const idInput = editForm.querySelector("#id-edit").value;
  console.log(idInput);
  const firstnameInput = editForm.querySelector("#firstname-edit").value;
  const lastnameInput = editForm.querySelector("#lastname-edit").value;
  const ageInput = editForm.querySelector("#age-edit").value;
  const isMarried = editForm.querySelector("#is-married-edit").checked;
  await updateEmployee(
    idInput,
    firstnameInput,
    lastnameInput,
    ageInput,
    isMarried,
  );
  editForm.reset();
});

const deleteEmployee = async (id) => {
  const res = await fetch(`http://localhost:3501/employees/${id}`, {
    method: "DELETE",
  });
  const data = await res.text();
  console.log(data);
  build();
};

const searchEmployee = async (firstname) => {
  const res = await fetch(
    `http://localhost:3501/employees/search?firstname=${firstname}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to add employee: ${response.statusText}`);
  }

  const data = await res.json();
  console.log(data);
  return data;
};

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstnameInput = searchForm.querySelector("#firstname-search").value;

  const results = await searchEmployee(firstnameInput);
  searchResult.innerHTML = "";
  results.forEach((result) => {
    const infoBox = document.createElement("div");
    infoBox.className = "search-container";
    infoBox.innerHTML = `
        <p>Firstname: ${result.firstname}</p>
        <p>Lastname: ${result.lastname}</p>
        <p>Age: ${result.age}<p>
        <p>Married: ${result.isMarried ? "Yes" : "No"}</p>
      `;
    searchResult.appendChild(infoBox);
  });
  searchForm.reset();
});

const build = async () => {
  employeeList.innerHTML = "";
  const employees = await getEmployees();

  employees.forEach((employee) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = employee.firstname + " " + employee.lastname;

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "View";
    viewBtn.addEventListener("click", async () => {
      searchResult.innerHTML = "";
      const currentEmployee = await readEmployee(employee.id);
      console.log(currentEmployee);
      const infoBox = document.createElement("div");
      infoBox.className = "search-container";
      infoBox.innerHTML = `
        <p>Firstname: ${currentEmployee.firstname}</p>
        <p>Lastname: ${currentEmployee.lastname}</p>
        <p>Age: ${currentEmployee.age}<p>
        <p>Married: ${currentEmployee.isMarried ? "Yes" : "No"}</p>
      `;
      searchResult.appendChild(infoBox);
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", (e) => {
      editForm.querySelector("#id-edit").value = employee.id;
      editForm.querySelector("#firstname-edit").value = employee.firstname;
      editForm.querySelector("#lastname-edit").value = employee.lastname;
      editForm.querySelector("#age-edit").value = employee.age;
      editForm.querySelector("#is-married-edit").checked = employee.isMarried;
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteEmployee(employee.id));

    li.appendChild(span);
    li.append(viewBtn, editBtn, deleteBtn);
    employeeList.append(li);
  });
};

build();
