
var myvm = new MyVue({
    el: "#demo",
    data: {
        name: "hello word",
        desc: "MVVM",
        school: {
            grade: "111",
            class: {
                student: "wuwh"
            }
        },
        arr: [1, 2]
    },
    methods: {
        sayHello: function() {
            alert("hello imitate vue");
        }
    }
});

setTimeout(function() {
    console.log("name值变了");
    myvm.name = "wawawa...vue";
    myvm.arr.push(123);
    // myvm.school.grade = "222";
}, 2000);

/* var library = {
    student: {
        name: "wuwh",
        age: 18
    },
    school: {
        name: "qing",
        may: "pc"
    }
};

observe(library); */

