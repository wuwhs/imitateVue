var myvm = new MyVue({
    el: "#demo",
    data: {
        name: "hello word",
        myColor: "red",
        student: {
            name: "vue"
        },
        arr: [1, 2]
    },
    methods: {
        clickOk: function () {
            alert("I am OK");
        }
    }
});

setTimeout(function () {
    myvm.data.name = "wawawa...vue was born";
}, 2000);