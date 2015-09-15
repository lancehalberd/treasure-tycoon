var cb = {};

cb.Panel = function (title) {
    var self = this;
    self.$contentFrame = $tag('div', 'contentFrame');
    self.$content = $tag('div', 'content');
    self.$hBox = $tag('div', 'scrollBox');
    self.$vBox = $tag('div', 'scrollBox');
    var $panel = $tag('div', 'panel')
            .css('position', 'absolute')//force absolute here since draggable will make relative otherwise
            .css('z-index', '0')//set z-index to keep resize handle from showing through from other panels
            .append($tag('div', 'dragHandle title').text(title))
            .append(self.$contentFrame.append(self.$content))
            .append($tag('div', 'verticalScrollBar').append(self.$vBox))
            .append($tag('div', 'horizontalScrollBar').append(self.$hBox))
            .append($tag('div', 'resizeHandle'));

    var mouseX, mouseY, dragging = false;
    $panel.on('mousedown', '.dragHandle', function (event) {
        dragging = true;
        mouseX = event.screenX - $panel.offset().left;
        mouseY = event.screenY - $panel.offset().top;
    });

    $(document).on('mousemove', function (event) {
        if (!dragging) {
            return;
        }
        var targetX = Math.max(0, event.screenX - mouseX);
        var targetY = Math.max(0, event.screenY - mouseY);

        $panel.offset({left: targetX, top :targetY});
    });

    $(document).on('mouseup', function (event) {
        dragging = false;
    });


    //$panel.draggable({'handle': '.dragHandle', 'containment': 'parent'});
    $panel.resizable({
        'handles': 'se', 'minWidth': 116, 'minHeight': 132,
        'resize' : function (event, ui) {
            self.refreshScrollBars();
        }
    });
    self.$hBox.draggable({
        'containment': 'parent',
        drag: function( event, ui ) {
            var windowWidth = self.$contentFrame.outerWidth();
            self.contentX = Math.floor(self.contentWidth * self.$hBox.position().left / windowWidth);
            self.contentX = Math.min(self.contentX, self.contentWidth - windowWidth);
            self.updateContent();
        },
        stop: function (event, ui) {
            self.refreshScrollBars();
        }
    });
    self.$vBox.draggable({
        'containment': 'parent',
        drag: function( event, ui ) {
            var windowHeight = self.$contentFrame.outerHeight();
            self.contentY = Math.floor(self.contentHeight * self.$vBox.position().top / windowHeight);
            self.contentY = Math.min(self.contentY, self.contentHeight - windowHeight);
            self.updateContent();
        },
        stop: function (event, ui) {
            self.refreshScrollBars();
        }
    });
    self.$hBox.hide();
    self.$vBox.hide();
    self.updateContent = function () {
        if (self.useStandardScrolling) {
            self.$content.css('left', -self.contentX + 'px');
            self.$content.css('top', -self.contentY + 'px');
        }
    };

    self.clollapsed = false;
    var openHeight = 0;
    self.toggle = function () {
        self.collapsed = !self.collapsed;
        if (self.collapsed) {
            $panel.children().hide();
            $panel.find('.dragHandle').show();
            openHeight = $panel.outerHeight();
            $panel.outerHeight(16);
        } else {
            $panel.outerHeight(openHeight);
            $panel.children().show();
        }
    };
    $panel.on('dblclick', '.dragHandle', self.toggle);

    function deactivate(event) {
        if ($(event.target).closest($panel).length > 0) {
            return;
        }
        self.active = false;
        $(document).off('mousedown', deactivate);
    }
    function activate(event) {
        if (self.active) {
            return;
        }
        var lastIndex = $panel.parent().data('lastIndex');
        lastIndex = lastIndex ? lastIndex + 1 : 1;
        self.active = true;
        $panel.css('z-index', lastIndex);
        $panel.parent().data('lastIndex', lastIndex);
        $(document).on('mousedown', deactivate);
    }
    //push panel on top when the user interacts with it
    $panel.on('mousedown', activate);
    //converts a page x,y to content x,y
    self.contentPosition = function (point) {
        return [point.x - self.$content.offset().left, point.y - self.$content.offset().top];
    };
    self.isMouseOver = function (mouse) {
        var relativePoint = self.contentPosition(mouse);
        return inRect(relativePoint[0], relativePoint[1], 0, 0, self.$contentFrame.outerWidth(), self.$contentFrame.outerHeight())
    }
    self.contentWidth = 1000;
    self.contentHeight = 1000;
    self.contentX = 0;
    self.contentY = 0;
    self.useStandardScrolling = true;

    self.refreshScrollBars = function () {
        var windowWidth = self.$contentFrame.outerWidth();
        if (self.contentWidth > windowWidth) {
            var barSize = Math.floor(windowWidth * windowWidth / self.contentWidth);
            var left = Math.ceil(windowWidth * self.contentX / self.contentWidth);
            left = Math.min(left, windowWidth - barSize);
            self.$hBox.show().css('width', barSize + 'px').css('left', left + 'px');
            self.contentX = Math.max(0, Math.min(self.contentX, self.contentWidth - windowWidth));
        } else {
            self.$hBox.hide();
            self.contentX = 0;
        }
        var windowHeight = self.$contentFrame.outerHeight();
        if (self.contentHeight > windowHeight) {
            var barSize = Math.floor(windowHeight * windowHeight / self.contentHeight);
            var top = Math.ceil(windowHeight * self.contentY / self.contentHeight);
            top = Math.min(top, windowHeight - barSize);
            self.$vBox.show().css('height', barSize + 'px').css('top', top + 'px');
            self.contentY = Math.max(0, Math.min(self.contentY, self.contentHeight - windowHeight));
        } else {
            self.$vBox.hide();
            self.contentY = 0;
        }
        self.updateContent();
    };

    self.scrollVertical = function (pixels) {
        var windowHeight = self.$contentFrame.outerHeight();
        self.contentY = Math.max(0, Math.min(self.contentY + pixels, self.contentHeight - windowHeight));
        self.refreshScrollBars();
    };
    self.scrollHorizontal = function (pixels) {
        var windowWidth = self.$contentFrame.outerWidth();
        self.contentX = Math.max(0, Math.min(self.contentX + pixels, self.contentWidth - windowWidth));
        self.refreshScrollBars();
    };

    self.active = false;
    self.$ = $panel;
};