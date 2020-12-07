function sendInput () {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    window.parent.postMessage(JSON.stringify({username, email}), '*');
}