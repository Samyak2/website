---
title: "Variance in type systems"
summary: "A brief explanation of what covariant, contravariant and invariant mean. With examples in various languages."
date: 2025-02-09
slug: "variance"
draft: true
tags:
- types
- pl
- rust
- python
- typescript
- zig
- go
---

{{< toc >}}

Understanding variance will help us better reason about behaviors of *generic* types. Even if you have never defined your own generic types, you have almost certainly interacted with them in everyday programming.

Before we begin, there are a few terms we need to be familiar with.

# Generic types

<!-- Wait - first, wait's a type? A type of a variable determines all the values it can hold. In Java, C++ and python, type usually means a *class*. In Rust, it can be a struct or a trait. In typescript, it can be a class or an interface. Types can be more complex too. For example, you can have a type for functions in languages that support sending functions around (as callbacks for example). -->

A type is considered generic if it has placeholders for other types within it. These placeholders are called **type parameters**. For example, an array is a type which is generic over its element type. You will see this in different forms in different languages. `list[T]` in python; `std::vector<T>` in C++; `Vec<T>` in Rust; `List<T>` in java and so on.

The point of generics is usually to re-use code. You can write code for an array/list/hashmap once and have it support *any* type of element. In some compiled languages (for example, C++ and Rust), it also provides great runtime performance because of the compiler generating specific implementations for each type - a process known as *monomorphization* [^1].

# Subtyping

This can take many forms. One common form is through *inheritance* - in languages like Java, C++ and python. A class Y is a *subtype* of X if Y is a *sub-class* of X (i.e., Y extends X). This subtyping relationship is written as `Y <: X`. Another way to look at subtyping is substitution. If a Y can be used in places where a X is needed, we say Y is a subtype of X. For example, we can use a Cat in places where an Animal is needed. This means Cat is a subtype of Animal, or `Cat <: Animal`.

In the case of Rust, there's no subtyping relationship between any *types*. This is because Rust doesn't support inheritance. Although, there are subtyping relations between *lifetimes*. More on this later (skip to the Rust section for it).

# Variance

The concept of variance shows up in the intersection of generics and subtyping.
- A generic type `Something[T]` is **covariant** in T if `B` being a subtype of `A` means that `Something[B]` is a subtype of `Something[A]`.

    - If `B <: A` then `Something[B] <: Something[A]`.

- A generic type `Something[T]` is **contravariant** in T if `B` being a subtype of `A` means that `Something[A]` is a subtype of `Something[B]`.

    - If `B <: A` then `Something[A] <: Something[B]`.

- A generic type `Something[T]` is **invariant** in T if `B` being a subtype of `A` does *not* mean that `Something[B]` is a subtype of `Something[A]`. In other words, there is no subtyping relation between `Something[A]` and `Something[B]`.

    - If a `Something[A]` is required, there is no replacement for it. No `Something[B]` can be provided in the place of a `Something[A]`.

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

### A note on multiple type parameters

