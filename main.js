// Firebase configuration
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();

// Handle sign up
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log('User signed up:', cred.user);
        window.location = 'index.html';
    }).catch(err => {
        console.error('Error signing up:', err.message);
    });
});

// Handle login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        console.log('User logged in:', cred.user);
        window.location = 'index.html';
    }).catch(err => {
        console.error('Error logging in:', err.message);
    });
});

// Handle post creation
document.getElementById('post-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var content = document.getElementById('post-content').value;
    var user = auth.currentUser;
    if (user) {
        db.collection('posts').add({
            content: content,
            author: user.email,
            created_at: new Date()
        }).then(() => {
            console.log('Post created');
            document.getElementById('post-content').value = '';
            fetchPosts();
        }).catch(err => {
            console.error('Error creating post:', err.message);
        });
    } else {
        alert('You must be logged in to create a post.');
    }
});

// Fetch and display posts
function fetchPosts() {
    var postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    db.collection('posts').orderBy('created_at', 'desc').get().then(snapshot => {
        snapshot.forEach(doc => {
            var post = doc.data();
            var postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <p>${post.content}</p>
                <small>by ${post.author}</small>
            `;
            postsContainer.appendChild(postElement);
        });
    }).catch(err => {
        console.error('Error fetching posts:', err.message);
    });
}

// Check auth state and fetch posts if logged in
auth.onAuthStateChanged(user => {
    if (user) {
        fetchPosts();
    }
});
