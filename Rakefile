require "rake"
require "rake/clean"
require "json"

task default: :jekyll

taxonomy_deps = %w[
downloads/actinopt_12k_treePL.tre.xz
downloads/actinopt_12k_raxml.tre.xz
downloads/PFC_short_classification.csv.xz
downloads/final_alignment.phylip.xz
downloads/final_alignment.partitions
scripts/generate_taxonomy.R scripts/lib.R
]

def make_taxonomy(rank)
    sh 'scripts/generate_taxonomy.R', rank
    file = File.read("_data/taxonomy/#{rank}.json")
    json = JSON.parse(file)
    mdpath = "_#{rank}"
    FileUtils.mkdir_p mdpath
    json.each do |key, value|
        File.open("#{mdpath}/#{key}.md", "w") { |f| f.write("---\n\n---\n") }
        #File.open("#{mdpath}/#{rank}.json", "w") { |f| f.write("---\n\n---\n") }
    end
end

file '_data/taxonomy/family.json' => taxonomy_deps do |t|
    make_taxonomy('family')
end

file '_data/taxonomy/order.json' => taxonomy_deps do |t|
    make_taxonomy('order')
end

task :taxonomy => %w[_data/taxonomy/family.json _data/taxonomy/order.json]

task :fossils => ['scripts/generate_fossils.R'] do
    sh 'scripts/generate_fossils.R'
end

task :deps => [:taxonomy, :fossils]

task jekyll: [:deps, :taxonomy] do
    sh "bundle", "exec", "jekyll", "build"
end

task serve: [:deps, :taxonomy] do
    sh "bundle", "exec", "jekyll", "serve", "--incremental"
end

CLEAN.include FileList["_site", '_data/taxonomy/', '_family', '_order', 'downloads/taxonomy']
