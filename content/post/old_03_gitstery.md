---
title: "Solving A Git Murder Mystery"
date: 2020-03-15
lastmod: 2021-05-18
tags:
  - git
draft: false
classes: wide
summary: "gitstery is a murder mystery game entirely contained in a git repo!"
slug: "gitstery"
aliases:
 - /blog/git/gitstery/
---

On the night of Friday the 13th, I came across an [interesting repository](https://github.com/nivbend/gitstery) on GitHub.
At first I did not understand what it was, after all "gitstery" is not a very obvious name. I read through the README
(seems like I missed the part where they say it was designed to be solved using git commands alone) and got some idea of 
what it was. It seemed really interesting and I was bored, so I cloned it. There was an `instructions.txt` file which
contained.... instructions.

```text
A murder had been committed in Git Town!

The detective, Kyle Pumbinner, said the crime scene report is on the `gtpd-archive` branch. He
doesn't really remember the report ID... But he knows it was the first report he submitted after his
son's ninth birthday (which was Saturday, July 20th), and it was the only report he submitted that
week.

When you find a suspect, you'd probably want to interview them. To do that, first find out their
address. To go to that street, look for the street's name in the repository (Hint: it's a tag). To
go to house number N on that street, go to the Nth ancestor. If you'd like to inspect the
perimeters, you can look into the commit's contents - it'll contain a hash that you can view with
certain git commands.

Think you found the culprit? Check your answer with the following command:

    echo "John Doe" | git hash-object --stdin | grep -iq -f /dev/stdin <(git show solution) && echo 'You found the murderer!' || echo 'No cigar, chief... Try again.'

Replace John Doe with the name of the suspect that you want to check.

For an extra challenge, try and solve the mystery without ever using `git checkout`.
```

**Spoiler Warning**: The following section contains spoilers for gitstery. I suggest you try it on your own before reading. Or you can read this as a guide.
{: .notice--warning}

The instructions hint that we need to check out the `gtpd-archive` branch. We can do so by using `git checkout gtpd-archive`.
It seems there is no difference between the two branches, all the files are the same.

{{< figure src="/images/gitstery/gitstery-files.webp"
    caption="Files in the gtpd-archive branch"
    width="100%"
>}}

So we check the logs, using `git log` and we see all the reports here. The date starts from December and, as indicated by
the instructions files, we need to find the logs which were submitted in the week after July 20th. We can search the log
by typing `/July` and pressing the `n` key to go to the next search result. There is only one report by Kyle Pumbinner in
that week.

{{< figure src="/images/gitstery/gitstery-log-July-24.webp"
    caption="Git log showing the report we need"
    width="100%"
>}}

Hmm, so we need to check out the `detectives/kpumbinner` branch.
```bash
git checkout detectives/kpumbinner
```
{{< figure src="/images/gitstery/gitstery-kpumbineer-branch-files.webp"
    caption="Files in the detectives/kpumbinner branch"
    width="100%"
>}}

Here we have a new directory with an `access.log` inside. There are three entries of `BACKDOOR_332` here, we need to find
the names of the people who made these entries. There is an aptly named git subcommand for this, it is called `git blame`,
running `git blame access.log` will show the names of the people who made each entry in the file. At this point you could
search through this by using `/BACKDOOR_332`, but here we can use the very useful `grep` tool.
```bash
git blame access.log | grep BACKDOOR_332
```

{{< figure src="/images/gitstery/git-blame-grep.webp"
    caption="This gives the names of the three people who accessed the backdoor"
    width="100%"
>}}

Now, we need to investigate these people. Going back to the instructions.txt, it describes the process to investigate a
person. First, we need to find the person's address. This is simple, we just have to search for the person's name in the
residents.txt file. Using cat and grep commands, we can easily get the address (or you can open the files using an editor
and search in it).
```bash
$ cat residents.txt | grep "Lyndon"
Lyndon Huskupper        73 Tamworth Drive
```
```bash
$ cat residents.txt | grep "Cosmo"
Cosmo Siwkonk   26 Balcombe Close
```
```bash
$ cat residents.txt | grep "Brock Stuickard"
Brock Stuickard 9 Beaconside
```

Again going back to instructions.txt, we find a way to investigate the addresses. Now, we have to look for the street
name in git tags. `git tag -l` lists all the tags, then we use grep to get the required tags.
```bash
$ git tag -l | grep "tamworth"
street/tamworth_drive
$ git tag -l | grep "balcombe"
street/balcombe_close
$ git tag -l | grep "beaconside"
street/beaconside
```

Now we are ready to investigate the addresses. To visit the address, we checkout that tag and inspect the files there.
Checking out tags is as simple as `git checkout <tag name>`, for example `git checkout street/tamworth_drive`. We see
a new file here named `investigate` which contains some random letters. According to instructions.txt, this is a hash.
We haven't reached the house number yet, so let's do that. With the hint from instructions.txt, we look at the logs.
The contents have the house number, street name and the investigation report/conversation. We can search for `/73 `
(notice the space after 73, this is because the commit hashes can also contain the number 73) and get the investigation
result.
```
commit f8a5b218b1eaee3b111ae5ef536f919e8d3afca2
Author: Dolores Wholfump <mayor@gittown.gov>
Date:   Tue Jan 1 00:00:00 2019 +0000

    73 Tamworth Drive
    
    No one's home...
    
    Maybe take a look around the perimeter?
```

How do we look around? That's easy, we simply checkout that commit and take a look at the files. To checkout to a
specific commit, copy the commit hash and do `git checkout <commit hash here>` like `git checkout f8a5b218b1eaee3b111ae5ef536f919e8d3afca2`.
We can see that the `investigate` file has changed, so we need to somehow get the actual contents of it. For that,
we use a git subcommand called `cat-file` can be used, this subcommand is used to find information about repository
objects (which are hashed). `git cat-file -t` is used to get the object's type (in this case, it is a blob which is
a general type for files in git) and `git cat-file -p` is used to print the object's content.
```bash
$ cat investigate 
22f733298423b814f1da31bee3e0063c72ed6e71
$ git cat-file -p 22f733298423b814f1da31bee3e0063c72ed6e71
"There's no one answering the door. Obviously you won't break in because you don't have a warrant or
anything. But nothing's wrong with looking around the place...

You check around the house, there's no car. Not even a driveway. You do find a bike resting against
the fence. It's pretty close to the factory, so makes sense the suspect bikes to work.

Just to make sure, you ask some of the neighbors, they confirm that the suspect doesn't own a car.
One of them says he doesn't even have a license.

Another neighbor says he saw the suspect coming back from work on the day of the murder at about
5PM, they chatted for a bit before his sister picked him up to visit their parents. They live pretty
far away, so that places him away from Git Town at the time of the murder."
```

