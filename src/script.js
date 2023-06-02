let usersData = []; // Store all the user data here

async function getUserData() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/");
  usersData = await response.json();

  renderData(usersData);
}

getUserData();

const searchButton = document.getElementById("search");

searchButton.addEventListener("click", () => filterData());

// Render the user data based on the given data
function renderData(data) {
  const cardsContainer = document.getElementById("parent-div");
  cardsContainer.innerHTML = ""; // Clear the existing content

  data.forEach((user) => {
    const card = document.createElement("div");
    card.setAttribute("id", `user-${user.id}`);
    const form = document.createElement("form");
    card.appendChild(form);

    const openTodosAndPosts = document.createElement("button");
    openTodosAndPosts.setAttribute("id", `open-${user.id}`);
    openTodosAndPosts.innerText = "Open Todos and Posts";

    openTodosAndPosts.addEventListener("click", (e) => {
      e.preventDefault();

      if (!document.getElementById(`container-${user.id}`)) {
        const container = document.createElement("div");
        container.setAttribute("id", `container-${user.id}`);
        container.classList.add("user-container");
        const todosContainer = document.createElement("div");
        const postsContainer = document.createElement("div");

        container.appendChild(todosContainer);
        container.appendChild(postsContainer);

        const todosTitle = document.createElement("h3");
        const postsTitle = document.createElement("h3");

        todosTitle.innerHTML = "Todos";
        postsTitle.innerHTML = "Posts";

        todosContainer.appendChild(todosTitle);
        postsContainer.appendChild(postsTitle);

        card.appendChild(container);

        async function getData() {
          const todoResponse = await fetch(
            `https://jsonplaceholder.typicode.com/todos?userId=${user.id}`
          );

          const todos = await todoResponse.json();

          const postResponse = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
          );

          const posts = await postResponse.json();

          const todoList = document.createElement("ul");
          todosContainer.appendChild(todoList);

          todos.forEach((todo) => {
            // create checkbox
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", `todo-${todo.id}`);
            checkbox.setAttribute("name", `todo-${todo.id}`);

            // make all checkbox checked
            if (todo.completed) {
              checkbox.setAttribute("checked", "checked");
            }

            const todoDiv = document.createElement("li");
            todoDiv.appendChild(checkbox);

            const todoLabel = document.createElement("label");
            todoLabel.setAttribute("for", `todo-${todo.id}`);
            todoLabel.innerHTML = todo.title;
            todoDiv.appendChild(todoLabel);
            todoList.appendChild(todoDiv);
          });

          const postList = document.createElement("ul");
          postsContainer.appendChild(postList);

          posts.forEach((post) => {
            const postDiv = document.createElement("li");
            postDiv.innerHTML = post.title;
            postList.appendChild(postDiv);
          });
        }

        getData();
      } else {
        const container = document.getElementById(`container-${user.id}`);
        container.parentNode.removeChild(container);
      }
    });

    // Added input elements for Name and Email
    const nameLabel = document.createElement("label");
    nameLabel.innerText = "Name";
    const nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("value", user.name);

    const emailLabel = document.createElement("label");
    emailLabel.innerText = "Email";
    const emailInput = document.createElement("input");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("value", user.email);

    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(openTodosAndPosts);

    //Button 1 --> "Other Data"
    const showOtherData = document.createElement("h2");
    showOtherData.classList.add("show-other-data");
    showOtherData.setAttribute("id", `Other Data-${user.id}`);
    showOtherData.innerText = "Additional data";

    showOtherData.addEventListener("mouseover", (event) => {
      if (!event.target.hasAttribute("data-hovered")) {
        event.target.setAttribute("data-hovered", "true");
        const otherDataContainer = document.createElement("div");

        const list = document.createElement("ul");
        const listElement1 = document.createElement("li");
        const listElement2 = document.createElement("li");
        const listElement3 = document.createElement("li");

        listElement1.innerText = `Street: ${user.address.street}`;
        listElement2.innerText = `City: ${user.address.city}`;
        listElement3.innerText = `ZipCode: ${user.address.zipcode}`;

        list.appendChild(listElement1);
        list.appendChild(listElement2);
        list.appendChild(listElement3);

        otherDataContainer.appendChild(list);

        otherDataContainer.addEventListener("mouseout", () => {
          otherDataContainer.parentNode.removeChild(otherDataContainer);
          event.target.removeAttribute("data-hovered");
        });

        form.appendChild(otherDataContainer);
      }
    });

    //Button 2 --> "Update"
    const updateButton = document.createElement("button");
    updateButton.classList.add("update-button");
    updateButton.setAttribute("id", `Update-${user.id}`);
    updateButton.innerText = "Update";

    //Case 4:
    updateButton.addEventListener("click", async () => {
      const updatedName = nameInput.value;
      const updatedEmail = emailInput.value;
      const userIndex = usersData.findIndex((u) => u.id === user.id);
      usersData[userIndex].name = updatedName;
      usersData[userIndex].email = updatedEmail;

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...usersData[userIndex] }),
        }
      );

      if (response.ok) {
        console.log(
          `Updated user ${user.id}: Name: ${updatedName}, Email: ${updatedEmail}`
        );
      } else {
        console.error("Error updating user data");
      }
    });

    //Button 3 --> "Delete"
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.setAttribute("id", `Delete-${user.id}`);
    deleteButton.innerText = "Delete";

    //Case 4:
    deleteButton.addEventListener("click", async () => {
      usersData = usersData.filter((u) => u.id !== user.id);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Deleted user ${user.id} from the server`);
      } else {
        console.error("Error deleting user data from the server");
      }
    });

    const buttonContainer = document.createElement("div");

    buttonContainer.classList.add("button-container");
    form.appendChild(showOtherData);
    buttonContainer.appendChild(updateButton);
    buttonContainer.appendChild(deleteButton);

    card.appendChild(buttonContainer);

    cardsContainer.appendChild(card);
  });
}

//Case 2:  Filter the user data based on the search input and re-render the divs with the filtered data
function filterData() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const filteredData = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchInput) ||
      user.email.toLowerCase().includes(searchInput)
  );

  renderData(filteredData);

  /*case 5 : 
  1. When Clicking on the ID label, the user region will be colored in orange and the user’s
  posts and todos are presented as follows. 
  2.  A “todo” that hasn’t completed will present a “Mark Completed” button the will
  complete the task */
}
