import { renderHeaderComponent } from "./header-component.js";
import { posts } from "../index.js";
import { toggleLike } from "./posts-page-component.js";
import { formatDate } from "../lib/formatDate/formatDate.js";

export function renderUserPostsPageComponent({ appEl }) {
 
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

  // for (let userEl of document.querySelectorAll(".post-header")) {
  // userEl.addEventListener("click", () => {
  //     goToPage(USER_POSTS_PAGE, {
  // id: userEl.dataset.userId,
  // });
  // });
  // }
}