Hmm, looks like this one is not our culprit. (They seem to emphasize having a car a lot for some reason...).
We can now look at the other suspects.

```bash
$ git checkout street/balcombe_close
$ git log | grep -5 "26 "
commit bc6870d8093a33d9a69acc94a1cda16ee2d7195d
Author: Dolores Wholfump <mayor@gittown.gov>
Date:   Tue Jan 1 00:00:00 2019 +0000
"
    26 Balcombe Close
    
    No one's home...
    
    You can take a look around though.
"
$ git checkout bc6870d8093a33d9a69acc94a1cda16ee2d7195d
HEAD is now at bc6870d 26 Balcombe Close
$ cat investigate 
c8411c73e49372dbdb644beef2ea841b403fc476
$ git cat-file -p c8411c73e49372dbdb644beef2ea841b403fc476 
"Nobody's home. From the stack of letters in the mailbox nobody's been here for a good few days.

Without a warrant you can't get into the house, but you can still checkout the area. Maybe talk with
some of the neighbors.

The guy next door says he barely ever spoke to the suspect, "was a bit of a loner" is what he says.
Doesn't know what type of vehicle he drives.

You take a stroll around the house, there's a back porch that probably seen better days. You spot a
driveway next to it leading to a garage. The door's open and you see a green Hyundai parked there."
```

Hmm. Strange. Now onto the third suspect.

```bash
$ git checkout street/beaconside
HEAD is now at 5e37024 Beaconside
$ git log | grep -B 4 -A 21 " 9 "
commit 92f6e05c6aa06c791f402d7e19649fa1f0ec76c6
Author: Dolores Wholfump <mayor@gittown.gov>
Date:   Tue Jan 1 00:00:00 2019 +0000
"
    9 Beaconside
    
    Yeah, of course I used the backdoor to the factory, that's the closest entrance to the freezer and I
    brought in some ingrediants that can't really stand the heat.
    
    At the time of the murder I was at a block party right down the street from here, we threw the party
    for one of the neighbors who got back from the hospital after an accident. I was with my kids. You
    can ask anyone who's been there.
    
    Oh wait, you know what? We took a picture... Let me get my phone.
    
    See? That's me, that's the neighbor, here's my little girl. And you see the timestamp?
    
    So yeah, I really don't have anything to do with that... Barely knew the victim...
    
    But you know what? I did see someone rushing out of the factory... He got into a green Hyundai, you
    don't see many of those around here... Probably a rental. I didn't catch his face, was just weird
    seeing someone running off like that... Come to think about it, maybe that person had something to
    do with it?
    
    Anyways, best of luck catching whoever did it!
"
$ git checkout 92f6e05c6aa06c791f402d7e19649fa1f0ec76c6
Previous HEAD position was 5e37024 Beaconside
HEAD is now at 92f6e05 9 Beaconside
$ cat investigate
d1278ebc164050fe1e5526fbba6a8cfbe763f1d2
$ git cat-file -p d1278ebc164050fe1e5526fbba6a8cfbe763f1d2
You ask around with the neighbors, just to make sure. Everyone you ask verify that suspect's alibi.
```

Aha, we have a new lead. The culprit has a green Hyundai. As we saw before, the second suspect has a
green Hyundai. That suspect's name is Cosmo Siwkonk. We can now verify if we have solved the case by
using the command given in instructions.txt.
```bash
$ echo "Cosmo Siwkonk" | git hash-object --stdin | grep -iq -f /dev/stdin <(git show solution) && echo 'You found the murderer!' || echo 'No cigar, chief... Try again.'
You found the murderer!
```
{{< rawhtml >}}
<div class="video-container" style="padding: 0% 10%;">
    <video autoplay="autoplay" muted="true" loop="loop" preload="auto" style="width: 100%">
        <source src="/images/yes-yes-yes.mp4" type="video/mp4" />
    </video>
</div>
{{< /rawhtml >}}

We solved the case!

Well, that was fun. Checkout the repository [here](https://github.com/nivbend/gitstery).
Give a thumbs up if this was helpful and/or interesting.

