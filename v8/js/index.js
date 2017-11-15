var myvm = new MyVue({
    el: "#demo",
    data: {
        name: "hello word",
        student: {
            age: 22
        },
        arr: [1, 2]
    }
});

setTimeout(function() {
    myvm.data.name = "wawawa...vue was born";
}, 2000);