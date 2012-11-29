/*
 * @author wangxiao
 * @email  1988wangxiao@gmail.com
 */

/**
 * @description 简单的拖拽方法
 * @function 
 * @name baidu.plugin._util_.drag
 * @grammar baidu.plugin._util_.drag(selector)
 * @param {Selector|TangramDom|htmlElement} selector css选择器字符串、HTML字符串，或者页面Dom元素，只对第一个匹配元素操作
 * @return {Object} 返回相关实例方法的对象
 * @example 
 执行函数会立刻绑定“mousemove”事件，鼠标移动即会产生拖拽效果，
 当拖拽开始时触发“dragstart”事件，当拖拽时触发“dragging”，当拖拽结束时触发“dragend”。
*/

/**
 * @description 获得当前拖拽元素
 * @name baidu.plugin._util_.drag().ele
 * @grammar baidu.plugin._util_.drag(selector).ele
 * @return {TangramDom} 当前拖拽元素的tangramDom对象
 * @example 
 直接返回一个tangramDom对象，可以直接链式操作。
*/

/**
 * @description 停止拖拽
 * @function 
 * @name baidu.plugin._util_.drag().disable()
 * @grammar baidu.plugin._util_.drag(selector).disable()
 * @param {Null}
 * @return {Null}
 * @example 
 执行drag实例的disable()方法，会立刻停止拖拽效果。
*/

/**
 * @description 激活拖拽
 * @function 
 * @name baidu.plugin._util_.drag().enable()
 * @grammar baidu.plugin._util_.drag(selector).enable()
 * @param {Null}
 * @return {Null}
 * @example 
 执行drag实例的enable()方法，会立刻执行之前的拖拽效果。
 */

/**
 * @description 取消拖拽，匹配元素回到之前位置
 * @function 
 * @name baidu.plugin._util_.drag().cancel()
 * @grammar baidu.plugin._util_.drag(selector).cancel()
 * @param {Null}
 * @return {Null}
 * @example 
 执行drag实例的cancel()方法，设置拖拽元素回到起始的位置。
 */

/**
 * @description 获取当前限制拖拽范围
 * @function 
 * @name baidu.plugin._util_.drag().range()
 * @grammar baidu.plugin._util_.drag(selector).range()
 * @param {Null}
 * @return {String|Object} 返回当前限制拖拽的范围
 */

/**
 * @description 限制拖拽范围
 * @function 
 * @name baidu.plugin._util_.drag().range()
 * @grammar baidu.plugin._util_.drag(selector).(selector)
 * @param {String|HTMLString|HTMLElement} selector 限定在selector匹配的元素内，如果是多个匹配第一个。
 * @return {Null}
 */

/**
 * @description 限制拖拽范围
 * @function 
 * @name baidu.plugin._util_.drag().range()
 * @grammar baidu.plugin._util_.drag(selector).(top,right,bottom,left)
 * @param {Number} top 距离屏幕上方的距离
 * @param {Number} right 距离屏幕左方最大可移动到的距离
 * @param {Number} bottom 距离屏幕上方最大可移动到的距离
 * @param {Number} left 距离屏幕左侧的距离
 * @return {Null}
 */

///import baidu;
///import baidu.dom;
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.dom.eq;
///import baidu.dom.trigger;
///import baidu.dom.css;
///import baidu.dom.width;
///import baidu.dom.height;
///import baidu.dom.offset;
///import plugin._util_;

baidu.plugin._util_.drag = function(selector){

    var timer,

        doc = baidu.dom(document),

        //只对第一个值操作
        ele = baidu.dom(selector).eq(0),

        //拖拽前的offset值
        _o = ele.offset(),

        //相对宽度和高度
        _w,_h,

        //限定拖动范围，如果有值，则为 {top:,right:,bottom:,left:}
        _range,

        //跟随鼠标移动
        move = function(ele,x,y){
            if(_range){

                //优化超速移动鼠标的变态情况，兼容有border的情况完美展现
                if(x<_range.left){
                    x = _range.left;
                }else if( (x + _range.w + _range.bW + _range.bW) > _range.right ){
                    x = _range.right - _range.w - _range.bW - _range.bW;
                };
                if(y<_range.top){
                    y = _range.top;
                }else if( (y + _range.h + _range.bW + _range.bW) > _range.bottom ){
                    y = _range.bottom - _range.h - _range.bW - _range.bW;
                };
            };

            //相对屏幕设置位置
            ele.offset({'left':x,'top':y});

            //对全局派发事件
            doc.trigger('dragging');
        },

        handle = function(e){

            //增加函数节流，防止事件频繁触发函数，影响性能
            clearTimeout(timer);
            timer = setTimeout(function(){
                var o = ele.offset();
                if(!_w){_w = e.pageX - o.left;};
                if(!_h){_h = e.pageY - o.top;};
                var x = e.pageX - _w,
                    y = e.pageY - _h;
                move(ele,x,y);
            },3);
        },

        unselect = function (e) {
            return e.preventDefault();
        };

    doc.on('mousemove',handle);

    //修正拖曳过程中页面里的文字会被选中
    doc.on('selectstart',unselect);

    doc.trigger('dragstart',{target:ele});

    return {
        target:ele,
        disable:function(){
            doc.trigger('dragend');
            _w = _h = null;
            doc.off('mousemove',handle);
            doc.off('selectstart',unselect);
        },
        enable:function(){
            doc.trigger('dragstart');
            doc.on('selectstart',unselect);
            doc.on('mousemove',handle);
        },
        range:function(value,value2,value3,value4){
            switch(arguments.length){
                
                //get方法
                case 0:
                    return _range;
                break;

                //传入selector
                case 1:
                    var _ele = baidu.dom(value).eq(0),
                        borderWidth = Number(_ele.css('border-width').replace('px',''));
                    _range = _ele.offset();
                    _range.left = _range.left + borderWidth;
                    _range.top = _range.top + borderWidth;
                    _range.right = _range.left + _ele.width();
                    _range.bottom = _range.top + _ele.height();
                break;

                //传入top,right,bottom,left
                case 4:
                    _range = {'top':value,'right':value2,'bottom':value3,'left':value4};
                break;
            };

            //元素自身的宽和高
            _range.w = ele.width();
            _range.h = ele.height();
            _range.bW = Number(ele.css('border-width').replace('px',''));
        },
        cancel:function(){
            ele.offset({'left':_o.left,'top':_o.top});
        }
    }
};