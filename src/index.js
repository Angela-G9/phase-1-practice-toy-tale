document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');
  const addBtn = document.getElementById('new-toy-btn');
  const toyFormContainer = document.querySelector('.container');

  let addToy = false;

  // Toggle form visibility
  addBtn.addEventListener('click', () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? 'block' : 'none';
  });

  // Fetch and render toys
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => toys.forEach(renderToy));

  function renderToy(toy) {
    const toyCard = document.createElement('div');
    toyCard.className = 'card';

    const toyName = document.createElement('h2');
    toyName.textContent = toy.name;

    const toyImage = document.createElement('img');
    toyImage.src = toy.image;
    toyImage.className = 'toy-avatar';

    const toyLikes = document.createElement('p');
    toyLikes.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement('button');
    likeButton.textContent = 'Like ❤️';
    likeButton.className = 'like-btn';
    likeButton.id = toy.id;
    likeButton.addEventListener('click', () => handleLike(toy, toyLikes));

    toyCard.append(toyName, toyImage, toyLikes, likeButton);
    toyCollection.appendChild(toyCard);
  }

  function handleLike(toy, toyLikes) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes }),
    })
    .then(response => response.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      toyLikes.textContent = `${updatedToy.likes} Likes`;
    });
  }

  // Add a new toy
  addToyForm.addEventListener('submit', event => {
    event.preventDefault();
    const nameInput = addToyForm.querySelector('input[name="name"]').value;
    const imageInput = addToyForm.querySelector('input[name="image"]').value;

    const newToy = {
      name: nameInput,
      image: imageInput,
      likes: 0,
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy),
    })
    .then(response => response.json())
    .then(renderToy);

    addToyForm.reset();
  });
});
