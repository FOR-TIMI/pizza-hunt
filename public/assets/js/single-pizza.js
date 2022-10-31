const $backBtn = document.querySelector('#back-btn');
const $pizzaName = document.querySelector('#pizza-name');
const $createdBy = document.querySelector('#created-by');
const $createdAt = document.querySelector('#created-at');
const $size = document.querySelector('#size');
const $toppingsList = document.querySelector('#toppings-list');
const $commentSection = document.querySelector('#comment-section');
const $newCommentForm = document.querySelector('#new-comment-form');

let pizzaId;

async function getPizza(){

try{
    // To get id of pizza '?:id'
    const searchParams = new URLSearchParams(document.location.search.substring(1));
    const pizzaId = searchParams.get("id");
  
    // Get pizza Info for that id
     const response = await fetch(`/api/pizza/${pizzaId}`)
  
     if(!response.ok){
       const message = `An error has occured: ${response.status}`
       throw new Error(message)
     }
  
     const pizza = await response.json();
     printPizza(pizza)
}
catch(err){
  console.log(err);
  alert('Cannot find a pizza with this id! Taking you back.');
  window.history.back();
};

}


function printPizza(pizzaData) {

  pizzaId = pizzaData._id;

  const { pizzaName, createdBy, createdAt, size, toppings, comments } = pizzaData;

  $pizzaName.textContent = pizzaName;
  $createdBy.textContent = createdBy;
  $createdAt.textContent = createdAt;
  $size.textContent = size;
  $toppingsList.innerHTML = toppings
    .map(topping => `<span class="col-auto m-2 text-center btn">${topping}</span>`)
    .join('');

  if (comments && comments.length) {
    comments.forEach(printComment);
  } else {
    $commentSection.innerHTML = '<h4 class="bg-dark p-3 rounded">No comments yet!</h4>';
  }
}

function printComment(comment) {
  // make div to hold comment and subcomments
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('my-2', 'card', 'p-2', 'w-100', 'text-dark', 'rounded');

  const commentContent = `
      <h5 class="text-dark">${comment.writtenBy} commented on ${comment.createdAt}:</h5>
      <p>${comment.commentBody}</p>
      <div class="bg-dark ml-3 p-2 rounded" >
        ${
          comment.replies && comment.replies.length
            ? `<h5>${comment.replies.length} ${
                comment.replies.length === 1 ? 'Reply' : 'Replies'
              }</h5>
        ${comment.replies.map(printReply).join('')}`
            : '<h5 class="p-1">No replies yet!</h5>'
        }
      </div>
      <form class="reply-form mt-3" data-commentid='${comment._id}'>
        <div class="mb-3">
          <label for="reply-name">Leave Your Name</label>
          <input class="form-input" name="reply-name" required />
        </div>
        <div class="mb-3">
          <label for="reply">Leave a Reply</label>
          <textarea class="form-textarea form-input"  name="reply" required></textarea>
        </div>

        <button class="mt-2 btn display-block w-100">Add Reply</button>
      </form>
  `;

  commentDiv.innerHTML = commentContent;
  $commentSection.prepend(commentDiv);
}

function printReply(reply) {
  return `
  <div class="card p-2 rounded bg-secondary">
    <p>${reply.writtenBy} replied on ${reply.createdAt}:</p>
    <p>${reply.replyBody}</p>
  </div>
`;
}

async function handleNewCommentSubmit(event) {
  event.preventDefault();

      // To get id of pizza '?:id'
  const searchParams = new URLSearchParams(document.location.search.substring(1));
  const pizzaId = searchParams.get("id");  

  const commentBody = $newCommentForm.querySelector('#comment').value;
  const writtenBy = $newCommentForm.querySelector('#written-by').value;

  if (!commentBody || !writtenBy) {
    return false;
  }

  const formData = { commentBody, writtenBy };

try{
    const response = await fetch(`/api/comments/${pizzaId}`,{
      method : `POST`,  
      headers: {
      Accept : 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const newComment = await response.json();


    location.reload()
    return;
}
catch(err){
  console.log(err)
}

}

async function handleNewReplySubmit(event) {
  event.preventDefault();

  if (!event.target.matches('.reply-form')) {
    return false;
  }

  const commentId = event.target.getAttribute('data-commentid');

  const writtenBy = event.target.querySelector('[name=reply-name]').value;
  const replyBody = event.target.querySelector('[name=reply]').value;

  if (!replyBody || !writtenBy) {
    return false;
  }
  const formData = { writtenBy, replyBody };
  console.log(formData)
  try{
      const response = await fetch(`/api/comments/${pizzaId}/${commentId}`,{
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

        if (!response.ok) {
          throw new Error('Something went wrong!');
        }

      const reply = await response.json()
      console.log(reply)
      location.reload();
  }
  catch(err){
    console.log(err);
    alert('Cannot find a pizza with this id! Taking you back.');
    window.history.back();
  }
}

$backBtn.addEventListener('click', function() {
  window.history.back();
});

$newCommentForm.addEventListener('submit', handleNewCommentSubmit);
$commentSection.addEventListener('submit', handleNewReplySubmit);

getPizza();