const url = "http://localhost:6278";
const headers = {
  "Content-Type": "application/json",
};
// PUBLIC REQUESTS
export async function getToken(object = {}) {
  const token = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(object),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  localStorage.setItem("@KenzieEmpresas:token", token.token);
  if (token.token) {
    return token.token;
  } else {
    return token;
  }
}

export async function register(body) {
  const register = await fetch(`${url}/auth/register`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return register;
}
export async function authenticateUser(token) {
  const authentication = await fetch(`${url}/auth/validate_user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return authentication.is_admin;
}
export async function getEnterprises(sector = "") {
  const enterprises = await fetch(`${url}/companies/${sector}`, {
    method: "GET",
    headers: headers,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return enterprises;
}

export async function getSectors() {
  const sectors = await fetch(`${url}/sectors`, {
    method: "GET",
    headers: headers,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return sectors;
}
export function toggleBar() {
  const bar = document.querySelector("#bars");
  const header = document.querySelector(".header__container");
  const buttons = document.querySelector(".header__container--buttons");
  return bar.addEventListener("click", (e) => {
    if(buttons.classList.contains('display__flex')) {
      buttons.classList.remove('display__flex')
    }else {
      buttons.classList.add('display__flex')
    }
    header.classList.toggle("height-10rem");
    buttons.classList.toggle("header__container--animation");
  });
}
export function toggleModal() {
  const buttons = document.querySelectorAll("[data-modal]");
  const close = document.querySelectorAll("[data-modal=close]");
  const dialog = document.querySelector(".modal__wrapper");
  const modal = document.querySelector(".modal__container");
  close.forEach((element) =>
    element.addEventListener("click", (e) => {
      if (
        modal.classList.contains("modal__container--view") ||
        modal.classList.contains("modal__container--delete") ||
        modal.classList.contains("modal__container--edit")
      ) {
        modal.classList.remove("modal__container--view");
        modal.classList.remove("modal__container--delete");
        modal.classList.remove("modal__container--edit");
      }
    })
  );
  buttons.forEach((element) =>
    element.addEventListener("click", (e) => {
      if (dialog.classList.contains("display__none")) {
        dialog.classList.remove("display__none");
      } else {
        dialog.classList.add("display__none");
      }
    })
  );
}
export const createOption = (option, uuid) => {
  const newOption = document.createElement("option");
  if (uuid) {
    newOption.value = uuid;
  } else {
    newOption.value = option;
  }
  newOption.innerText = option;
  return newOption;
};

export function toastfy(message, color = false) {
  const body = document.querySelector("body");
  body.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="toast__container">
    <p>
    ${message}
    </p>
  </div>
  `
  );
  const container = document.querySelector(".toast__container");
  if (!color) {
    container.classList.add("toast-error");
  } else {
    container.classList.add("toast-success");
  }
  setTimeout(() => {
    container.classList.add("toast__remove");
  }, 3000);
  setTimeout(() => {
    container.removeAttribute("class");
    container.innerHTML = "";
    container.classList.add("display__none");
    container.classList.add("toast__container");
  }, 3990);
}
// ADMIN REQUESTS
const token = localStorage.getItem("@KenzieEmpresas:token");
const authHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export async function editProfile(change) {
  const edit = await fetch(`${url}/users`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify(change),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return edit;
}
export async function getCompanyinfo(bool = false) {
  const company = await fetch(
    `${url}/users/departments/${bool === false ? "" : "coworkers"}`,
    {
      method: "GET",
      headers: authHeaders,
    }
  )
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
  return company;
}

export async function getUser() {
  const user = await fetch(`${url}/users/profile`, {
    method: "GET",
    headers: authHeaders,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return user;
}
export async function listUsers() {
  const users = await fetch(`${url}/users`, {
    method: "GET",
    headers: authHeaders,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return users;
}
export async function listDepartments(id = "") {
  const departments = await fetch(`${url}/departments/${id}`, {
    method: "GET",
    headers: authHeaders,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return departments;
}

export async function updateUser(id, userBody) {
  const update = await fetch(`${url}/admin/update_user/${id}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify(userBody),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return update;
}

export async function deleteUser(id) {
  const userDeleted = await fetch(`${url}/admin/delete_user/${id}`, {
    method: "DELETE",
    headers: authHeaders,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return userDeleted;
}

export async function createDepartment(body) {
  const newDepartment = await fetch(`${url}/departments`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return newDepartment;
}

export async function editDepartment(id, newinfo) {
  const newDepartment = await fetch(`${url}/departments/${id}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify(newinfo),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return newDepartment;
}

export async function deleteDepartment(id) {
  const userDeleted = await fetch(`${url}/departments/${id}`, {
    method: "DELETE",
    headers: authHeaders,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return userDeleted;
}

export async function getOutOfWork() {
  const workers = await fetch(`${url}/admin/out_of_work`, {
    method: "GET",
    headers: authHeaders,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return workers;
}

export async function hireWorker(object) {
  const worker = await fetch(`${url}/departments/hire`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify(object),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return worker;
}
export async function dismissWorker(id) {
  const worker = await fetch(`${url}/departments/dismiss/${id}`, {
    method: "PATCH",
    headers: authHeaders,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return worker;
}
