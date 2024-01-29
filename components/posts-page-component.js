import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { addLike, addDislike } from "../api.js";
import { formatDate } from "../lib/formatDate/formatDate.js";

export function toggleLike() {
  const likeButtonElements = document.querySelectorAll(".like-button");

  for (const likeButtonElement of likeButtonElements) {
    likeButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();

      let id = likeButtonElement.dataset.postId;
      let token = getToken();

      if (token === undefined) {
        alert("Пройдите авторизацию");
      } else {
        likeButtonElement.dataset.isLiked === "true"
  
          ? addDislike({ id, token })
          .then((responseData) => {

              likeButtonElement.innerHTML = `<img src="./assets/images/like-not-active.svg">`;

              renderLikeElement({ responseData, likeButtonElement });
              likeButtonElement.dataset.isLiked = "false";
            })
          : addLike({ id, token })
          .then((responseData) => {

              likeButtonElement.innerHTML = `<img src="./assets/images/like-active.svg">`;

              renderLikeElement({ responseData, likeButtonElement });
              likeButtonElement.dataset.isLiked = "true";
            });
      }
    });
  }
}
// const renderLikeElement = ({ responseData }) => {
//   const postLikesText = document.querySelector(".post-likes-text");
//   const likes = responseData.post.likes;

//   let likesText = "0";

//   if (likes.length > 0) {
//     likesText = likes.length < 2
//       ? likes.map(({ name: post }) => post).join(", ")
//       : `${likes[Math.floor(Math.random() * likes.length)].name} и еще ${likes.length - 1}`;
//   }

//   postLikesText.innerHTML = `<p class="post-likes-text">Нравится: <strong>${likesText}</strong></p>`;
// };

const renderLikeElement = ({ responseData, likeButtonElement }) => { 
  const postLikesText = likeButtonElement.closest(".post").querySelector(".post-likes-text"); // ищем выше по дереву 
  const likesCount = responseData.post.likes.length;

  let likesText = "";
  if (likesCount === 0) {
    likesText = `Нравится: <strong>0</strong>`;
  } else if (likesCount === 1) {
  //  JSON.stringify(responseData.post.likes[responseData.post.likes.length - 1].name) === "{}"
    likesText = `Нравится: <strong>${JSON.stringify(responseData.post.likes[0].name) === "{}" ? "Кому-то" : responseData.post.likes[0].name}</strong>` ;
  } else {
    const otherLikesCount = likesCount - 1;
    const otherLikesText = `<strong>еще ${otherLikesCount.toString()}</strong>`;
    likesText = `Нравится: <strong>${JSON.stringify(responseData.post.likes[responseData.post.likes.length - 1].name) === "{}" 
    ? "Кому-то" : responseData.post.likes[length - 1].name}</strong> и ${otherLikesText}`;
  }

  postLikesText.innerHTML = `<p>${likesText}</p>`;
};


export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  const postsHtml = posts 
  .map((post, index) => { 
   let likesText;
    if (post.likes.length === 0) { 
      likesText = `Нравится: <strong>0</strong>`; 
    } else if (post.likes.length === 1) { 
      likesText = `Нравится: <strong>${JSON.stringify(post.likes[0].name) === "{}" ? "Кому-то" : post.likes[0].name}</strong>`; 
    } else { 
      const otherLikesCount = post.likes.length - 1; 
      const otherLikesText = `<strong>еще ${otherLikesCount.toString()}</strong>`; 
      likesText = `Нравится: <strong>${JSON.stringify(post.likes[post.likes.length - 1].name) === "{}" ? "Кому-то" : post.likes[post.likes.length - 1].name}</strong> и ${otherLikesText}`; 
    }
    return `  
  <li class="post"> 
  <div class="post-header" data-user-id="${post.user.id}"> 
    <img src="${post.user.imageUrl}" class="post-header__user-image"> 
    <p class="post-header__user-name">${post.user.name}</p> 
  </div> 
  <div class="post-image-container"> 
    <img class="post-image" src="${post.imageUrl}"> 
  </div> 
  <div class="post-footer"> 
  <div class="post-likes"> 
    <button data-post-id="${post.id}" data-is-liked="${ 
      post.isLiked 
    }" class="like-button" data-index=${index}> 
      <img src="${post.isLiked 
          ? "./assets/images/like-active.svg" 
          : "./assets/images/like-not-active.svg" 
      }"> 
    </button> 
    <p class="post-likes-text"> 
    ${likesText}
  </p> 
  </div> 
  </div> 
  <p class="post-text"> 
    <span class="user-name">${post.user.name}</span> 
    ${post.description} 
  </p> 
  <p class="post-date"> 
  ${formatDate(post.createdAt)} 
  </p> 
</li>`; 
  }) 
  .join('');

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  toggleLike();

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        id: userEl.dataset.userId,
      });
    });
  }

}
