export const CODE_TEMPLATES = [
  {
    name: 'javascript',
    code: `
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Paul");
`
  },
  {
    name: 'python',
    code: `
def greet(name):
  print("Hello, " + name + "!")

greet("Paul")
`
  },
  {
    name: 'typescript',
    code: `
type Params = {
  name: string;
};

function greet(data: Params) {
  console.log("Hello, " + data.name + "!");
}

greet({ name: "Paul" });
`
  },
  {
    name: 'java',
    code: `
public class Main {
  public static void main(String[] args) {
    greet("Paul");
  }

  public static void greet(String name) {
    System.out.println("Hello, " + name + "!");
  }
}
`
  },
  {
    name: 'c',
    code: `
#include <stdio.h>

void greet(char* name) {
  printf("Hello, %s!\\n", name);
}

int main() {
  greet("Paul");
  return 0;
}
`
  },
  {
    name: 'cpp',
    code: `
#include <iostream>
using namespace std;

void greet(string name) {
  cout << "Hello, " + name + "!" << endl;
}

int main() {
  greet("Paul");
  return 0;
}
`
  },
  {
    name: 'csharp',
    code: `
using System;

class Program {
  static void Main() {
    greet("Paul");
  }

  static void greet(string name) {
    Console.WriteLine("Hello, " + name + "!");
  }
}
`
  },
  {
    name: 'php',
    code: `
<?php
function greet($name) {
  echo "Hello, " . $name . "!";
}

greet("Paul");
?>
`
  },
  {
    name: 'go',
    code: `
package main

import "fmt"

func greet(name string) {
  fmt.Printf("Hello, %s!\\n", name)
}

func main() {
  greet("Paul")
}
`
  }
];
