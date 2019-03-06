
    data class Person(val name: String, val age: Int)

    val persons = listOf(
        Person("java", 16),
        Person("Basic", 25),
        Person("Python", 10),
        Person("Docker", 20),
        Person("Cat", 39),
        Person("Kotlin", 60),
        Person("Anna", 90),
        Person("Anna", 30),
        Person("java", 40)

    )
    /*
    Sequences enable you to easily operate upon collections of elements by chaining pure function
    */

    val names = persons
        .asSequence()
        .filter { it.age >  20}
        .map { it.name }
        .distinct()
        .sorted()
        .toList()

    fun main() {
        //[Anna, Basic, Cat, Kotlin, java]
        print(names)
    }