In the [definition of variance](#variance) above, we said that "`Something[T]` is co/contra/invariant **in** `T`". Each type parameter of a generic can have different variance. For example, a function type `Function[ParameterType, ReturnType]` can be covariant in `ReturnType` and contravariant in `ParameterType`. We will see examples of such types in the next section.

For generics with only a single type parameter, saying "list is invariant" is equivalent to "list[T] is invariant in T".

# Other languages

Let's look at a few examples of co/contra/invariance in various languages.

## Python

We saw example of covariance (`typing.Sequence`) and invariance (`list`) already. Now let's look at an example for contravariance.

Consider these functions:
```python
class Media:
    ...

class Anime(Media):
    ...

def watch_media(media: Media):
    ...

def watch_anime(anime: Anime):
    ...
```

Here `Anime <: Media` since Anime subclasses Media. Notice here that we don't really use generic types, so how does variance factor in here?

Generic types show up in the *type of the functions*. In python, functions are typed using `collections.abc.Callable` [^2]. The following are the types of these functions:
- `watch_media` is `Callable[[Media], None]`: takes one argument of type `Media` and returns a value of type `None`.
- `watch_anime` is `Callable[[Anime], None]`: takes one argument of type `Anime` and returns a value of type `None`.

Now let's consider a function that takes a `Callable` as an *argument*:
```python
from collections.abc import Callable
def sit_down(watcher: Callable[[Media], None]):
    watcher(Media())
```

Can we do `sit_down(watch_media)`? Yes.

But can we do `sit_down(watch_anime)`? Nope:
```python
1. Argument of type "(anime: Anime) -> None" cannot be assigned to parameter "watcher" of type "(Media) -> None" in function "sit_down"
     Type "(anime: Anime) -> None" is not assignable to type "(Media) -> None"
       Parameter 1: type "Media" is incompatible with type "Anime"
         "Media" is not assignable to "Anime"

```

Logically, the `watcher` function in `sit_down` can get called with any type of `Media`, not just `Anime`. So we cannot pass a function that assumes it will always get an `Anime`. This means `Callable[[Anime], None]` is *not* a subtype of `Callable[[Media], None]`. So `Callable[[T], ...]` is *not* covariant in T.

What about the other way around?
```python
from collections.abc import Callable
def sit_down_2(watcher: Callable[[Anime], None]):
    watcher(Anime())

sit_down_2(watch_media)
```

`watch_media` can handle all types of `Media`, so it can obviously handle `Anime`. Now we have `Callable[[Media], None] <: Callable[[Anime], None]`, even though `Anime <: Media`. Hence, `Callable[[T], ...]` is **contravariant** in T.

In fact, `Callable` is contravariant in all its argument types. That is, `Callable[[A2, B2, C2, ...], ...] <: Callable[[A1, B1, C1, ...], ...]` only if `A1 <: A2 and B1 <: B2 and C1 <: C2` and so on.

## Typescript

Unlike python, arrays in Typescript are covariant! That means the below program is valid and passes the typechecker. This is [intentional](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#a-note-on-soundness) in the design of Typescript.

```typescript
function some_func(input: (number | string)[]) {
    console.log(input);
    input.push("hello world");
}

// supposed to be an array of numbers only
const some_array: number[] = [1, 2, 3];
some_func(some_array);
console.log(some_array); // [1, 2, 3, "hello world"] - oops!
```

Now let's see an example for contravariance. Consider these interfaces:
```typescript
interface Media {
  name: string;
}

interface Anime extends Media {
  studio: string;
}

function watchMedia(media: Media) {
}

function watchAnime(anime: Anime) {
}
```
Here `Anime <: Media` since the `Anime` interface extends the `Media` interface. Similar to the Python example, we come across variance in the types of *functions*. The types of the functions we defined can be written as:
- `watchMedia` is `(media: Media) => void`: takes one argument of type `Media` and returns nothing.
- `watchAnime` is `(anime: Anime) => void`: takes one argument of type `Anime` and returns nothing.

Now consider this function that takes another function as an argument:
```typescript
function sitDown(watcher: (media: Media) => void) {
  watcher({name: "Arcane"});
}
```
Can we `sitDown(watchMedia)`? Yes.

Can we `sitDown(watchAnime)`? Nope:
```typescript
Argument of type '(anime: Anime) => void' is not assignable to parameter of type '(media: Media) => void'.
  Types of parameters 'anime' and 'media' are incompatible.
    Property 'studio' is missing in type 'Media' but required in type 'Anime'.
```

Logically, the `watcher` function in `sitDown` can get called with any type of `Media`, not just `Anime`. So we cannot pass a function that assumes it will always get an `Anime`. This means `(anime: Anime) => void` is *not* a subtype of `(media: Media) => void`. So `(value: T): void` is *not* covariant in T.

What about the other way?
```typescript
function sitDown2(watcher: (media: Anime) => void) {
  watcher({name: "Vinland Saga", studio: "WIT"});
}

sitDown2(watchMedia);
```

This is fine because `watchMedia` can handle any `Media`, so it can obviously handle an `Anime`.

Now we have `(media: Media) => void <: (anime: Anime) => void` even though `Anime <: Media`. This is called contravariance and we can say that `(value: T): void` is **contravariant** in `T`.

Invariance in Typescript doesn't show up very often. If you know of better examples than the one I show here, please let me know.

Consider the following functions:
```typescript
function makeSequel(media: Media): Media {
  return {name: media.name + " 2"};
}

function makeSequelAnime(anime: Anime): Anime {
  return {name: anime.name + " 2", studio: anime.studio};
}
```
Both of them return a value with the same type as its input. The generic form of such a function would be `(value: T) => T`. Now consider the below function that takes such a function as its input:
```typescript
function applyTransform(transformer: (media: Media) => Media) {
  return transformer({name: "Invincible"});
}
```

`applyTransform(makeSequel)` works just fine, but `applyTransform(makeSequelAnime)` fails:
```typescript
Argument of type '(anime: Anime) => Anime' is not assignable to parameter of type '(media: Media) => Media'.
  Types of parameters 'anime' and 'media' are incompatible.
    Property 'studio' is missing in type 'Media' but required in type 'Anime'.
```

We can say that `(value: T) => T` is *not covariant* in T, because `(anime: Anime) => Anime` is not a subtype of `(media: Media) => Media`.

Now consider another function that takes an Anime transformer instead:
```typescript
function applyAnimeTransform(transformer: (anime: Anime) => Anime) {
  return transformer({name: "Frieren", studio: "Madhouse"});
}
```
`applyAnimeTransform(makeSequelAnime)` works just fine, but `applyAnimeTransform(makeSequel)` fails:
```typescript
Argument of type '(media: Media) => Media' is not assignable to parameter of type '(anime: Anime) => Anime'.
  Property 'studio' is missing in type 'Media' but required in type 'Anime'.
```

`(media: Media) => Media` is *not* a subtype of `(anime: Anime) => Anime`, which means that `(value: T) => T` is *not contravariant* in `T`. Since it is neither covariant nor contravariant, we can say that `(value: T) => T` is **invariant** in `T`.

## Rust

Although Rust does not allow defining our own subtypes like in other languages (since it does not support inheritance), there is yet one subtyping relationship that exists. This relationship is on lifetimes instead of type parameters.

A full explanation of lifetimes would make post way longer than it already is. I will try explaining them briefly. Lifetimes in Rust are regions of code where a variable is accessible. Consider this example:
```rust
fn main() {
    let some_var = "hello there".to_owned(); // the lifetime of some_var starts here

    println!("The value of some_var is {}", some_var);
    // the lifetime of some_var ends at the end of the block implicitly
}
```

We can cut short the lifetime of a variable by calling `drop` on it:
```rust

fn main() {
    let some_var = "hello there".to_owned(); // the lifetime of some_var starts here

    drop(some_var); // the lifetime of some_var ends here!

    // oops can't use it anymore!
    println!("The value of some_var is {}", some_var);
}
```

For most rust programs, lifetimes become a problem when references are involved. They will often be implicit and unnamed like in `&str`, but sometimes we need to name them like in `&'a str`. Lifetime names start with apostrophe and are followed by the name. Lifetimes of functions and structs are specified in the same manner as type parameters. In other words, functions and structs can be *generic* over lifetimes.

Now let's understand the subtyping relationship between lifetimes. Consider this struct:
```rust
struct Token<'a> {
    pub session_name: &'a str
}
```
This means that a `Token` must live at least as long as its `session_name`. Now consider a function that creates a token:
```rust
fn create_token_1<'a>(session_name: &'a str) -> Token<'a> {
    Token { session_name }
}
```
Here too, the returned `Token` lives at least as long as the `session_name` being passed in. Rust's borrow checker makes sure of this. Let's create a token and use it:
```rust
let session_name: String = "browser1".to_owned();
let token = create_token_1(&session_name);

// this works
println!("I have a token for {}", token.session_name);
```

Now if we try to drop the `session_name` before the usage of `token`:
```rust
let session_name: String = "browser1".to_owned();
let token = create_token_1(&session_name);

// not allowed!
drop(session_name);

println!("I have a token for {}", token.session_name);
```
We get an error:
```rust
error[E0505]: cannot move out of `session_name` because it is borrowed
  --> src/bin/lifetimes.rs:20:10
   |
17 |     let session_name: String = "browser1".to_owned();
   |         ------------ binding `session_name` declared here
18 |     let token = create_token_1(&session_name);
   |                                ------------- borrow of `session_name` occurs here
19 |
20 |     drop(session_name);
   |          ^^^^^^^^^^^^ move out of `session_name` occurs here
21 |
22 |     println!("I have a token for {}", token.session_name);
   |                                       ------------------ borrow later used here
   |
```

Now let's revisit the function and try to provide different lifetimes for the input and output:
```rust
fn create_token_2<'a, 'b>(session_name: &'a str) -> Token<'b> {
    Token { session_name }
}
```
This is not allowed. Recall that the definition of `Token` takes its lifetime from the lifetime of the inner `session_name`. In this case, we're constructing a `Token<'a>` but the return type requires a `Token<'b>`. `'a` and `'b` are two lifetimes with no relationship. We can define this relationship explicitly:
```rust
fn create_token_2<'a, 'b>(session_name: &'a str) -> Token<'b>
where
    'a: 'b,
{
    Token { session_name }
}
```
Here `'a: 'b` means that lifetime `'a` is at least as long as lifetime `'b`. In other words, any variable with lifetime `'a` can be used in the place where a lifetime of `'b` is needed. That's subtyping! So we can write this as `'a <: 'b`. Notice here that `'a` is the *longer* lifetime compared to `'b`. Generalizing this, any lifetime `'long` which encompasses another lifetime `'short` is a *subtype*: `'long <: 'short`.

There is a special lifetime in Rust named `'static`. References with a lifetime of `'static` live for the duration of the program. That is, we can assume that they are never dropped. We can say that the `'static` lifetime is longer than all other lifetimes. Or in other words, `'static` is a subtype of all lifetimes.

Now that the relationship is established, let's look at examples of variance. Actually, we have already looked at covariance. Let's simplify our previous example a bit:
```rust
fn create_token_3<'a, 'b>(session_name: &'a str) -> &'b str
where
    'a: 'b,
{
    session_name
}
```
Here we are assigning a `&'a str` to a `&'b str`, which means `&'a str <: &'b str`. Since we know `'a <: 'b`, we can say that `&'a T` is {{% sidenote "**covariant**" %}}`&'a T` is also covariant in `T`. For example, `&'a &'b str` is a subtype of `&'a &'c str` if `'b <: 'c`.{{%/ sidenote %}} in `'a`.

Now consider this example:
```rust
fn example<'long, 'short>(mut some_str: &'long str)
where
    'long: 'short,
{
    let mut_ref_to_ref_str: &mut &'short str = &mut some_str;
}
```
This function defines two lifetimes with the relationship `'long <: 'short` i.e., `'long` lives at least as long as `'short`. We're passing in a `&str` with lifetime `'long`. The `mut_ref_to_ref_str` is a mutable reference to an immutable reference to a `str`. In short, a mutable reference to a `&str`. This means we can't modify the inner `&str`, but we can make `mut_ref_to_ref_str` point to another `&str`. Sadly, the above function does not compile:
```rust
error: lifetime may not live long enough
  --> src/bin/lifetimes.rs:42:29
   |
38 | fn example<'long, 'short>(mut some_str: &'long str)
   |            -----  ------ lifetime `'short` defined here
   |            |
   |            lifetime `'long` defined here
...
42 |     let mut_ref_to_ref_str: &mut &'short str = &mut some_str;
   |                             ^^^^^^^^^^^^^^^^ type annotation requires that `'short` must outlive `'long`
   |
   = help: consider adding the following bound: `'short: 'long`
   = note: requirement occurs because of a mutable reference to `&str`
```
Even though `'long <: 'short` and `&'long str <: &'short str`, `&mut &'long str` is *not* a subtype of `&mut &'short str`. But why is this not allowed? Let's see what happens when this is allowed. We would be allowed to use the mutable reference to make `mut_ref_to_ref_str` point to a `&'short str`:
```rust
fn example<'long, 'short>(mut some_str: &'long str)
where
    'long: 'short,
{
    let mut_ref_to_ref_str: &mut &'short str = &mut some_str;

    {
        let short_lived_string: String = "hello there".to_owned();
        let short_ref: &'short str = &short_lived_string;
        *mut_ref_to_ref_str = short_ref;
        // short_lived_string is dropped!
    }

    // some_str will not point to a &str with a 'short lifetime!
}
```
At the end of this function, `some_str` is actually assigned to `short_lived_string` which is dropped at the end of the inner block. This means that using `some_str` after the block is actually a use-after-free! Rust is designed to prevent such memory bugs, so it makes sense that this is not allowed. So we can say that `&mut T` is *not covariant* in `T`.

If we reverse the assignment to be:
```rust
fn example<'long, 'short>(mut some_str: &'short str)
where
    'long: 'short,
{
    let mut_ref_to_ref_str: &mut &'long str = &mut some_str;
}
```
This is obviously wrong since `'short` is a shorter lifetime. So `&mut T` is *not contravariant* in T. The conclusion is that `&mut T` is **invariant** in `T`.

Now let's look at a function that takes another function (pointer) as its argument:
```rust
fn sit_down(watcher: fn(&str)) {
    let anime: String = "vinland saga".to_owned();
    watcher(&anime);
}
```
`watcher` is a function that takes in a `&str` with some lifetime. We are passing it a temporary, local `&str` created within in the `sit_down` function.

Now let's try to pass it a function that takes a `&str` with a lifetime that is a subtype. Since `'static` is a subtype of all lifetimes, let's use that:
```rust
fn static_watcher(name: &'static str) {
    println!("watching static name {}", name);
}

fn main() {
    sit_down(static_watcher);
}
```
This does not work:
```rust
error[E0308]: mismatched types
   --> src/bin/lifetimes.rs:120:14
    |
120 |     sit_down(static_watcher);
    |     -------- ^^^^^^^^^^^^^^ one type is more general than the other
    |     |
    |     arguments to this function are incorrect
    |
    = note: expected fn pointer `for<'a> fn(&'a _)`
                  found fn item `fn(&'static _) {static_watcher}`
```
This makes sense since `static_watcher` can only handle strings with a `'static` lifetime and within `sit_down` we are passing a local string that has a shorter lifetime. `fn(&'static str)` is not a subtype of `fn(&'a str)` even though `'static <: 'a`, so we can say that `fn(&'a T)` is *not covariant* in `'a`.

What about the other way around?
```rust
fn sit_down_static(watcher: fn(&'static str)) {
    watcher("vinland saga");
}

fn any_ref_watcher<'a>(name: &'a str) {
    println!("any_ref_watcher watching {}", name);
}

fn main() {
    sit_down_static(any_ref_watcher);
}
```
Here we're asking for a `watcher` that can handle `&str` with static lifetimes and we're passing a function that handles any `&'a str`. This compiles. We have `fn(&'a) <: fn(&'static)` even though `'static <: 'a`. This means that `fn(&'a T)` is **contravariant** in `'a`.

The Rustonomicon has a table summarizing the variance of some common generic types [here](https://doc.rust-lang.org/nomicon/subtyping.html#variance).

### A note on trait upcasting

Rust 1.86, which was released in April 2025, introduced [*trait upcasting*](https://blog.rust-lang.org/2025/04/03/Rust-1.86.0.html#trait-upcasting). Consider the following traits:
```rust
trait Media {}

trait Anime: Media {}
```
The `Anime: Media` defines a that `Media` is a [*supertrait*](https://doc.rust-lang.org/book/ch20-02-advanced-traits.html#using-supertraits-to-require-one-traits-functionality-within-another-trait) of `Anime`. With 1.86 and above, we can now assign a `dyn Anime` trait object to a `dyn Media` trait object. For example, this works:
```rust
struct Frieren;
impl Media for Frieren {}
impl Anime for Frieren {}

fn main() {
    let some_anime: Box<dyn Anime> = Box::new(Frieren);
    let some_media: Box<dyn Media> = some_anime; // this works
}
```

This may look like a subtyping relationship, like `Anime <: Media`. But nope! It's not. Rust 1.86 does *not* introduce a new subtyping relationship. Lifetimes are still the only subtypes. Further, `Box<T>` may look like it's covariant in `T`. This is just coercion and does not involve variance. For more detailed explanations, see the responses to [this discussion on the Rust Internals Forum](https://internals.rust-lang.org/t/why-are-fn-types-not-contravariant-in-their-argument-types/22700/2).

<!-- ## Zig -->
<!---->
<!-- ## Go -->

[^1]: Interestingly, even though Java is a compiled language, it does *not* do monomorphization. After compilation, a type parameter in a generic class is replaced with `object`. This `object` type can store any object in Java. But importantly, primitives (int, long, float, char, etc.) are not objects. So you can't really have a fast `Array<int>` in Java. You can have an `Array<Integer>`, but values of `Integer` types take 4x more memeory (16 bytes) compared to `int`s (4 bytes). So a generic `Array` in Java will always be slower than having specific arrays for each type (an `ArrayInt` for example).
[^2]: Yes, there is a module in the python standard library named `abc`. In fact, there are two. There's the [`abc`](https://docs.python.org/3/library/abc.html) module that helps you define Abstract Base Classes (hence ABC). Then there's [`collections.abc`](https://docs.python.org/3/library/collections.abc.html).
