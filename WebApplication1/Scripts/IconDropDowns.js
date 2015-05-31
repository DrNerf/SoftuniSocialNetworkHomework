$(document).on("click", "#friend-requests-icon", function () {
    var id = $(this).attr("id");
    var dropdownID = id.replace("icon", "dropdown");
    $("#" + dropdownID).toggle();
});