# Autojs层次定位

# TODO：实际上两个子控件向上遍历所有父节点，找到相同的最近节点就行（从相同的根节点反向查找，找到第一个对应不上的），这样可以大大提高效率。

*（实现方法可能有点蠢，虽然我已经仔细读过http://doc.autoxjs.com/#/widgetsBasedAutomation 中提供的所有函数了，递归搜索代码也写的比较烂，欢迎指正）*

## 开发需求

​		Android的控件需要通过[UiSelector](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselector)定位，然后即可以对其模拟真人操作，如点击。而有时候，需要点击的按键无法通过[UiSelector](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselector)的属性定位（如控件的文字是用图像表示的），这时候就可以借助某个与目标控件接近的，能通过[UiSelector](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselector)定位的控件，**通过布局层次关系来定位**。

​		如下图，“去领取”按键是图像，不能通过[UiSelector](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselector)定位，但是附近的“累计任务奖励”控件能通过text属性找到的控件。

![](img/0.png)

​		**如果能通过层次关系，通过“累计任务奖励”定位到“去领取”就好了。**

​		这就是本项目的目的。



## 使用方法

​		调用[autojs_layerLocate.js](autojs_layerLocate.js)中的layerLocate函数，第一个输入是“能通过[UiSelector](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselector)定位的控件”（[UiObject](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiobject)类的对象），第二个输入是描述目标控件的[UiSelector](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselector)对象。log会输出两者之间的`parent() child()`关系，将这个关系接在“能通过[UiSelector](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselector)定位的控件”的后面，即可定位到目标控件。



## 使用案例

1. 完成前是可以通过text属性定位的，先找到两个控件之间的关系。
   ![](img\1.png)

   ```js
   var layerUiObject = textContains("累计任务奖励").findOne(); // 必须findOne得到的才是UiObject，UiCollection没有parent和child。
   var layerUiSelector = textMatches("完成2次");
   
   layerLocate(layerUiObject, layerUiSelector); 
   ```

   控制台会输出：

   ```js
   在输入的控件后加上：
   .parent().child(2).child(1).child(0)
   即可定位到满足条件的目标控件。
   ```

   将输入的`layerUiObject`和输出拼接，得到：

   ```js
   textContains("累计任务奖励").findOne().parent().child(2).child(1).child(0)
   ```

   这样定位到的就是目标控件。

   

2. 如果我们能知道目标控件的bound（在整个屏幕中的位置参数，详见[UiSelector.bounds](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselectorboundsleft-top-right-buttom)，控制台输出指的是`boundsInScreen`属性），如果控件没有child（暂时不支持所有控件搜索），也可以作为[UiSelector](http://doc.autoxjs.com/#/widgetsBasedAutomation?id=uiselector)参数。

   上图的目标控件的`boundsInScreen`为`Rect(442, 896 - 585, 992)`，搜索代码变为：

   ```js
   var layerUiObject = textContains("累计任务奖励").findOne(); // 必须findOne得到的才是UiObject，UiCollection没有parent和child。
   var layerUiSelector = bounds(442, 896 , 585, 990);
   layerLocate(layerUiObject, layerUiSelector);
   ```

   得到的结果是相同的。

   

## TODO

​		目前代码只搜索没有`child`的控件（末端控件），不知道搜索中间的控件有没有必要，目前已经想到了实现方案。
