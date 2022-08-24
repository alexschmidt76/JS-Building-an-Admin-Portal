
async function main() {
    // get books
    let response = await fetch('http://localhost:3001/listBooks');
    let books = await response.json();

    showTitles(books);
    showForm(books);
}

function showForm(books) {
    let form = document.createElement('form');
    
    form.innerHTML += `
        <h5>NEW BOOK FORM:</h5>
        <label for="title">Title: </label>
        <input name="title" id="title"><br>
        <label for="description">Description: </label>
        <input name="description" id="description"><br>
        <label for="img-url">Image URL: </label>
        <input name="img-url" id="img-url"><br><br>
        <button id="submit">Submit</button>
    `;
    document.body.append(form);

    let title = document.getElementById('title');
    let desc = document.getElementById('description');
    let url = document.getElementById('img-url');
    let submit_btn = document.getElementById('submit');
    submit_btn.addEventListener('click', async () => {
        let book = {
            "id": books.length + 1,
            "title": title.value,
            "description": desc.value,
            "year": new Date().getFullYear(),
            "quantity": 1,
            "imageURL": url.value
        };
        //books.push(book);

        let response = await fetch('http://localhost:3001/addBook', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        let newBook = await response.json();
        //showTitles(books);
    });
}

function showTitles(books) {
    let titleList = document.createElement('ul');
    books.forEach( book => {
        // make li
        let li = document.createElement('li');

        // title
        let title = document.createElement('label')
        title.textContent = book.title;
        title.for = book.title
        li.append(title);

        // input
        let input = document.createElement('input');
        input.value = book.quantity;
        input.name = book.title
        li.append(input);

        // save button
        let save_btn = document.createElement('button');
        save_btn.textContent = 'Save'
        save_btn.addEventListener('click', async () => {
            let response = await fetch('http://localhost:3001/updateBook', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'id': book.id,
                    'quantity': input.value
                })
            });
            let updatedBook = await response.json();
        });
        li.append(save_btn);

        // delete button
        let del_btn = document.createElement('button');
        del_btn.textContent = 'Delete';
        del_btn.addEventListener('click', async () => {
            li.remove();
            let response = await fetch(`http://localhost:3001/removeBook/${book.id}`, {
                method: 'DELETE'
            });
            let deletedBook = await response.json();
        });
        li.append(del_btn);

        // append li
        titleList.append(li);
    });
    document.getElementById('root').append(titleList);
}

main();