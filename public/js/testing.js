$(document).ready(function () {
    getPostData();

    // Getting jQuery references to the post body, title, form, and author select
    var bodyInput = $("#input-message");
    var titleInput = $("#input-title");
    var chatForm = $("#formBody");
    var categorySelect = $("#input-category");
    var blog = $("#posts-html");
    // var photoInput = $("#input-photo");
    var posts;
    var postCategorySelect = $("#category");
    postCategorySelect.on("change", handleCategoryChange);


    // Adding an event listener for when the form is submitted
    $(chatForm).on("submit", function handleFormSubmit(event) {
        event.preventDefault();
        // Wont submit the post if we are missing a body, title, or author
        if (!titleInput.val().trim() || !bodyInput.val().trim() || !categorySelect.val()) {
            return;
        }
        // Constructing a newPost object to hand to the database
        var newPost = {
            title: titleInput
                .val()
                .trim(),
            body: bodyInput
                .val()
                .trim(),
            category: categorySelect.val()
            // photo: photoInput.val() || ""
        };
        console.log(newPost)

        // If we're updating a post run updatePost to update a post
        // Otherwise run submitPost to create a whole new post
        submitPost(newPost);
    });

    function submitPost(post) {
        $.post("/api/posts", post, getPostData);
        bodyInput.val("");
        titleInput.val("");
        // photoInput.val("");
    }

    // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
    function getPostData() {
        console.log("working")
        var queryUrl = "/api/posts"
        $.get(queryUrl, function (data) {
            if (data) {
                console.log(data);
                posts = data;
                initializeRows();
            }
        });
    }

    function initializeRows() {
        blog.empty();
        var postsToAdd = [];
        for (var i = 0; i < posts.length; i++) {
            postsToAdd.push(createNewRow(posts[i]));
        }
        blog.append(postsToAdd.reverse());
    }

    function createNewRow(post) {
        var newPostCard = $("<div>");
        newPostCard.addClass("card");
        var newPostCardHeading = $("<div>");
        newPostCardHeading.addClass("card-header");
        var newPostTitle = $("<h2>");
        var newPostDate = $("<h6>");
        let likeValue = $(`<h3> ${post.likeValue} </h3>`);
        console.log(post.likeValue);
        let likeBtn = $("<button class = 'btn btn-secondary' id='like'>Like</button>");
        let dislikeBtn = $("<button class = 'btn btn-secondary' id='dislike'>Dislike</button>");
        // var newPostPhoto = $("<img>");
        // newPostPhoto.attr("alt", "User Photo");
        // newPostPhoto.attr("src", post.photo);
        // newPostPhoto.addClass("photo-style");
        var newPostCategory = $("<p>");
        newPostCategory.text("Category: " + post.category);
        newPostCategory.addClass("category-style")
        var newPostCardBody = $("<div>");
        newPostCardBody.addClass("card-body");
        var newPostBody = $("<p>");
        newPostTitle.text(post.title);
        newPostTitle.addClass("title-style");
        newPostBody.text(post.body);
        var formattedDate = new Date(post.createdAt);
        formattedDate = moment(formattedDate).format("MM/DD/YYYY, hh:mm");
        newPostDate.text(formattedDate);
        newPostTitle.append(newPostDate);
        newPostTitle.append(likeValue);
        // newPostTitle.append(dislikeBtn);
        // newPostTitle.append(likeBtn);
        newPostCardHeading.append(newPostTitle);
        newPostCardHeading.append(newPostCategory);
        newPostCardBody.append(newPostBody);

        // newPostCardBody.append(newPostPhoto);
        newPostCard.append(newPostCardHeading);
        newPostCard.append(newPostCardBody);
        newPostCard.data("post", post);
        return newPostCard;
    }


// ===========================================================
    function handleCategoryChange() {
        var newPostCategory = $(this).val();
        getPosts(newPostCategory);
    }


    function getPosts(category) {
        var categoryString = category || "";
        if (categoryString) {
            categoryString = "/category/" + categoryString;
        }
        $.get("/api/posts" + categoryString, function (data) {
            console.log("Posts", data);
            posts = data;
            if (!posts || !posts.length) {
                displayEmpty();
            } else {
                blog.empty();
                initializeRows();
            }
        });
    }

    function displayEmpty() {
        blog.empty();
        var messageH2 = $("<h2>");
        messageH2.css({"text-align": "center", "margin-top": "50px"});
        messageH2.html("No posts yet for this category, navigate <a href='/members'>here</a> in order to create a new post.");
        blog.append(messageH2);
    }

//============================================================
    let liked = false;
    let disliked = false;

    function like() {
        if (liked) {
            alert("You can't like this again")
        }
        if (!liked) {
            post.likeValue++;
            liked = true;
            disliked = false;
        }
    }

    function dislike() {
        if (!disliked) {
            post.likeValue--;
            disliked = true;
            liked = false;
        }
        if (disliked) {
            alert("You can't dislike this again")
        }
    }

    $("#like").click(like);
    $("#dislike").click(dislike);

});
