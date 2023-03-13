import {
  createOption,
  listUsers,
  listDepartments,
  updateUser,
  toggleModal,
  deleteUser,
  getEnterprises,
  getUser,
  editProfile,
  getCompanyinfo,
  editDepartment,
  deleteDepartment,
  createDepartment,
  getOutOfWork,
  hireWorker,
  dismissWorker
} from "./requests.js";

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
function createUserEditModal() {
  const modal = document.querySelector(".modal__container");
  const buttons = document.querySelectorAll(".button__pencil--users");
  buttons.forEach((element) =>
    element.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      modal.innerHTML = "";
      modal.insertAdjacentHTML(
        "beforeend",
        `
        <h2>Editar Usuário</h2>
        <button class="modal__button--X" data-modal="close">
                <i class="fa-sharp fa-solid fa-x"></i>
            </button>
        <form class="modal__form--edit">
        <select class="modal__edit--select" name="kind_of_work" id="modality">
        <option value="">Selecionar modalidade de trabalho</option>
        <option value="home office">Home office</option>
            <option value="presencial">Presencial</option>
            <option value="híbrido">Híbrido</option>
            </select>
        <select class="modal__edit--select" name="professional_level" id="professional">
            <option value="">Selecionar nível profissional</option>
            <option value="estágio">Estágio</option>
            <option value="júnior">Junior</option>
            <option value="pleno">Pleno</option>
            <option value="sênior">Sênior</option>
            </select>
            <button type="submit" class="modal__button--edit" data-id="${id}">Editar Perfil</button>
            </form>
            `
      );
      editUserInfo();
      toggleModal();
    })
  );
}

function editUserInfo() {
  const button = document.querySelector(".modal__button--edit");
  const selects = document.querySelectorAll(".modal__edit--select");
  const changedUser = {};
  return button.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    selects.forEach(({ value, name }) => {
      if (value !== "") {
        changedUser[name] = value;
      }
    });
    const newUser = await updateUser(id, changedUser);
    return newUser;
  });
}

