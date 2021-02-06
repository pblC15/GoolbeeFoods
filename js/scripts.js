$(document).ready(function() {
    $('#button-menu').click(function() {

        $('#submenu').toggleClass('ds_none');
        $(this).toggleClass('button-obj_active')
    });
});