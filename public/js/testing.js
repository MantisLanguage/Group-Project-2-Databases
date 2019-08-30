$(document).ready(function () {
    getPostData();

    // Getting jQuery references to the post body, title, form, and author select
    var bodyInput = $("#input-message");
    var titleInput = $("#input-title");
    var chatForm = $("#formBody");
    var categorySelect = $("#input-category");
    var blog = $("#posts-html");
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
        };
        console.log(newPost)

        // If we're updating a post run updatePost to update a post
        // Otherwise run submitPost to create a whole new post
        submitPost(newPost);
        //   if (updating) {
        //     newPost.id = postId;
        //     updatePost(newPost);
        //   }
        //   else {
        //     submitPost(newPost);
        //   }
    });

    function submitPost(post) {
        $.post("/api/posts", post, getPostData);
        bodyInput.val("");
        titleInput.val("");
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
        blog.append(postsToAdd);
    }

    function createNewRow(post) {
        var newPostCard = $("<div>");
        newPostCard.addClass("card");
        var newPostCardHeading = $("<div>");
        newPostCardHeading.addClass("card-header");
        var newPostTitle = $("<h2>");
        var newPostCategory = $("<h5>");
        newPostCategory.text(post.category);
        newPostCategory.css({
            float: "right",
            "font-weight": "700",
            "margin-top":
                "-15px"
        });
        var newPostCardBody = $("<div>");
        newPostCardBody.addClass("card-body");
        var newPostBody = $("<p>");
        newPostTitle.text(post.title + " ");
        newPostBody.text(post.body);
        newPostCardHeading.append(newPostTitle);
        newPostCardHeading.append(newPostCategory);
        newPostCardBody.append(newPostBody);
        newPostCard.append(newPostCardHeading);
        newPostCard.append(newPostCardBody);
        newPostCard.data("post", post);
        return newPostCard;
    }
});