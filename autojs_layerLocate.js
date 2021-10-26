/**
 * 这是一个用于autojs快速开发的控件定位工具
 * 
 * 输入一个通过text等定位的UiObject类控件，输入一个通过UiSelector描述的目标控件，
 * 可以通过parent和child关系定位到目标控件。（暂时不搜索含有child的控件）
 * 
 * Author: blademaster
 * Date: 2021/10/25 22:33
 * Github: https://github.com/BlademasterQAQ/autojs_layerLocate
 */

// *********************************** demo ***********************************
var layerUiObject = textContains("累计任务奖励").findOne(); // 必须findOne得到的才是UiObject，UiCollection没有parent和child。
var layerUiSelector = textMatches("完成2次");

layerLocate(layerUiObject, layerUiSelector); // 调用层次定位函数进行定位

log(layerUiObject.parent().child(2).child(1).child(0));
// *********************************** demo ***********************************


function layerLocate(layerUiObject, layerUiSelector)
{
    var parent_count = 0;
    var onlySearchLastChild = true;
    var overflag = false;
    while(layerUiObject != null)
    {
        log("第" + parent_count + "个parent");
        
        var childLocal_array = new Array();

        var overflag = childSearch(layerUiObject, childLocal_array, layerUiSelector, onlySearchLastChild);
        
        if(overflag == true) // 搜索到，结束
        {
            log(childLocal_array);
            break;
        }
        // 未搜索到，去上一层parent搜索
        layerUiObject = layerUiObject.parent();
        parent_count = parent_count + 1;
    }

    if(overflag == true) // 搜索到，结束
    {
        var info = "";
        for(var i = 0;i < parent_count;i++)
        {
            info = info + ".parent()";
        }
        for(var i = 0;i < childLocal_array.length;i++)
        {
            info = info + ".child(" + childLocal_array[i] +")";
        }
        log("在输入的控件后加上：");
        log(info);
        log("即可定位到满足条件的目标控件。");
    }
    else
    {
        log("未搜索到");
    }
}

function childSearch(parent, childLocal_array, layerUiSelector, onlySearchLastChild)
{
    if(parent.childCount() == 0) // 最后的
    {
        // log(childLocal_array);
        var result = parent.find(layerUiSelector).size(); // 找到的个数
        if(result == 1) // 找到了
        {
            var overflag = true;
            return overflag;
        }
    }
    var i = 0;
    while(i < parent.childCount()) // 有孩子
    {
        childLocal_array.push(i); // 加入下一个孩子
        var overflag = childSearch(parent.child(i), childLocal_array, layerUiSelector, onlySearchLastChild);
        if(overflag == true)
        {
            var overflag = true;
            return overflag;
        }
        // 查找下一个
        childLocal_array.pop();
        i = i + 1;
    }
    
}