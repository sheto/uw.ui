export default {
    phone: {
        validator: (rule, value, callback) => {
            if (/^1(3|4|5|7|8)\d{9}$/.test(value)) {
                callback();
            } else {
                callback(new Error('手机号码格式错误'));
            }
        },
        trigger: 'blur'
    }
}