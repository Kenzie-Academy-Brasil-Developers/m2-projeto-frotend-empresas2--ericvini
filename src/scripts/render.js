import {
  getEnterprises,
  getSectors,
  toggleModal,
  createOption,
  toggleBar
} from "./requests.js";

function createEnterprise({
  uuid,
  name,
  opening_hours,
  sectors: { description },
}) {
  const lista = document.querySelector(".sectors__container--list");
  lista.insertAdjacentHTML(
    "beforeend",
    `
    <li class="list__item" data-id="${uuid}">
        <h2>${name}</h2>
        <p>${opening_hours}</p>
        <span>${description}</span>
    </li>
    `
  );
  return lista;
}

async function renderEnterprises() {
  const lista = document.querySelector(".sectors__container--list");
  lista.innerHTML = "";
  const enterprises = await getEnterprises();
  await renderSelect();
  return enterprises.forEach((element) => createEnterprise(element));
}

async function renderSelect() {
  const select = document.querySelector("select");
  select.innerHTML = "";
  const options = await getSectors();
  select.appendChild(createOption("Selecione uma empresa", " "));
  options.forEach(({ description }) =>
  select.appendChild(createOption(description))
  );
  await renderSelectedEnterprises();
}

function renderSelectedEnterprises() {
  const select = document.querySelector("select");
  select.addEventListener("change", async (e) => {
    const value = select.value;
    const enterprises = await getEnterprises(value);
    const lista = document.querySelector(".sectors__container--list");
    lista.innerHTML = "";
    if (value !== " ") {
      return enterprises.forEach((element) => createEnterprise(element));
    } else {
      return enterprises.forEach((element) => createEnterprise(element));
    }
  });
}

renderEnterprises();
toggleBar()
toggleModal();
