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
        newPostTitle.addClass("title-style")
        newPostBody.text(post.body);
        var formattedDate = new Date(post.createdAt);
        formattedDate = moment(formattedDate).format("MM/DD/YYYY, hh:mm");
        newPostDate.text(formattedDate);
        newPostTitle.append(newPostDate);
        newPostCardHeading.append(newPostTitle);
        newPostCardHeading.append(newPostCategory);
        newPostCardBody.append(newPostBody);
        // newPostCardBody.append(newPostPhoto);
        newPostCard.append(newPostCardHeading);
        newPostCard.append(newPostCardBody);
        newPostCard.data("post", post);
        return newPostCard;
    }
});