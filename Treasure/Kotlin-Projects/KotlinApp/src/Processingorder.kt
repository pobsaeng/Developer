fun main() {

    //var muList = mutableListOf<String>("a", "b", "c")
    //val listSeq = sequenceOf("a", "b", "c").toList()
    var listOf = listOf("a", "b", "c")

    var iterator = listOf.iterator()

    for (e in iterator) {
        println(e)
    }

    iterator.forEach {
        println("$it")
    }

    while (iterator.hasNext()) {
        var e = iterator.next()
        println(e)
    }


}

