import "./assets/styles/styles.scss";
import "./index.scss";
import { openModal } from "./assets/javascripts/modal";


const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");
const selectElement = document.querySelector("select")
let filter;
let articles;
let sortBy = "desc";



selectElement.addEventListener("change", (evt) => {
  sortBy = selectElement.value; //pas besoin d'utiliser evt.target.value
  fetchArticle()

})


const createArticles = () => {

  const articlesArray = (Array.isArray(articles))
                          ? articles
                          : [articles];
  const articlesDOM = articlesArray.filter((article) => {
    if(filter) {
      return (article.category === filter);
    } else {
      return true;
    }
  }).map(article => {
    const articleDOM = document.createElement("div");
    articleDOM.classList.add("article");
    articleDOM.innerHTML = `
<img
  src="${article.img}"
  alt="profile"
/>
<h2>${article.title}</h2>
<p class="article-author">${article.author} - ${new Date(
      article.createdAt
    ).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    })}</p>
<p class="article-content">
  ${article.content}
</p>
<div class="article-actions">
  <button class="btn btn-danger" data-id=${article._id} >Supprimer</button>
  <button class="btn btn-primary" data-id=${article._id} >Modifier</button>
</div>
`;
    return articleDOM;
  });
  articleContainerElement.innerHTML = "";
  articleContainerElement.append(...articlesDOM);
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-danger");
  const editButtons = articleContainerElement.querySelectorAll(".btn-primary");
  editButtons.forEach(button => {
    button.addEventListener("click", event => {
      const target = event.target;
      const articleId = target.dataset.id;
      // Lien pour l'éditeur en ligne
      window.location.assign(`/form.html?id=${articleId}`);
    });
  });
  deleteButtons.forEach(button => {
    button.addEventListener("click", async event => {

      console.log("button", button.dataset)

      const result = await openModal('Are you sure you want to delete this article ?');
      if (result) {

        try {
          const target = event.target;
          const articleId = target.dataset.id;
          const response = await fetch(
            `https://restapi.fr/api/article/${articleId}`,
            {
              method: "DELETE"
            }
          );
          const body = await response.json();
          console.log(body);
          fetchArticle();
        } catch (e) {
          console.log("e : ", e);
        }

      }

    });
  });
};

const displayMenuCategories = (categoryArr) => {
  const liElements = categoryArr.map( categoryElem => {
    const liElement = document.createElement("li");
    liElement.classList.add("menu");
    liElement.innerHTML = ` ${categoryElem[0]}  <strong> ${categoryElem[1]} </strong>`;

    if (categoryElem[0] === filter) {
      liElement.classList.add('active')
    }
    liElement.addEventListener('click', () => {

      liElements.forEach(li => {
        li.classList.remove('active')
      })

      if (filter === categoryElem[0]) {
        filter = null;
      } else {
        filter = categoryElem[0];
        liElement.classList.add("active")
      }

      createArticles()

    })
    return liElement

  })
  categoriesContainerElement.innerHTML = '';
  categoriesContainerElement.append(...liElements)
}


const createMenuCategories = () => {
    const categories = articles.reduce((acc, article, index) => {
      acc[article.category] =  (acc[article.category]) ? (acc[article.category])+ 1 : 1 ;

      return acc;

    }, {});

    console.log(categories)

    const categoriesArr = Object.keys(categories) // créé un tableau avec les clés des objets

    const newArr = categoriesArr.map((category) => [category, categories[category]]).sort((c1, c2) => c1[0].localeCompare(c2[0]))


    displayMenuCategories(newArr)


    // const esperimentalArr = Object.entries(categories)
    // console.log(esperimentalArr)

}


const fetchArticle = async () => {
  try {
    const response = await fetch(`https://restapi.fr/api/article?sort=createdAt:${sortBy}`);
    articles = await response.json();
    createArticles();
    createMenuCategories();
  } catch (e) {
    console.log("e : ", e);
  }
};

fetchArticle();
