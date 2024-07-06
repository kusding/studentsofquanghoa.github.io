import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCLuMvQ2OSLGRNhEKT5zlvOQH_pqB4r2cc",
    authDomain: "quanghoastudent.firebaseapp.com",
    projectId: "quanghoastudent",
    storageBucket: "quanghoastudent.appspot.com",
    messagingSenderId: "792199693508",
    appId: "1:792199693508:web:9e91a6ae8ebd3849d6ed0b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
        alert('Error signing up: ' + err.message);
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
        alert('Error logging in: ' + err.message);
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
            alert('Error creating post: ' + err.message);
        });
    } else {
        alert('You must be logged in to create a post.');
    }
});

auth.onAuthStateChanged(user => {
    if (user) {
        fetchPosts();
        document.getElementById('create-post').style.display = 'block';
    } else {
        document.getElementById('create-post').style.display = 'none';
    }
});

function fetchPosts() {
    db.collection('posts').orderBy('created_at', 'desc').get().then(snapshot => {
        let postsHtml = '';
        snapshot.forEach(doc => {
            const post = doc.data();
            postsHtml += `<div class="post">
                <h3>${post.author}</h3>
                <p>${post.content}</p>
                <small>${post.created_at.toDate()}</small>
            </div>`;
        });
        document.getElementById('posts').innerHTML = postsHtml;
    }).catch(err => {
        console.error('Error fetching posts:', err.message);
    });
}

