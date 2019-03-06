data class Customer(val name: String, val age: Int) {

    var v = "Hello Kotlin!".also(::println)

//    val firstProperty = "First property: $name".also(::println)

    init {
        println("First initializer block that prints")
    }

    //
//    val secondProperty = "Second property: ${name.length}".also(::println)
//
    init {
        println("Second initializer block that prints")
    }
}

    class PrimaryConstructor(name: String) {

        var name = "Hello!"
    }


class KotlinConstructor {

    //secondary constructors
    constructor(name: String) {
        println("This is secondary Constructors! $name")
    }

    //initializer blocks
    init {
        println("This initializer blocks!")
    }
}

open class Base(name: String, age: Int) {
    init {
        println("Base: $name, $age")
    }
}

class Derived(name: String, age: Int) : Base(name, age) {
    init {
        println("Derived: $name, $age")
    }
}

open class BaseApp {
    var bar = "You are Bob"
    var age = 25

    fun test(): String {
        return "Hello Test!"
    }
}

class IDoc : BaseApp {
    constructor(name: String) {

        super.bar = "My name is Pob" //change a bar

        super.test()

        super.age = 30

    }
}

fun parseInt(str: String): Int? {
    return str.toIntOrNull() //The result can be null
}

fun main() {

    parseInt("5").also(::println)


//    KotlinConstructor("Kraipob")

//    var doc = IDoc("Kotlin")
//
//    doc.test().also(::println)
//    doc.bar.also(::println)
//    doc.age.also(::println)

//    GetPerson("Pob")

//    val result = sequenceOf( //listOf
//        Customer("java", 30),
//        Customer("Basic", 25),
//        Customer("Python", 10),
//        Customer("Docker", 20),
//        Customer("Cat", 39),
//        Customer("java", 60)
//
//    ).toList()

//    println(result.toList())
    /*
         [Customer(name=java, age=30),
         Customer(name=Basic, age=25),
         Customer(name=Python, age=10),
         Customer(name=Docker, age=20),
         Customer(name=Cat, age=39),
         Customer(name=Kotlin, age=60)]
    */

//        println(result.first()) //Customer(name=java, age=30)
//        println(result.last()) //Customer(name=Kotlin, age=60)

//    var iterator1 = result.iterator()
//    var iterator2= result.iterator()
//
//    while (iterator1.hasNext()) {
//        println(iterator1.next())
//    }
//
//    println("-------------------")
//
//    iterator2.forEach {
//        println("$it")
//    }

//    val array = arrayOf(20, 15, 5, 3, 10, 6, 1, 2)
//    val sequence1 = Sequence { array.iterator() }.sorted()
//    for (e in sequence1.iterator()) println(e)

}


