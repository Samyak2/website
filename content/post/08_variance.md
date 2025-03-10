---
title: "Variance in type systems"
summary: "A brief explanation of what covariant, contravariant and invariant mean. With examples in various languages."
date: 2025-02-09
slug: "variance"
draft: true
tags:
- types
- pl
---

Knowing about variance will help us better reason about behaviors of *generic* types. Even if you have never written custom generic types, you would have more likely than not used generic types.

Before we begin, there are a few terms we need to be familiar with.

## Generic types

<!-- Wait - first, wait's a type? A type of a variable determines all the values it can hold. In Java, C++ and python, type usually means a *class*. In Rust, it can be a struct or a trait. In typescript, it can be a class or an interface. Types can be more complex too. For example, you can have a type for functions in languages that support sending functions around (as callbacks for example). -->

A type is considered generic if it has placeholders for other types within it. These placeholders are called **type parameters**. For example, an array is a type which is generic over its element type. You will see this in different forms in different languages. `list[T]` in python; `std::vector<T>` in C++; `Vec<T>` in Rust; `List<T>` in java and so on.

The point of generics is usually to re-use code. You can write code for an array/list/hashmap once and have it support *any* type of element. In some compiled languages (for example, C++ and Rust), it also provides great runtime performance because of the compiler generating specific implementations for each type - a process known as *monomorphization* [^1].

## Subtyping

This can take many forms. One common form is through *inheritance* - in languages like Java, C++ and python. A class Y is a *subtype* of X if Y is a *sub-class* of X (i.e., Y extends X). This subtyping relationship is written as `Y <: X`. Another way to look at subtyping is substitution. If a Y can be used in places where a X is needed, we say Y is a subtype of X. For example, we can use a Cat in places where an Animal is needed. This means Cat is a subtype of Animal, or `Cat <: Animal`.

In the case of Rust, there's no subtyping relationship between any *types*. This is because Rust doesn't support inheritance. Although, there are subtyping relations between *lifetimes*. More on this later (skip to the Rust section for it).

## Variance

The concept of variance shows up in the intersection of generics and subtyping.
- A generic type `Something[T]` is **covariant** in T if `B` being a subtype of `A` means that `Something[B]` is a subtype of `Something[A]`.

    - If `B <: A` then `Something[B] <: Something[A]`.

- A generic type `Something[T]` is **contravariant** in T if `B` being a subtype of `A` means that `Something[A]` is a subtype of `Something[B]`.

    - If `B <: A` then `Something[A] <: Something[B]`.

- A generic type `Something[T]` is **invariant** in T if `B` being a subtype of `A` does *not* mean that `Something[B]` is a subtype of `Something[A]`. In other words, there is no subtyping relation between `Something[A]` and `Something[B]`.

# An example

Let's walk through this using an example in python. Consider this function:

```python
def some_func(input: list[int | str]):
    print("i take int or str", input)
```

It takes a list of integers or strings i.e., it can have both ints and strings in the same list. If I try to pass a list of only ints to it:
```python
int_list: list[int] = [1, 2, 3]
some_func(int_list)
```

I get this {{% sidenote "type error" %}}Python does no type-checking at runtime. So this program will run just fine.
To see these errors, you need to use a typechecker like [mypy](https://github.com/python/mypy) or [pyright](https://github.com/microsoft/pyright). You can check out this example on the [pyright playground](https://pyright-play.net/?code=CYUwZgBAzg9gtiA%2BmArgOwMYAoCWaAOKALgFwQA2OURA2nkRAD7REBOAugJQkBQE-EfK3pYARDghEAhgGsQEehBisWrUQBoFBYpx496iStTJHa9dhAC8EGgEZNAJk0Bmdj1gJk6bAdOcgA).{{%/ sidenote %}}

```python
1. Argument of type "list[int]" cannot be assigned to parameter "input" of type "list[int | str]" in function "some_func"
     "list[int]" is not assignable to "list[int | str]"
       Type parameter "_T@list" is invariant, but "int" is not the same as "int | str"
       Consider switching from "list" to "Sequence" which is covariant
```

But this works:
```python
a_int_or_str: int | str = 5
```
That means `int` can be assigned to `int | str`. In other words, `int` is a subtype of `int | str`.

The error says that `list[T]` is invariant on `T`. But why? What's wrong in passing a `list[int]` to a `list[int | str]`? The reason, in python, is mutability. A list can be mutated at any point. The function can append a string to the input:
```python
def some_func(input: list[int | str]):
    print("i take int or str", input)
    input.append("hello there")

int_list: list[int] = [1, 2, 3]
some_func(int_list)
```
Now the type of `int_list` outside will be wrong after this function call! It will no longer be a `list[int]`.

The solution for our first function is to use `typing.Sequence[T]`, which is covariant. The type error message we saw also hints to this (see the last line).
```python
from typing import Sequence
def some_func(input: Sequence[int | str]):
    print("i take int or str", input)

int_list: list[int] = [1, 2, 3]
some_func(int_list) # works now
```
Sequence is covariant because it's immutable. There's no append method and if you try to assign something to an index like `input[0] = "a"`, you'll get a{{% sidenote "type error." %}}Note: the input is still a list at runtime. It can be mutated too. The error only shows up during type-checking and using `Sequence` does not actually prevent any code from mutating the list.{{%/ sidenote %}}

Mutability is just one reason for changing the variance. There may be other reasons why a type is co/contra/invariant.

# A note on multiple type parameters

In the [definition of variance](#variance) above, we said that "`Something[T]` is co/contra/invariant **in** `T`". Each type parameter of a generic can have different variance. For example, a function type `Function[ParameterType, ReturnType]` can be covariant in `ReturnType` and contravariant in `ParameterType`. We will see examples of such types in the next section.

For generics with only a single type parameter, saying "list is invariant" is equivalent to "list[T] is invariant in T".

# Other languages

Let's look at a few examples of co/contra/invariance in various languages.

## Python

We saw example of covariance (`typing.Sequence`) and invariance (`list`) already. Now let's look at an example for contravariance.



## Typescript

Unlike python, arrays in Typescript are covariant! That means this program is valid and passes the typechecker:
```typescript
function some_func(input: (number | string)[]) {
    console.log(input); // [1, 2, 3]
    input.push("hello world");
}

const some_array: number[] = [1, 2, 3];
some_func(some_array);
console.log(some_array); // [1, 2, 3, "hello world"]
```



## Rust

## Zig

## Go

[^1]: Interestingly, even though Java is a compiled language, it does *not* do monomorphization. After compilation, a type parameter in a generic class is replaced with `object`. This `object` type can store any object in Java. But importantly, primitives (int, long, float, char, etc.) are not objects. So you can't really have a fast `Array<int>` in Java. You can have an `Array<Integer>`, but values of `Integer` types take 4x more memeory (16 bytes) compared to `int`s (4 bytes). So a generic `Array` in Java will always be slower than having specific arrays for each type (an `ArrayInt` for example).
