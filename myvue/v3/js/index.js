
var myvm = new MyVue({
    el: "#demo",
    data: {
        name: "hello word"
    }
});

setTimeout(function() {
    myvm.data.name = "wawawa...vue was born";
}, 2000);
