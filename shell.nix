with import <nixpkgs> {};
mkShell {
  packages = [
    hugo
    nodejs_22

    # rust
    cargo
    rust-analyzer
  ];
}
