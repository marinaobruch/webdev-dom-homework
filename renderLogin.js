import { fetchLogin, fetchRegistration } from "./api.js";
import { renderComments } from "./renderComments.js";

export const renderLogin = (app, isInitialLoading, isWaitingComment, comments, callback, user) => {
    let isAuthMode = true;

    const renderForm = () => {
        app.innerHTML = `
        <div class="registration">
            <div class="add-form">
            <h3>${isAuthMode ? 'Форма входа' : 'Форма регистрации'}</h3>
                <div class="reg-input">
                ${isAuthMode ? '' : `
                    <input type="text"
                    id="add-name"
                    class="add-name"
                    placeholder="Введите имя"
                    />`
            }
                  <input type="text"
                    id="add-login"
                    class="add-login"
                    placeholder="Введите логин"
                    />
                  <input
                    type="password"
                    id="add-password"
                    class="add-password"
                    placeholder="Введите пароль"
                    </>
                </div>
                <div class="add-reg-form">
                  <button
                  type="button"
                  id="auth-button"
                  class="auth-button">${isAuthMode ? 'Войти' : 'Зарегистрироваться'}</button>
                  <button id="reg-button" class="reg-button">${isAuthMode ? 'Зарегистрироваться' : 'Войти'}</button>
                </div>
            </div>
        </div>
    `

        document.getElementById("reg-button")
            .addEventListener('click', (event) => {
                event.preventDefault();

                isAuthMode = !isAuthMode;

                renderForm();
            });

        const authButton = document.getElementById("auth-button");
        authButton.addEventListener("click", () => {

            if (isAuthMode) {
                const login = document.getElementById("add-login").value;
                const password = document.getElementById("add-password").value;

                if (!login) {
                    alert("Введите логин");
                    return;
                }

                if (!password) {
                    alert("Введите пароль");
                    return;
                }

                fetchLogin(login, password)
                    .then((response) => {
                        renderComments(app, isInitialLoading, isWaitingComment, comments, callback, response.user);
                    })
                    .catch(error => {
                        alert(error.message)
                    })
            }

            else {
                const name = document.getElementById("add-name").value;
                const login = document.getElementById("add-login").value;
                const password = document.getElementById("add-password").value;

                if (!name) {
                    alert("Введите имя");
                    return;
                }

                if (!login) {
                    alert("Введите логин");
                    return;
                }

                if (!password) {
                    alert("Введите пароль");
                    return;
                }

                fetchRegistration(login, password, name)
                    .then((response) => {
                        renderComments(app, isInitialLoading, isWaitingComment, comments, callback, response.user);
                    })
                    .catch(error => {
                        alert(error.message)
                    })
            }
        })
    }
    renderForm();
}
