import {getToken, register, authenticateUser} from './requests.js';


function loginUser() {
    const button = document.querySelector('.form__button--login');
    const inputs = document.querySelectorAll('.form__input--login');
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        const loginBody = {};
        let count = 0;
        inputs.forEach(({value, name}) => {
            if(value === ""){
                count++
                e.preventDefault()
            }
            loginBody[name] = value;
        })
        if(count !== 0) {
            alert("Por favor preencha os campos corretamente")
        } else {
            const user = await getToken(loginBody);
            if(!user.error) {
                if(await authenticateUser(user)) {
                    setTimeout(() => {
                        window.location.replace("./admin.html");
                    }, 2000)
                }else {
                    setTimeout(() => {
                        window.location.replace("./user.html")
                    },2000)
                }

            }else {
                alert(user.error)
            }
        }
    })
}

function registerUser () {
    const inputs = document.querySelectorAll(".form__input--register");
    const button = document.querySelector('.form__button--register');
    button.addEventListener('click',async (e) => {
        e.preventDefault()
        let count = 0;
        const registerBody = {}
        inputs.forEach(({value, name}) => {
            if(value === "") {
                count++
            }
            registerBody[name] = value;
        })
        if(count !== 0) {
            alert("Preencha os campos corretamente")
        }else {
            alert("Usuário criado com sucesso")
            await register(registerBody);
            setTimeout(() => {
                window.location.href = "./login.html"
            },1000)
        }
    })
}

if(window.location.pathname === "/src/pages/register.html") {
    registerUser()
}else {
    loginUser()
}