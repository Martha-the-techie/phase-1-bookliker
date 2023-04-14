document.addEventListener('DOMContentLoaded', function() {
    const bookList = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
  
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(data => {
        data.forEach(book => {
          const li = document.createElement('li');
          li.textContent = book.title;
          li.dataset.id = book.id;
          bookList.appendChild(li);
        });
      })
      .catch(error => console.error(error));
      
    bookList.addEventListener('click', function(event) {
      if (event.target.matches('li')) {
        const bookId = event.target.dataset.id;
        
        fetch(`http://localhost:3000/books/${bookId}`)
          .then(response => response.json())
          .then(book => {
            
            const img = document.createElement('img');
            img.src = book.img_url;
            
            const title = document.createElement('h2');
            title.textContent = book.title;
            
            const subtitle = document.createElement('h3');
            subtitle.textContent = book.subtitle;
            
            const author = document.createElement('h4');
            author.textContent = book.author;
            
            const description = document.createElement('p');
            description.textContent = book.description;
            
            const likeButton = document.createElement('button');
            likeButton.textContent = 'Like';
            likeButton.dataset.bookId = book.id;
            likeButton.dataset.users = JSON.stringify(book.users);
            
            const userList = document.createElement('ul');
            userList.className = 'user-list';
            book.users.forEach(user => {
              const userItem = document.createElement('li');
              userItem.textContent = user.username;
              userList.appendChild(userItem);
            });
            
            showPanel.innerHTML = '';
            showPanel.appendChild(img);
            showPanel.appendChild(title);
            showPanel.appendChild(subtitle);
            showPanel.appendChild(author);
            showPanel.appendChild(description);
            showPanel.appendChild(likeButton);
            showPanel.appendChild(userList);
          })
          .catch(error => console.error(error));
      }
    });
    
    showPanel.addEventListener('click', function(event) {
      if (event.target.matches('button')) {
        const bookId = event.target.dataset.bookId;
        let users = JSON.parse(event.target.dataset.users);
        
        const userId = 1; 
        
        if (users.some(user => user.id === userId)) {
          
          users = users.filter(user => user.id !== userId);
          event.target.textContent = 'Like';
        } else {
          
          users.push({ id: userId, username: 'pouros' });
          event.target.textContent = 'Unlike';
        }
        
        fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
      })
        .then(response => response.json())
        .then(book => {
          const userList = event.target.nextElementSibling;
          userList.innerHTML = '';
          book.users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.textContent = user.username;
            userList.appendChild(userItem);
          });
        });
    }
  });
});