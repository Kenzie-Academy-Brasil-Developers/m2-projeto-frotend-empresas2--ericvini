import {getEnterprises, getSectors, toggleModal, createOption} from './requests.js';


function createEnterprise ({uuid, name, opening_hours, sectors: {description}}) {
    const lista = document.querySelector('.sectors__container--list');
    lista.insertAdjacentHTML('beforeend',
    `
    <li class="list__item" data-id="${uuid}">
        <h2>${name}</h2>
        <p>${opening_hours}</p>
        <span>${description}</span>
    </li>
    `);
    return lista
}

async function renderEnterprises() {
    const lista = document.querySelector('.sectors__container--list');
    lista.innerHTML = ""
    const enterprises = await getEnterprises();
    await renderSelect()
    await renderSelectedEnterprises();
    return enterprises.forEach(element => createEnterprise(element));
}

async function renderSelect () {
    const select = document.querySelector('select');
    const options = await getSectors();
    return options.forEach(({description}) => select.appendChild(createOption(description)))
}

async function renderSelectedEnterprises() {
    const select = document.querySelector('select');
    select.addEventListener('click',async (e) => {
        const value = select.value;
        if(value !== "") {
            const lista = document.querySelector('.sectors__container--list');
            lista.innerHTML = "";
            const enterprises = await getEnterprises(value);
            console.log(enterprises)
            return enterprises.forEach(element => createEnterprise(element));
        }else {
            return renderEnterprises()
        }
    })
}


renderEnterprises();
toggleModal()
