require "rake"
require "rake/clean"
require "json"

task default: :jekyll

RANKS = %w[class subclass infraclass megacohort supercohort cohort subcohort infracohort section subsection division subdivision series superorder order suborder infraorder family]

def make_taxonomy_api(rank)
    outfn = "_data/taxonomy/#{rank}.json"
    file = File.read outfn
    json = JSON.parse(file)
    jspath = "api/taxonomy/#{rank}"
    FileUtils.mkdir_p jspath
    FileUtils.cp outfn, "api/taxonomy"
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
        File.open("#{mdpath}/#{key}.md", "w") do |f|
            f.write("---\n")
            f.write("title: '#{key}'\n")
            f.write("description: 'Taxonomic information based on the Phylogenetic Fish Classification for #{key}, the #{rank} of ray-finned fishes, including species checklists, fossil calibrations, time-calibrated phylogenies, DNA sequences and more.'\n")
            f.write("---\n")
        end
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

task :taxonomy_api => (RANKS.map {|r| "api/taxonomy/#{r}"})
task :taxonomy_md => (%w[family order].map {|r| "_#{r}"})
task :taxonomy => [:taxonomy_api, :taxonomy_md]

task :deps => [:taxonomy]

task jekyll: :deps do
    sh "bundle", "exec", "jekyll", "build"
end

task serve: :deps do
    sh "bundle", "exec", "jekyll", "serve", "--incremental"
end

task serve2: :deps do
    sh "bundle", "exec", "jekyll", "serve"
end

CLEAN.include FileList["_site", '_data/taxonomy/', '_data/monophyly', '_family', '_order', 'downloads/taxonomy', 'api/taxonomy']
