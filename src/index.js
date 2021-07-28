let addToy = false;
const database = "http://localhost:3000/toys";

let redHeart = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";
let blankHeart = "https://i.stack.imgur.com/Ui4gd.png";

const likeImgs = {["https://i.stack.imgur.com/Ui4gd.png"]: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png",["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png"]: "https://i.stack.imgur.com/Ui4gd.png"}


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetchToys();
  const toyFormElement = document.getElementById("toy-form");
  toyFormElement.addEventListener("submit",e=>{
    e.preventDefault();
    let toyFields = document.querySelectorAll(".input-text");
    postNewToy({
      name: toyFields[0].value,
      image: toyFields[1].value,
      likes: 0
    });
    e.target.reset();
  })
});

function fetchToys() {
  fetch(database).then(r=>r.json()).then(j=>{j.forEach(renderToy)});
}

function renderToy(toy) {
  let toyCard = document.createElement("div");
  toyCard.className = "card";
  let toyh2 = document.createElement("h2");
  toyh2.textContent = toy.name;
  let toyImg = document.createElement("img");
  toyImg.src = toy.image;
  toyImg.alt = toy.name;
  toyImg.className = "toy-avatar";
  let toyLikeText = document.createElement("p");
  toyLikeText.textContent = toy.likes;
  let likeImage = document.createElement("img");
  likeImage.src = blankHeart;
  likeImage.alt = "like button";
  likeImage.className = "like-image";
  likeImage.addEventListener("click",e=>{
    let changeValue = e.target.src===blankHeart ? 1 : -1;
    e.target.src = likeImgs[e.target.src];
    toy.likes+=changeValue;
    fetch(`${database}/${toy.id}`,{method: "PATCH",headers: {'Content-Type': 'application/json','Accept': 'application/json'},body: JSON.stringify(toy)}).then(r=>r.json()).then(j=>{
      toyLikeText.textContent = j.likes;
    });
  });
  toyCard.append(toyh2,toyImg,toyLikeText,likeImage);
  document.getElementById("toy-collection").appendChild(toyCard);
}

function postNewToy(toy) {
  fetch(database, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toy)
  }).then(r=>r.json()).then(renderToy);
}
