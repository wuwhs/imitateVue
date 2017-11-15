var myvm = new MyVue({
    el: "#demo",
    data: {
        name: "hello word",
        student: {
            age: 22
        }
    }
});

setTimeout(function() {
    myvm.data.name = "wawawa...vue was born";
}, 2000);