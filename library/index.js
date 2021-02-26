import TopBar from './topBar'
import TopBarItem from './topBarItem'
import Counter from './counter'
import Dialog from './dialog'
import DialogItem from './dialogItem';
import Svg from "./svg"
import Tab from "./tab"
import Tag from "./tag"
import Table from "./table/index.vue";
import Form from "./form";
import Upload from "./upload";
import Barbell from "./barbell";
import Image from "./image";

// 获取svg
import "@/assets/icons/svg";

const UW = { TopBar, TopBarItem, Counter, Dialog, DialogItem, Svg, Tab, Table, Form, Upload, Barbell, Tag, Image };

// 为所有组件添加安装函数
Object.keys(UW).forEach(_name => {
    let component = UW[_name]
    component.install = function (Vue) {
        Vue.component(this.name || `UwComponentNo${new Date().getTime()}`, this);
    };
    component.create = function (_options) {
        let $create = function () {
            let keys = Object.keys(_options);
            for (let i = 0; i < keys.length; i++) {
                this[keys[i]] = _options[keys[i]]
            }
        };
        this.created = this.created ? [$create, this.created] : $create;
        return this;
    };
    exports[_name] = component
});

// 输出uw
export default {
    install(Vue) {
        Object.keys(UW).forEach(_name => {
            Vue.use(UW[_name])
        })
    }
}