import { delay } from "./supportFunc.js";
import { renderLogin } from "./renderLogin.js";
import { postComment, deleteComment, getFetch } from "./api.js";
import { format } from "date-fns";


// Функция render
export const renderComments = (app, isInitialLoading, isWaitingComment, comments, callback, user) => {

  const commentHTML = comments.map((comment, index, id) => {

    // ${!user ? `` : `${user._id === post.user.id ? `            
    // <div class="delete-button-main">
    // <button class="delete-button" data-post-id="${post.id}">Удалить пост</button>
    // </div>` : ``}`}

    const createDate = format(new Date(comment.date), 'dd/MM/yyyy HH:mm');

    return `<li id="comment" class="comment" data-index="${index}">
      <div class="comment-header">
        <div id="name">${comment.author.name}</div>
        <div id="date">${createDate}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
        </div>
      </div>
      <div class="common-footer">

        <button data-id="${comment.id}" class="delete-button">Удалить комментарий</button>
        
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index="${index}" id="like-button" class="like-button
            ${comment.isLiked ? '-active-like' : ''}
            ${comment.isLikeLoading ? '-loading-like' : ''}">
            </button>
          </div>
        </div>
      </div>
    </li>`
  }).join("");
  console.log(user.name);

  const appHtml = `
  <div class="container">
      <ul id="comments" class="comments">

      ${isInitialLoading ? '<div>Комментарии загружаются</div>' : commentHTML}
       </ul>

    ${user
      ? `
      <div class="container">
        <ul id="comments" class="comments">
        </ul>
        <div class="add-form">
          <input type="text"
          id="add-form-name"
          class="add-form-name"
          value="${user.name}"
          disabled
          placeholder="Введите ваше имя" />
              
          <textarea type="textarea" id="add-form-text" class="add-form-text" placeholder="Введите ваш коментарий"
          rows="4"></textarea>

             <div class="add-form-row">
              <button type="button" id="add-form-button" class="add-form-button">Написать</button>
            </div>
      </div>
            <p class="add-waiting">Комментарий добавляется...</p>
          </div>`

      : `
      <div class="form-loaging" style="margin-top: 20px">
      Чтобы добавить комментарий, <a href=" " id="go-to-login">Авторизуйтесь</a>
    </div>`
    }
    </div>`;

  app.innerHTML = appHtml;

  const addCommentForm = document.querySelector(".add-form");
  const commentInputElement = document.querySelector(".add-form-text");


  //Функция удаления комментария
  if (!user) {
    const deleteButtons = document.querySelectorAll(".delete-button");
    for (const deleteButton of deleteButtons) {
      deleteButton.setAttribute('disabled', '');
      deleteButton.classList.add("disabled");
    }
  }

  if (user) {
    const deleteButtons = document.querySelectorAll(".delete-button");

    for (const deleteButton of deleteButtons) {
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const id = deleteButton.dataset.id;

        deleteComment(id)
        renderComments(app, isInitialLoading, isWaitingComment, comments, callback, user);
      })
    };
  }


  // Функция лоадинг при добавлении комментариев в ленту
  if (user) {
    const waitingAddComment = () => {

      const constWaitingComment = document.querySelector('.add-waiting');

      if (isWaitingComment) {
        constWaitingComment.classList.remove(`hidden`);
        addCommentForm.classList.add(`hidden`);
      } else {
        constWaitingComment.classList.add(`hidden`);
        addCommentForm.classList.remove(`hidden`);
      }
    };
    waitingAddComment();
  }

  // Добавление клика на лайк
  const initLikeButtons = () => {
    const likeButtonsElements = document.querySelectorAll(".like-button");

    for (const likeButtonsElement of likeButtonsElements) {

      likeButtonsElement.addEventListener('click', (event) => {
        event.stopPropagation();

        let comment = comments[likeButtonsElement.dataset.index];
        comment.isLikeLoading = true;

        renderComments(app, isInitialLoading, isWaitingComment, comments, callback, user);

        // Инициализация задержки при обработке лайка на комментарий
        delay(2000).then(() => {
          if (comment.isLiked) {
            comment.likes = comment.likes - 1;
          } else {
            comment.likes = comment.likes + 1;
          }

          comment.isLiked = !comment.isLiked;
          comment.isLikeLoading = false;
          renderComments(app, isInitialLoading, isWaitingComment, comments, callback, user);
        });
      });
    }
  }
  initLikeButtons();


  // Добавление ответа на комментарии
  const answerComment = () => {
    const commentElements = document.querySelectorAll('.comment');

    for (let element of commentElements) {
      element.addEventListener('click', () => {
        let index = element.dataset.index;

        commentInputElement.value = `START_QUOTE${comments[index].author.name}:
  \n${comments[index].text.replaceAll('<div class="comment-quote">', 'START_QUOTE').replaceAll('</div>', 'END_QUOTE')} END_QUOTE`;
      });
    }
  }
  answerComment();



  if (!user) {
    const goToLogin = document.getElementById("go-to-login");
    goToLogin.addEventListener("click", (event) => {
      event.preventDefault();
      renderLogin(app, isInitialLoading, isWaitingComment, comments, callback, user);
    })
  }

  if (user) {
    if (callback) callback(user)
  }
}