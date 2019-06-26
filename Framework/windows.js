            var _moveEvent, offsetX = 0, offsetY = 0, isScroll = false, locked = false, x, y
            const gap = 6
            var desktop
            var min_window_width = 200, min_window_height = 200
            const act = {
                left: 1,
                left_top: 2,
                left_bottom: 3,
                right: 4,
                right_top: 5,
                right_bottom: 6,
                top: 7,
                bottom: 8,
                move: 9,
                none: 0
            }
            var desktop_width, desktop_height
            var action = act.none
            $(document).ready(() => {
                desktop = document.body
                $(desktop).mousedown(ev => Engage(ev))
                $(desktop).mouseup(ev => Disengage(ev))
                $(desktop).height(screen.height).width(screen.width)
                desktop_width = $(desktop).width()
                desktop_height = $(desktop).height()
                $(".client").each((index, elem) => Add(elem))
                $(document).mousemove(move_mouse)
            })
            $(document).scroll(e => {
                let diffX = window.pageXOffset - offsetX
                let diffY = window.pageYOffset - offsetY
                offsetX = window.pageXOffset
                offsetY = window.pageYOffset
                _moveEvent.pageX += diffX
                _moveEvent.pageY += diffY
                move_mouse(_moveEvent, false)
            })
            function move_window(_wdata, left, top, width, height){
                if(left != 0){
                    _wdata.left += left
                    $(_wdata.element).css("left", _wdata.left)
                }
                if(top != 0){
                    _wdata.top += top
                    $(_wdata.element).css("top", _wdata.top)
                }
                if(width != 0){
                    _wdata.width += width
                    $(_wdata.element).css("width", _wdata.width)
                }
                if(height != 0){
                    _wdata.height += height
                    $(_wdata.element).css("height", _wdata.height)
                    $(_wdata.element).find(".client").css("height", _wdata.height - 32);
                }
            }
            var xBlocked, yBlocked
            function move_mouse(e, read = true){
                if(read) _moveEvent = e
                if(engaged && action != act.none && !locked && mouseon != null){
                    let _wdata = windows[mouseon], new_width, new_height, diffX, diffY, neg
                    switch(action){
                        case act.move:
                            diffX = e.pageX - _wdata.left - x
                            diffY = e.pageY - _wdata.top - y
                            move_window(_wdata, diffX, diffY, 0, 0)
                            break
                        case act.right:
                            diffX = e.pageX - (_wdata.left + _wdata.width)
                            new_width = _wdata.width + diffX
                            if(new_width >= min_window_width && new_width <= desktop_width){
                                xBlocked = false
                                move_window(_wdata, 0, 0, diffX, 0)
                            }
                            else{
                                if(!xBlocked){
                                    xBlocked = true
                                    move_window(_wdata, 0, 0, (new_width > desktop_width ? desktop_width : min_window_width) - _wdata.width, 0)
                                }
                            }
                            break
                        case act.left:
                            diffX = e.pageX - _wdata.left
                            neg = diffX * -1
                            new_width = _wdata.width + neg
                            if(new_width >= min_window_width && new_width <= desktop_width){
                                xBlocked = false
                                move_window(_wdata, diffX, 0, neg, 0)
                            }
                            else{
                                if(!xBlocked){
                                    xBlocked = true
                                    diffX = _wdata.width - (new_width > desktop_width ? desktop_width : min_window_width)
                                    move_window(_wdata, diffX, 0, diffX * -1, 0)
                                }
                            }
                            break
                        case act.bottom:
                            diffY = e.pageY - (_wdata.top + _wdata.height)
                            new_height = _wdata.height + diffY
                            if(new_height >= min_window_height && new_height <= desktop_height){
                                yBlocked = false
                                move_window(_wdata, 0, 0, 0, diffY)
                            }
                            else{
                                if(!yBlocked){
                                    yBlocked = true
                                    move_window(_wdata, 0, 0, 0, (new_height > desktop_height ? desktop_height : min_window_height) - _wdata.height)
                                }
                            }
                            break
                        case act.top:
                            diffY = e.pageY - _wdata.top
                            neg = diffY * -1
                            new_height = _wdata.height + neg
                            if(new_height >= min_window_height && new_height <= desktop_height){
                                yBlocked = false
                                move_window(_wdata, 0, diffY, 0, neg)
                            }
                            else{
                                if(!yBlocked){
                                    yBlocked = true
                                    diffY = _wdata.height - (new_height > desktop_height ? desktop_height : min_window_height)
                                    move_window(_wdata, 0, diffY, 0, diffY * -1)
                                }
                            }
                            break
                        case act.left_top:
                            diffX = e.pageX - _wdata.left
                            neg = diffX * -1
                            new_width = _wdata.width + neg
                            if(new_width >= min_window_width && new_width <= desktop_width)
                                xBlocked = false
                            else
                            {
                                if(!xBlocked){
                                    xBlocked = true
                                    diffX = _wdata.width - (new_width > desktop_width ? desktop_width : min_window_width)
                                    neg = diffX * -1
                                }
                                else
                                {
                                    diffX = 0
                                    neg = 0
                                }
                            }
                            diffY = e.pageY - _wdata.top
                            let neg2 = diffY * -1
                            new_height = _wdata.height + neg2
                            if(new_height >= min_window_height && new_height <= desktop_height)
                                yBlocked = false
                            else
                                {
                                    if(!yBlocked){
                                        yBlocked = true
                                        diffY = _wdata.height - (new_height > desktop_height ? desktop_height : min_window_height)
                                        neg2 = diffY * -1
                                    }
                                    else{
                                        diffY = 0
                                        neg2 = 0
                                    }
                                }
                            move_window(_wdata, diffX, diffY, neg, neg2)
                            break
                        case act.left_bottom:
                            diffX = e.pageX - _wdata.left
                            neg = diffX * -1
                            new_width = _wdata.width + neg
                            if(new_width >= min_window_width && new_width <= desktop_width)
                                xBlocked = false
                            else
                                {
                                    if(!xBlocked){
                                        xBlocked = true
                                        diffX = _wdata.width - (new_width > desktop_width ? desktop_width : min_window_width)
                                        neg = diffX * -1
                                    }
                                    else{
                                        diffX = 0
                                        neg = 0
                                    }
                                }
                            diffY = e.pageY - (_wdata.top + _wdata.height)
                            new_height = _wdata.height + diffY
                            if(new_height >= min_window_height && new_height <= desktop_height)
                                yBlocked = false
                            else
                                {
                                    if(!yBlocked){
                                        yBlocked = true
                                        diffY = (new_height > desktop_height ? desktop_height : min_window_height) - _wdata.height
                                    }
                                    else
                                        diffY = 0
                                }
                            move_window(_wdata, diffX, 0, neg, diffY)
                            break
                        case act.right_top:
                            diffX = e.pageX - (_wdata.left + _wdata.width)
                            new_width = _wdata.width + diffX
                            if(new_width >= min_window_width && new_width <= desktop_width)
                                xBlocked = false
                            else
                                {
                                    if(!xBlocked){
                                        xBlocked = true
                                        diffX = (new_width > desktop_width ? desktop_width : min_window_width) - _wdata.width
                                    }
                                    else
                                        diffX = 0
                                }
                            diffY = e.pageY - _wdata.top
                            neg = diffY * -1
                            new_height = _wdata.height + neg
                            if(new_height >= min_window_height && new_height <= desktop_height)
                                yBlocked = false
                            else
                                {
                                    if(!yBlocked){
                                        yBlocked = true
                                        diffY = _wdata.height - (new_height > desktop_height ? desktop_height : min_window_height)
                                        neg = diffY * -1
                                    }
                                    else{
                                        diffY = 0
                                        neg = 0
                                    }
                                }
                            move_window(_wdata, 0, diffY, diffX, neg)
                            break
                        case act.right_bottom:
                            diffX = e.pageX - (_wdata.left + _wdata.width)
                            new_width = _wdata.width + diffX
                            if(new_width >= min_window_width && new_width <= desktop_width)
                                xBlocked = false
                            else
                                {
                                    if(!xBlocked){
                                        xBlocked = true
                                        diffX = (new_width > desktop_width ? desktop_width : min_window_width) - _wdata.width
                                    }
                                    else
                                        diffX = 0
                                }
                            diffY = e.pageY - (_wdata.top + _wdata.height)
                            new_height = _wdata.height + diffY
                            if(new_height >= min_window_height && new_height <= desktop_height)
                                yBlocked = false
                            else
                                {
                                    if(!yBlocked){
                                        yBlocked = true
                                        diffY = (new_height > desktop_height ? desktop_height : min_window_height) - _wdata.height
                                    }
                                    else
                                        diffY = 0
                                }
                            move_window(_wdata, 0, 0, diffX, diffY)
                            break
                    }
                }
                else if(mouseon != null && !locked){
                    let _wdata = windows[mouseon]
                    let bottom = _wdata.top + _wdata.height
                    let right = _wdata.left + _wdata.width
                    if(_wdata != null){
                        if(e.pageX >= _wdata.left && e.pageX <= _wdata.left + gap){
                            x = e.pageX - _wdata.left
                            y = e.pageY - _wdata.top
                            if(e.pageY >= _wdata.top && e.pageY <= _wdata.top + gap){
                                // left - top
                                $(desktop).css("cursor","nwse-resize")
                                action = act.left_top
                            }
                            else if(e.pageY <= bottom && e.pageY >= bottom - gap){
                                // left - bottom
                                $(desktop).css("cursor","nesw-resize")
                                action = act.left_bottom
                            }
                            else{
                                // left
                                $(desktop).css("cursor","ew-resize")
                                action = act.left
                            }
                        }
                        else if(e.pageX <= right && e.pageX >= right - gap){
                            x = e.pageX - _wdata.left
                            y = e.pageY - _wdata.top
                            if(e.pageY >= _wdata.top && e.pageY <= _wdata.top + gap){
                                // right - top
                                $(desktop).css("cursor","nesw-resize")
                                action = act.right_top
                            }
                            else if(e.pageY <= bottom && e.pageY >= bottom - gap){
                                // right - bottom
                                $(desktop).css("cursor","nwse-resize")
                                action = act.right_bottom
                            }
                            else{
                                // right
                                $(desktop).css("cursor","ew-resize")
                                action = act.right
                            }
                        }
                        else if(e.pageY >= _wdata.top && e.pageY <= _wdata.top + 30){
                            x = e.pageX - _wdata.left
                            y = e.pageY - _wdata.top
                            if(e.pageY <= _wdata.top + gap){
                                // top
                                $(desktop).css("cursor","ns-resize")
                                action = act.top
                            }
                            else{
                                // move
                                $(desktop).css("cursor","default")
                                if(closebtn || fsbtn){
                                    action = act.none
                                    if(engaged)
                                        locked = true
                                }
                                else
                                    action = act.move
                            }
                        }
                        else if(e.pageY <= bottom && e.pageY >= bottom - gap){
                            x = e.pageX - _wdata.left
                            y = e.pageY - _wdata.top
                            // bottom
                            $(desktop).css("cursor","ns-resize")
                            action = act.bottom
                        }
                        else{
                            // else
                            $(desktop).css("cursor","default")
                            action = act.none
                            if(engaged)
                                locked = true;
                        }
                    }
                }
            }
            var template = $('<div onmousedown="ActivateWindow(this)" onmouseover="CatchMouse(this)" onmouseout="LoseMouse(this)" class="window"></div>').append(
                '<div class="titlebar">'+
                    '<span onclick="CloseWindow(this)" onmouseover="CloseHover(this)" onmouseout="CloseOut(this)" class="menu"><i class="material-icons">close</i></span>'+
                    '<span onclick="ToggleFullScreen(this)" onmouseover="fScreenHover(this)" onmouseout="fScreenOut(this)" class="menu"><i class="material-icons">fullscreen</i></span>'+
                '</div>')
            function Window(_element, _top, _left, _width, _height){
                this.element = _element
                this.top = _top
                this.left = _left
                this.width = _width
                this.height = _height
                this.z = GetTopZIndex()
                this.Init = function(){
                    $(this.element).css({"top":this.top, "left":this.left, "width":this.width, "height":this.height, "z-index":this.z, "cursor": "inherit"})
                    $(this.element).find(".client").first().css("height", this.height - 32)
                    $(this.element).on("contextmenu", DisableContext)
                }
            }
            function trythis(){
                alert("trythis")
            }
            var activeId = null
            var mouseon = null
            var mouseover = null
            var mouseon_remove = null
            var engaged = false
            var windows = {}
            var fullscreen_window = null
            var fs_prev_top, fs_prev_left, fs_prev_width, fs_prev_height
            var closebg, fscreenbg, closebtn = false, fsbtn = false, engbtn = 0
            function CloseHover(el){
                closebtn = true
                if(!engaged || engbtn == 1 && action == act.none){
                    closebg = el.style.backgroundColor
                    el.style.backgroundColor = "rgba(255,0,0,0.7)"
                }
            }
            function CloseOut(el){
                closebtn = false
                el.style.backgroundColor = closebg
            }
            function fScreenHover(el){
                fsbtn = true
                if(!engaged || engbtn == 2 && action == act.none){
                    fscreenbg = el.style.backgroundColor
                    el.style.backgroundColor = "rgb(178,178,178)"
                }
            }
            function fScreenOut(el){
                fsbtn = false
                el.style.backgroundColor = fscreenbg
            }
            function DisableContext(){
                return false
            }
            function Add(client){
                let newtemp = $(template).clone();
                let top = $(client).data("top") || 50
                let left = $(client).data("left") || 50
                let width = $(client).data("width") || 600
                let height = $(client).data("height") || 400
                if(width < min_window_width)
                    width = min_window_width
                else if(width > desktop_width)
                    width = desktop_width
                if(height < min_window_height)
                    height = min_window_height
                else if(height > desktop_height)
                    height = desktop_height
                let id = GetAvailWindowId()
                $(newtemp).attr("id", id)
                $(newtemp).append(client);
                $(newtemp).appendTo($(desktop));
                windows[id] = new Window(document.getElementById(id), top, left, width, height)
                windows[id].Init()
                activeId = id
            }
            function CatchMouse(e){
                mouseover = $(e).attr("id")
                if(!engaged)
                    mouseon = mouseover
            }
            function LoseMouse(e){
                mouseover = null
                let checker = $(e).attr("id")
                if(!engaged){
                    if(mouseon == checker){
                        mouseon = null
                        $(desktop).css("cursor","default")
                        action = act.none
                    }
                }
                else
                    if(mouseon == checker)
                        mouseon_remove = mouseon
            }
            function Engage(e){
                if(e.button == 0){
                    engaged = true;
                    if(closebtn)
                        engbtn = 1
                    else if(fsbtn)
                        engbtn = 2
                        else engbtn = 0
                }
            }
            function Disengage(e){
                if(e.button == 0){
                    engaged = false;
                    locked = false;
                    if(mouseon_remove == mouseon && mouseon_remove != mouseover){
                        mouseon = null
                        action = act.none
                        $(desktop).css("cursor","default")
                    }
                    mouseon_remove = null
                }
            }
            function GetAvailWindowId(){
                _id = 1
                for(id in windows){
                    if(id != _id)
                        return _id;
                    _id++
                }
                return _id;
            }
            function GetTopZIndex(){
                let index = 1, z
                for(id in windows){
                    z = windows[id].z
                    if(z >= index){
                        index = z
                        index++
                    }
                }
                return index
            }
            async function ActivateWindow(_window){
                let id = $(_window).attr("id")
                if(activeId == id)
                    return
                let z = GetTopZIndex()
                windows[id].z = z
                $(_window).css("z-index", z)
                activeId = id
                if(windows[activeId].z - Object.keys(windows).length > 100)
                    await OrderZAsync()
            }
            function OrderZAsync(){
                let count = 1, minZ, _id, z, up, _wdata
                return new Promise(resolve => {
                    do{
                        _id = null
                        up = count - 1
                        minZ = windows[activeId].z
                        for(id in windows){
                            z = windows[id].z
                            if(z > up && z <= minZ){
                                minZ = z
                                _id = id
                            }
                        }
                        if(_id != null){
                            _wdata = windows[_id]
                            if(_wdata.z != count){
                                _wdata.z = count
                                $(_wdata.element).css("z-index", count)
                            }
                            count++
                        }
                    } while(_id != null)
                })
            }

            function CloseWindow(_window_btn){
                if(action != act.none){
                    $(desktop).css("cursor","default")
                    action = act.none
                }
                closebtn = false
                let _window = $(_window_btn).parents(".window")
                delete windows[$(_window).attr("id")]
                if(mouseon == $(_window).attr("id"))
                    mouseon = null
                _window.remove()
            }
            function ToggleFullScreen(_window_btn){
                if(fullscreen_window == null){
                    fullscreen_window = $(_window_btn).parents(".window")
                    $(fullscreen_window).css("border","none")
                    fs_prev_left = $(fullscreen_window).css("left")
                    $(fullscreen_window).css("left", 0)
                    fs_prev_top = $(fullscreen_window).css("top")
                    $(fullscreen_window).css("top", 0)
                    fs_prev_height = $(fullscreen_window).height()
                    $(fullscreen_window).height(screen.height)
                    fs_prev_width = $(fullscreen_window).width()
                    $(fullscreen_window).width(screen.width)
                    $(fullscreen_window).find(".client").height($(fullscreen_window).height() - 32);
                }
                else{
                    $(fullscreen_window).css("border","1px solid rgba(0,0,0,0.35)")
                    $(fullscreen_window).css("left", fs_prev_left)
                    $(fullscreen_window).css("top", fs_prev_top)
                    $(fullscreen_window).height(fs_prev_height)
                    $(fullscreen_window).width(fs_prev_width)
                    $(fullscreen_window).find(".client").height($(fullscreen_window).height() - 32);
                    fullscreen_window = null
                }
            }