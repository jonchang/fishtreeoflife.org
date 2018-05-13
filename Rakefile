require "rake"
require "rake/clean"

task default: :jekyll

task :deps do
    sh "scripts/generate_fossils.R"
    sh "scripts/generate_taxonomy.R"
end

task jekyll: :deps do
    sh "bundle", "exec", "jekyll", "build"
end

CLEAN.include FileList["_site"]