function deleteUserModal() {
  const modal = document.querySelector(".modal__container");
  const buttons = document.querySelectorAll(".button__trash--users");
  buttons.forEach((element) =>
    element.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const users = await listUsers();
      const user = users.find((element) => element.uuid === id).username;
      modal.classList.add("modal__container--delete");
      modal.innerHTML = "";
      modal.insertAdjacentHTML(
        "afterbegin",
        `
        <h2>Realmente deseja remover o usuário ${user}?</h2>
        <button class="modal__button--X" data-modal="close">
            <i class="fa-sharp fa-solid fa-x"></i>
        </button>
        <button data-modal="close" data-id="${id}" class="modal__delete">
            Deletar
        </button>
        `
      );
      deleteSelectedUser();
      toggleModal();
    })
  );
}
function deleteSelectedUser() {
  const button = document.querySelector(".modal__delete");
  const modal = document.querySelector(".modal__container");
  button.addEventListener("click", async (e) => {
    const deleted = await deleteUser(e.target.dataset.id);
    render();
    return deleted;
  });
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

function createDepartmentModal() {
  const button = document.querySelector(".section__button--create");
  button.addEventListener("click", async (e) => {
    const modal = document.querySelector(".modal__container");
    modal.innerHTML = "";
    modal.insertAdjacentHTML(
      "beforeend",
      `
    <h2>Criar departamento</h2>
    <button class="modal__button--X" data-modal="close">
        <i class="fa-sharp fa-solid fa-x"></i></button>
    <form class="form__container--create">
        <input type="text" name="name" class="form__create--input" placeholder="Digite o nome da Empresas" >
        <input type="text" name="description" class="form__create--input" placeholder="Descrição" >
        <select name="company_uuid" id="create--select" class="form__create--input">
            <option value="">Selecionar empresas</option>
        </select>
        <button class="form__department--button">
            Criar departamento
        </button>
    </form>
    `
    );
    const empresas = await getEnterprises();
    empresas.forEach(({ name, uuid }) => {
      const select = document.querySelector("#create--select");
      const option = createOption(name, uuid);
      select.appendChild(option);
    });
    createNewDepartment();
    toggleModal();
  });
}

function renderViewModal() {
  const buttons = document.querySelectorAll('.button__eye--department');
  buttons.forEach(element => element.addEventListener('click', create))
}

function createViewModal () {
  const buttons = document.querySelectorAll('.button__eye--department');
  buttons.forEach(element => element.addEventListener('click', async (e) => {
    const allDepartments = await listDepartments();
    const {uuid, name, description, companies} = allDepartments.find(element => element.uuid === e.target.dataset.id);
    const modal = document.querySelector('.modal__container');
    modal.innerHTML = "";
    modal.classList.add('modal__container--view')
    modal.insertAdjacentHTML('beforeend',
    `
    <h2>${name}</h2>
    <button class="modal__button--X" data-modal="close">
        <i class="fa-sharp fa-solid fa-x"></i>
    </button>
    <section class="modal__section">
    <div class="modal__view--info">
    <p>${description}</p>
    <span>${companies.name}</span>
    </div>
    <div class="modal__view--info">
    <select name="user_uuid" id="user_uuid">
    <option value="">Selecionar usuário</option>
    </select>
    <button class="modal__view--button" id="hire" data-id="${uuid}" >Contratar</button>
    </div>
    </section>
    <ul class="modal__workers--list" data-id="${uuid}" data-company="${companies.uuid}">
    </ul>
    `);
    toggleModal()
    await createSelectOutWork();
    await createDepartmentWorkers();
    hireWorkerButton();
  }))
}
const createSelectOutWork = async () => {
  const select = document.querySelector('#user_uuid');
  select.innerHTML = "";
  const options = await getOutOfWork();
  select.appendChild(createOption("Selecionar Usuário", ""))
  options.forEach(({username, uuid}) => select.append(createOption(username, uuid)))
}
async function createDepartmentWorkers() {
  const users = await listUsers();
  const list = document.querySelector('.modal__workers--list');
  const workers = users.filter(element => element.department_uuid === list.dataset.id);
  list.innerHTML = "";
  const allCompanies = await getEnterprises();
  const companyName = allCompanies.find(element => element.uuid === list.dataset.company).name
  workers.forEach(({uuid, username, professional_level}) => {
    list.insertAdjacentHTML('beforeend', `
    <li class="workers__list--item">
    <h3>${username}</h3>
    <p>${professional_level}</p>
    <p>${companyName}</p>
    <button class="workers__button--dismiss" id="dismiss" data-id="${uuid}">Desligar</button>
    </li>
    `)
  });
  dismissWorkerButton();
}

function hireWorkerButton() {
  const select = document.querySelector("#user_uuid");
  const button = document.querySelector('#hire');
  return button.addEventListener("click", async (e) => {
    const ids = {user_uuid: select.value, department_uuid: e.target.dataset.id}
    const newWorker = await hireWorker(ids);
    createSelectOutWork();
    createDepartmentWorkers()
    return newWorker
  })
}

function dismissWorkerButton() {
  const buttons = document.querySelectorAll('.workers__button--dismiss');
  buttons.forEach(element => element.addEventListener('click', async (e) => {
    const dismissed = await dismissWorker(e.target.dataset.id);
    createDepartmentWorkers()
    return dismissed
  }))
}


function createNewDepartment() {
  const button = document.querySelector(".form__department--button");
  const inputs = document.querySelectorAll(".form__create--input");
  button.addEventListener("click", async (e) => {
    const body = {};
    inputs.forEach(({ name, value }) => {
      if (value !== "") {
        body[name] = value;
      }
    });
    const newDepartment = await createDepartment(body);
    return newDepartment;
  });
}
function createDepartmentEditModal() {
  const buttons = document.querySelectorAll(".button__pencil--department");
  buttons.forEach((element) =>
    element.addEventListener(`click`, async (e) => {
      const departments = await listDepartments();
      const element = departments.find(
        (element) => element.uuid === e.target.dataset.id
      );
      const modal = document.querySelector(".modal__container");
      modal.innerHTML = "";
      modal.insertAdjacentHTML(
        "beforeend",
        `
      <h2>Editar Departamento</h2>
      <button class="modal__button--X" data-modal="close">
        <i class="fa-sharp fa-solid fa-x"></i>
      </button>
      <form class="form__department--edit">
          <textarea name="description" id="edit--description" cols="30" rows="10">${element.description}</textarea>
          <button class="form__department--button" data-id="${e.target.dataset.id}" data-modal="open" type="submit">
              Salvar Alterações
          </button>
      </form>
      `
      );
      editDepartmentInfo();
      toggleModal();
    })
  );
}

function editDepartmentInfo() {
  const button = document.querySelector(".form__department--button");
  const textarea = document.querySelector("#edit--description");
  return button.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    const newInfo = {
      description: textarea.value,
    };
    const newDepartment = await editDepartment(id, newInfo);
    return newDepartment;
  });
}

function deleteDepartmentModal() {
  const modal = document.querySelector(".modal__container");
  const buttons = document.querySelectorAll(".button__trash--department");
  buttons.forEach((element) =>
    element.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const allDepartments = await listDepartments();
      const departmentName = allDepartments.find(
        (element) => element.uuid === id
      ).name;
      modal.classList.add("modal__container--delete");
      modal.innerHTML = "";
      modal.insertAdjacentHTML(
        "afterbegin",
        `
        <h2>Realmente deseja remover o departamento ${departmentName}?</h2>
        <button class="modal__button--X" data-modal="close">
            <i class="fa-sharp fa-solid fa-x"></i>
        </button>
        <button data-modal="close" data-id="${id}" class="modal__delete">
            Deletar
        </button>
        `
      );
      deleteSelectedDepartment();
      toggleModal();
    })
  );
}
function deleteSelectedDepartment() {
  const button = document.querySelector(".modal__delete");
  const modal = document.querySelector(".modal__container");
  button.addEventListener("click", async (e) => {
    const deleted = await deleteDepartment(e.target.dataset.id);
    render();
    return deleted;
  });
}

async function renderSelectEnterprises() {
  const select = document.querySelector("#enterprises");
  const options = await getEnterprises();
  if(select.value === "") {
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
async function render() {
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
  createViewModal()
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
