with import <nixpkgs> {};
mkShell {
  packages = [
    hugo
    nodejs_22
  ];
}
