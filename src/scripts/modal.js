import {
  getEnterprises,
  listUsers,
  deleteUser,
  updateUser,
  editDepartment,
  deleteDepartment,
  createDepartment,
  getOutOfWork,
  hireWorker,
  dismissWorker,
  toggleModal,
  createOption,
  listDepartments,
  toastfy,
} from "./requests.js";
import { render } from "./dashboard.js";

export function createUserEditModal() {
  const modal = document.querySelector(".modal__container");
  const buttons = document.querySelectorAll(".button__pencil--users");
  console.log(buttons)
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
    toastfy("Usuário editado com sucesso", true);
    await render()
    return newUser;
  });
}

export function deleteUserModal() {
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
  button.addEventListener("click", async (e) => {
    const deleted = await deleteUser(e.target.dataset.id);
    toastfy("Usuário deletado com sucesso", true);
    await render();
    return deleted;
  });
}

export function createDepartmentModal() {
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
          <input type="text" autocomplete="off" name="name" class="form__create--input" placeholder="Digite o nome da Empresas" >
          <input type="text" name="description" class="form__create--input" placeholder="Descrição" >
          <select name="company_uuid" id="create--select" class="form__create--input">
              <option value="">Selecionar empresas</option>
          </select>
          <button class="form__department--button" data-modal="close">
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

function createNewDepartment() {
  const button = document.querySelector(".form__department--button");
  const inputs = document.querySelectorAll(".form__create--input");
  button.addEventListener("click", async (e) => {
    e.preventDefault()
    const body = {};
    inputs.forEach(({ name, value }) => {
      if (value !== "") {
        body[name] = value;
      }
    });
    const newDepartment = await createDepartment(body);
    if (newDepartment.error) {
      toastfy("Erro ao criar departamento");
    } else {
      toastfy("Departamento criado com sucesso", true);
    }
    await render()
    return newDepartment;
  });
}

const createSelectOutWork = async () => {
  const select = document.querySelector("#user_uuid");
  select.innerHTML = "";
  const options = await getOutOfWork();
  select.appendChild(createOption("Selecionar Usuário", ""));
  options.forEach(({ username, uuid }) =>
    select.append(createOption(username, uuid))
  );
};

async function createDepartmentWorkers() {
  const users = await listUsers();
  const list = document.querySelector(".modal__workers--list");
  const workers = users.filter(
    (element) => element.department_uuid === list.dataset.id
  );
  list.innerHTML = "";
  const allCompanies = await getEnterprises();
  const companyName = allCompanies.find(
    (element) => element.uuid === list.dataset.company
  ).name;
  workers.forEach(({ uuid, username, professional_level }) => {
    list.insertAdjacentHTML(
      "beforeend",
      `
    <li class="workers__list--item">
    <h3>${username}</h3>
    <p>${professional_level}</p>
    <p>${companyName}</p>
    <button class="workers__button--dismiss" id="dismiss" data-id="${uuid}">Desligar</button>
    </li>
    `
    );
  });
  dismissWorkerButton();
}

function hireWorkerButton() {
  const select = document.querySelector("#user_uuid");
  const button = document.querySelector("#hire");
  return button.addEventListener("click", async (e) => {
    const ids = {
      user_uuid: select.value,
      department_uuid: e.target.dataset.id,
    };
    const newWorker = await hireWorker(ids);
    toastfy("Funcionário contratado com sucesso", true);
    createSelectOutWork();
    createDepartmentWorkers();
    return newWorker;
  });
}

function dismissWorkerButton() {
  const buttons = document.querySelectorAll(".workers__button--dismiss");
  buttons.forEach((element) =>
    element.addEventListener("click", async (e) => {
      const dismissed = await dismissWorker(e.target.dataset.id);
      toastfy("Funcionário demitido com sucesso");
      createDepartmentWorkers();
      return dismissed;
    })
  );
}

export function createViewModal() {
  const buttons = document.querySelectorAll(".button__eye--department");
  buttons.forEach((element) =>
    element.addEventListener("click", async (e) => {
      const allDepartments = await listDepartments();
      const { uuid, name, description, companies } = allDepartments.find(
        (element) => element.uuid === e.target.dataset.id
      );
      const modal = document.querySelector(".modal__container");
      modal.innerHTML = "";
      modal.classList.add("modal__container--view");
      modal.insertAdjacentHTML(
        "beforeend",
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
      `
      );
      toggleModal();
      await createSelectOutWork();
      await createDepartmentWorkers();
      hireWorkerButton();
    })
  );
}

export function createDepartmentEditModal() {
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
    e.preventDefault();
    const id = e.target.dataset.id;
    const newInfo = {
      description: textarea.value,
    };

    const newDepartment = await editDepartment(id, newInfo);
    if (newDepartment.error) {
      toastfy("Erro ao editar informações do departamento");
    } else {
      toastfy("Informações atualizadas", true);
    }
    await render();
    return newDepartment;
  });
}

export function deleteDepartmentModal() {
  const modal = document.querySelector(".modal__container");
  const buttons = document.querySelectorAll(".button__trash--department");
  buttons.forEach((element) =>
    element.addEventListener("click", async (e) => {
      const allDepartments = await listDepartments();
      const id = e.target.dataset.id;
      const departmentName = allDepartments.find(
        (element) => element.uuid === id
      ).name;
      modal.classList.add("modal__container--delete");
      modal.innerHTML = "";
      modal.insertAdjacentHTML(
        "afterbegin",
        `
        <form class="form__delete">
          <h2>Realmente deseja remover o departamento ${departmentName}?</h2>
          <button class="modal__button--X" data-modal="close">
              <i class="fa-sharp fa-solid fa-x"></i>
          </button>
          <button data-id="${id}" class="modal__delete" data-modal="close" >
          Deletar
          </button>
        </form>
        `
      );
      deleteSelectedDepartment();
      toggleModal();
    })
  );
}

function deleteSelectedDepartment() {
  const button = document.querySelector(".modal__delete");
  return button.addEventListener("click", async (e) => {
    e.preventDefault();
    const deletedDepartment = await deleteDepartment(e.target.dataset.id);
    toastfy("Departamento Excluido", true);
    await render();
    return deletedDepartment;
  });
}
