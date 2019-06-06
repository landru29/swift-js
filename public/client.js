$(function () {
    
    const tabInit = {};
    let tabs = [];
    const markers = {};

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'upload/',
        autoUpload: true,
    });

    $.get('/albums', function(data, status) {
        $('#albums').html('<ul id="album-list"></ul>');
        data.forEach((name, index) => {
            $('#album-list').append('<li><a href="#tabs-' + (index+1) + '">' + name.charAt(0).toUpperCase() + name.slice(1) + '</a></li>');
            $('#albums').append('<div id="tabs-' + (index+1) + '"><ul class="thumb-list"></ul></div>');

            $('#tabs-' + (index+1)).append('<button type="button" class="btn btn-default home"><i class="glyphicon glyphicon-fast-backward" aria-hidden="true"></i></button>');
            $('#tabs-' + (index+1) + '>button.home').click(function() {
                const tabName = tabs[index];
                markers[tabName] = undefined;
                initTab(index, true);
            });

            $('#tabs-' + (index+1)).append('&nbsp;');
            
            $('#tabs-' + (index+1)).append('<button type="button" class="btn btn-default next"><i class="glyphicon glyphicon-play" aria-hidden="true"></i></button>');
            $('#tabs-' + (index+1) + '>button.next').click(function() {
                initTab(index, true);
            })
            
            tabInit[name] = false;
        });
        tabs = data;
        $('#albums').tabs({
            activate: function(event,ui) {
                initTab(ui.newTab.index())
             }
        });
        initTab(0);
    });


    function initTab(index, force) {
        const tabName = tabs[index];
        if (!tabInit[tabName] || force) {
            const query = ['limit=40'];
            if (markers[tabName]) {
                query.push('marker=' + encodeURIComponent(markers[tabName]));
            }
            $.get('/albums/' + tabName + '?' + query.join('&'), function(data, status) {
                $('#tabs-' + (index+1) + '>ul').html('');
                data.forEach(function (file) {
                    $('#tabs-' + (index+1) + '>ul').append('<li><a href="' + file.file + '" target="blank"><img src="' + file.thumb + '"></a><button class="btn btn-info close" type="button"><i class="glyphicon glyphicon-remove" aria-hidden="true"></i></button></li>');
                    $('#tabs-' + (index+1) + ' ul li:last-child button.close').click(function() {
                        console.log('delete', file);
                        $.ajax({
                            url: 'albums/' + tabName + '/' + file.filename,
                            type: 'DELETE',
                            success: function(result) {
                                initTab(index, true);
                            }
                        });$.del
                    });
                } );
                if (data.length) {
                    markers[tabName] = data[data.length-1].thumbName;
                }
            })
        }
        tabInit[tabName] = true;
    }


});