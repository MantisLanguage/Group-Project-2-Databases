$(document).ready(function () {
    getPostData();

    // Getting jQuery references to the post body, title, form, and author select
    var bodyInput = $("#input-message");
    var titleInput = $("#input-title");
    var chatForm = $("#formBody");
    var categorySelect = $("#input-category");
    var blog = $("#posts-html");
    var userSearch = $("#userSearch");
    // var photoInput = $("#input-photo");
    var posts;
    var postSearch;
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

        var file = $("#file").prop("files")[0];
        var fd = new FormData();
        fd.append("file", file);
        fd.append("name", $("#name").val())

        fd.append("title", titleInput
            .val()
            .trim());
        fd.append("body", bodyInput
            .val()
            .trim())
        fd.append("category", categorySelect.val());

        // If we're updating a post run updatePost to update a post
        // Otherwise run submitPost to create a whole new post
        $.ajax({
            url: "/api/posts",
            type: "post",
            data: fd,
            contentType: false,
            processData: false
        }).then(getPostData);
        // $.post("/api/posts", fd, getPostData);
        bodyInput.val("");
        titleInput.val("");
        $("#file").val("");
    });

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

    $("#file").on("change", function () {
        readURL(this);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $("#img").attr("src", e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#homeButton").on("click", function (event) {
        event.preventDefault();
        $("#category").val("");
        getPostData();
    });

    $("#searchUser").on("submit", function (event) {
        event.preventDefault();
        var newPostUser = userSearch.val().trim();
        getUserPosts(newPostUser);
    });

    function getUserPosts(user) {
        var userString = user;
        if (userString) {
            userString = "/user/" + userString;
        }
        $.get("/api/posts" + userString, function (data) {
            console.log("Posts", data);
            posts = data;
            if (!posts || !posts.length) {
                displayEmptyUser();
            } else {
                blog.empty();
                initializeRows();
            }
        });
    }

    function displayEmptyUser() {
        blog.empty();
        var messageH2 = $("<h2>");
        messageH2.css({"text-align": "center", "margin-top": "50px"});
        messageH2.html("No posts yet for this user!");
        blog.append(messageH2);
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
        var newPostTitle = $("<h1>");
        var newPostDate = $("<h6>");

        let likeValue = $(`<p id= 'like-style' style="float: right"> ${post.likeValue} </p>`);
        console.log(post.likeValue);
        let likeBtn = $("<button style='float: right' class='btn btn-large' id='like'><i class='fas fa-mug-hot'></i></i></button>");
        $(likeBtn).attr("data-id", post.id);
        $(likeBtn).attr("data-numb", post.likeValue);
        $(likeBtn).attr("data-like", false);
        // let dislikeBtn = $("<button class='btn btn-small' id='dislike'><i class='far fa-thumbs-down'></i></button>");
        // $(dislikeBtn).attr("data-id", post.id);
        // $(dislikeBtn).attr("data-numb", post.likeValue);

        var newPostPhoto = $("<img>");
        newPostPhoto.attr("alt", "User Photo");
        newPostPhoto.attr("src", post.photo);
        newPostPhoto.addClass("photo-style");
        var newPostCategory = $("<p>");
        newPostCategory.text("Category: " + post.category + " | ");
        newPostCategory.addClass("category-style");
        var newPostUser = $("<p>");
        newPostUser.text(" | User: " + post.User.user);
        newPostUser.addClass("user-style");
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
        newPostTitle.append(likeBtn);

        newPostCardHeading.append(newPostTitle);
        newPostCardHeading.append(newPostCategory);
        newPostCardHeading.append(newPostUser);
        newPostCardBody.append(newPostBody);
        newPostCardBody.append(newPostPhoto);
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

//=============================================================================================
    $(document).on("click", "#like", like);
    // $(document).on("click", "#dislike", dislike);

    let liked = $("#like").attr("data-like");


    // let disliked = false;
    function like() {
            let likeValue = $(this).attr("data-numb");
            console.log(likeValue);
            let newLikeValue = parseInt(likeValue);
            let id = $(this).attr("data-id");
        if (!liked) {
            newLikeValue++;
            $.ajax({
                url: "/api/posts/" + id,
                method: "PUT",
                data: {
                    likeValue: newLikeValue
                }
            }).then(function () {
                getPostData();
                liked = true;
            });
        }
        // if (liked) {
        //     newLikeValue--;
        //     $.ajax({
        //         url: "/api/posts/" + id,
        //         method: "PUT",
        //         data: {
        //             likeValue: newLikeValue
        //         }
        //     }).then(function () {
        //         getPostData();
        //         liked = false;
        //     });
        // }
    }


    // function like() {
    //     // console.log($(this).attr("data-id"));
    //     let likeValue = $(this).attr("data-numb");
    //     console.log(likeValue);
    //     let newLikeValue = parseInt(likeValue);
    //     let id = $(this).attr("data-id");
    //     if (liked) {
    //         alert("You can't like this again")
    //     }
    //     if (!liked && !disliked) {
    //         newLikeValue++;
    //         $.ajax({
    //             url: "/api/posts/" + id,
    //             method: "PUT",
    //             data: {
    //                 likeValue: newLikeValue
    //             }
    //         }).then(function () {
    //             getPostData();
    //             liked = true;
    //             disliked = false;
    //         });
    //     }
    //     if (!liked && disliked) {
    //         newLikeValue++;
    //         newLikeValue++;
    //         $.ajax({
    //             url: "/api/posts/" + id,
    //             method: "PUT",
    //             data: {
    //                 likeValue: newLikeValue
    //             }
    //         }).then(function () {
    //             getPostData();
    //             liked = true;
    //             disliked = false;
    //         });
    //     }
    // }

    // function dislike() {
    //     // console.log(this.data-id);
    //     let likeValue = $(this).attr("data-numb");
    //
    //     let newLikeValue = parseInt(likeValue);
    //     console.log(newLikeValue);
    //     let id = $(this).attr("data-id");
    //     if (!disliked && !liked) {
    //         newLikeValue--;
    //         $.ajax({
    //             url: "/api/posts/" + id,
    //             method: "PUT",
    //             data: {
    //                 likeValue: newLikeValue
    //             }
    //         }).then(function () {
    //             getPostData();
    //             disliked = true;
    //             liked = false;
    //
    //         })
    //     }
    //     if (!disliked && liked) {
    //         newLikeValue--;
    //         newLikeValue--;
    //         $.ajax({
    //             url: "/api/posts/" + id,
    //             method: "PUT",
    //             data: {
    //                 likeValue: newLikeValue
    //             }
    //         }).then(function () {
    //             getPostData();
    //             disliked = true;
    //             liked = false;
    //
    //         })
    //     }
    //     if (disliked) {
    //         alert("You can't dislike this again")
    //     }
    // }


})
;
