import {
  createOption,
  listUsers,
  listDepartments,
  toggleModal,
  getEnterprises,
  getUser,
  editProfile,
  getCompanyinfo,
  toastfy,
} from "./requests.js";

import {
  createUserEditModal,
  deleteUserModal,
  createViewModal,
  createDepartmentModal,
  createDepartmentEditModal,
  deleteDepartmentModal,
} from "./modal.js";

function toggleBar() {
  const bar = document.querySelector("#bars");
  const header = document.querySelector(".header__container");
  const buttons = document.querySelector(".header__container--buttons");
  return bar.addEventListener("click", (e) => {
    header.classList.toggle("height-10rem");
    buttons.classList.toggle("header__container--animation");
    buttons.classList.toggle("display__none");
  });
}

function logout() {
  const clear = () => localStorage.clear();
  const button = document.querySelector(".a__button--logout");
  return button.addEventListener("click", (e) => {
    clear();
    return window.location.replace("../../index.html");
  });
}

// USER DASHBOARD //
async function createProfile() {
  const user = await getUser();
  const perfil = document.querySelector(".user__info");
  perfil.innerHTML = "";
  perfil.insertAdjacentHTML(
    "afterbegin",
    `
    <h2>${user.username}</h2>
    <div class="user__info--infos">
        <span>Email: ${user.email} </span>
        <span>${user.professional_level}</span>
        <span>${
          user.kind_of_work === null ? "Não Existe" : user.kind_of_work
        }</span>
    </div>
    <button id="pencil" data-modal="open">
        <img src="../assets/img/pencil.svg" alt="Simbolo de lápis">
    </button>
    `
  );
  editProfileInfo();
  toggleModal();
}

function editProfileInfo() {
  const inputs = document.querySelectorAll(".modal__input--profile");
  const button = document.querySelector(".modal__button--profile");
  const change = {};
  button.addEventListener("click", async (e) => {
    inputs.forEach(({ value, name }) => {
      change[name] = value;
    });
    const edit = await editProfile(change);
    return edit;
  });
}

async function createDepartmentProfile() {
  const departmentInfos = await getCompanyinfo();
  const coworkers = await getCompanyinfo(true);
  const div = document.querySelector(".user__job");
  div.innerHTML = "";
  if (departmentInfos.error) {
    div.insertAdjacentHTML(
      "afterbegin",
      `
        <span class="user__job--unemployed">Você ainda não foi contratado</span>
    `
    );
  } else {
    div.insertAdjacentHTML(
      "afterbegin",
      `
        <h2 class="user__job--title">
            ${departmentInfos.name} - ${coworkers[0].name}
        </h2>
        <ul class="user__job--list">
        </ul>
        `
    );
    const createListItem = ({ username, professional_level }) => {
      const ul = document.querySelector(".user__job--list");
      ul.insertAdjacentHTML(
        "beforeend",
        `
            <li class="job__list--item">
                <h3>${username}</h3>
                <span>${professional_level}</span>
            </li>
        `
      );
    };
    return coworkers[0].users.forEach((element) => createListItem(element));
  }
}

// ADMIN DASHBOARD //
async function createUserCard({
  uuid,
  username,
  professional_level,
  department_uuid,
}) {
  const lista = document.querySelector(`.section__list--users`);
  const department = async () => {
    const lista = await listDepartments();
    const departamento = lista.find(
      (element) => element.uuid === department_uuid
    );
    return departamento.name;
  };
  return lista.insertAdjacentHTML(
    "beforeend",
    `
    <li class="section__list--item">
        <h3>${username}</h3>
        <p>${professional_level}</p>
        <p>${department_uuid === null ? "Desempregado" : await department()}</p>
        <div class="list__buttons">
            <button data-id="${uuid}" class="button__pencil--users">
                <img data-modal="open" data-id="${uuid}" src="../assets/img/pencil.svg" alt="pencil image">
            </button>
            <button data-id="${uuid}" class="button__trash--users">
                <img data-modal="open" data-id="${uuid}" src="../assets/img/trash.svg" alt="Trash image">
            </button>
        </div>
    </li>
    `
  );
}

function createDepartmentCard({ uuid, name, description, companies }) {
  const lista = document.querySelector(`.section__list--department`);
  lista.insertAdjacentHTML(
    "beforeend",
    `
        <li class="section__list--item">
            <h3>${name}</h3>
            <p>${description}</p>
            <p>${companies.name}</p>
            <div class="list__buttons">
            <button class="button__eye--department">
                <img data-modal="open" data-id="${uuid}" src="../assets/img/eye.svg" alt="Olho">
            </button>
            <button class="button__pencil--department">
                <img data-modal="open" data-id="${uuid}" src="../assets/img/pencil.svg" alt="pencil image">
            </button>
            <button class="button__trash--department">
                <img data-modal="open" data-id="${uuid}" src="../assets/img/trash.svg" alt="Trash image">
            </button>
            </div>
        </li>
        `
  );
}

async function renderSelectEnterprises() {
  const select = document.querySelector("#enterprises");
  const options = await getEnterprises();
  if (select.value === "") {
    options.forEach(({ uuid, name }) =>
      select.appendChild(createOption(name, uuid))
    );
  }
  select.addEventListener("change", async (e) => {
    const lista = document.querySelector(".section__list--department");
    const departamentos = await listDepartments(e.target.value);
    lista.innerHTML = "";
    departamentos.forEach((element) => createDepartmentCard(element));
    createDepartmentModal();
    createDepartmentEditModal();
    deleteDepartmentModal();
  });
}
export async function render() {
  const allUsers = document.querySelector(`.section__list--users`);
  const allDepartments = document.querySelector(`.section__list--department`);
  const users = await listUsers();
  const departments = await listDepartments();
  allDepartments.innerHTML = "";
  allUsers.innerHTML = "";
  users.forEach((element) => createUserCard(element));
  createUserEditModal();
  deleteUserModal();
  departments.forEach((element) => createDepartmentCard(element, "department"));
  createViewModal();
  createDepartmentModal();
  createDepartmentEditModal();
  deleteDepartmentModal();
}

logout();
toggleBar();

if (window.location.pathname === "/src/pages/admin.html") {
  render();
  renderSelectEnterprises();
} else {
  createProfile();
  createDepartmentProfile();
}
