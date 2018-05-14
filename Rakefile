require "rake"
require "rake/clean"
require "json"

task default: :jekyll

RANKS = %w[family order]

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
end

def make_taxonomy_api(rank)
    outfn = "_data/taxonomy/#{rank}.json"
    file = File.read outfn
    json = JSON.parse(file)
    jspath = "api/taxonomy/#{rank}"
    FileUtils.mkdir_p jspath
    FileUtils.cp outfn, "api/"
    json.each do |key, value|
        File.open("#{jspath}/#{key}.json", "w") { |f| f.write(JSON.pretty_generate(value)) }
    end
end

def make_taxonomy_md(rank)
    outfn = "_data/taxonomy/#{rank}.json"
    file = File.read outfn
    json = JSON.parse(file)
    mdpath = "_#{rank}"
    FileUtils.mkdir_p mdpath
    json.each do |key, value|
        File.open("#{mdpath}/#{key}.md", "w") { |f| f.write("---\n\n---\n") }
    end
end

rule ( %r{api/taxonomy/.+} ) => [
    proc {|task_name| task_name.sub('api', '_data').concat('.json') }
] do |t|
    make_taxonomy_api(File.basename(t.name))
end

file '_family' => '_data/taxonomy/family.json' do
    make_taxonomy_md 'family'
end

file '_order' => '_data/taxonomy/order.json' do
    make_taxonomy_md 'order'
end

rule ( %r{_data/taxonomy/.*\.json$} ) => taxonomy_deps do |t|
    rank = /(.*)\.json$/.match(File.basename(t.name))[1]
    make_taxonomy(rank)
end

task :taxonomy_data => (RANKS.map {|r| "_data/taxonomy/#{r}.json"})
task :taxonomy_api => (RANKS.map {|r| "api/taxonomy/#{r}"})
task :taxonomy_md => (RANKS.map {|r| "_#{r}"})
task :taxonomy => [:taxonomy_data, :taxonomy_api, :taxonomy_md]

task :fossils => ['scripts/generate_fossils.R'] do
    sh 'scripts/generate_fossils.R'
end

file '_data/monophyly_order_data.json' => 'scripts/generate_monophyly.R' do
    sh 'scripts/generate_monophyly.R'
end

task :monophyly => ['_data/monophyly_order_data.json']

task :deps => [:taxonomy, :fossils, :monophyly]

task jekyll: :deps do
    sh "bundle", "exec", "jekyll", "build"
end

task serve: :deps do
    sh "bundle", "exec", "jekyll", "serve", "--incremental"
end

CLEAN.include FileList["_site", '_data/taxonomy/', '_family', '_order', 'downloads/taxonomy', 'api']
