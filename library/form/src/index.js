import ElForm from './form/form.vue';
import ElFormItem from './form/form-item.vue';

ElForm.install = function(Vue) {
  Vue.component(ElForm.name, ElForm);
};

ElFormItem.install = function(Vue) {
  Vue.component(ElFormItem.name, ElFormItem);
};

export const Form = ElForm;
export const FormItem = ElFormItem;
