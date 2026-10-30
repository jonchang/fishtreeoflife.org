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
            f.write("description: 'Taxonomy and phylogeny of #{key}, a #{rank} of ray-finned fishes. Based on the Phylogenetic Fish Classification. Also includes species checklists, fossil calibrations, DNA sequences.'\n")
            f.write("---\n")
        end
    end
end

# Taxa with more species than this get a summary page without the inline
# species list (the list is linked as a CSV instead).
INLINE_SPECIES_LIMIT = 3000

# Same as Jekyll::Utils.slugify(name, mode: "pretty", cased: true), which is
# how the collection permalink /taxonomy/:collection/:title/ is built from the
# stub file name, e.g. "Incertae sedis in Carangaria" -> "Incertae-sedis-in-Carangaria".
def taxon_url(rank, name)
    slug = name.gsub(/[^\p{M}\p{L}\p{Nd}._~!$&'()+,;=@]+/, "-").gsub(/^-|-$/, "")
    "/taxonomy/#{rank}/#{slug}/"
end

def fmt_int(n)
    n.to_s.reverse.scan(/\d{1,3}/).join(",").reverse
end

def fmt_pct(num, den)
    return "" if den.zero?
    pct = 100.0 * num / den
    if num > 0 && pct < 0.5 then "<1%"
    elsif num < den && pct >= 99.5 then ">99%"
    else "#{pct.round}%"
    end
end

def fmt_dr(x)
    x.is_a?(Numeric) && !x.to_f.nan? ? format("%.2f", x) : ""
end

def rank_plural(rank, n)
    return rank if n == 1 || rank == "series"
    return "families" if rank == "family"
    return "#{rank}es" if rank.end_with?("class")
    "#{rank}s"
end

def taxon_links(rank, names)
    { "rank" => rank, "taxa" => names.map { |n| { "name" => n, "url" => taxon_url(rank, n) } } }
end

# Precompute everything the taxon pages need that involves set operations or
# counting over many species, so _layouts/rank.html only has to render it.
# Writes _data/summary/{rank}.json and downloads/taxonomy/{rank}/{name}_species.csv.
def make_summary
    require "csv"
    require "set"
    data = RANKS.to_h { |r| [r, JSON.parse(File.read("_data/taxonomy/#{r}.json"))] }

    # species -> taxon name, for each rank
    sp_rank = RANKS.to_h do |r|
        m = {}
        data[r].each { |name, v| v["species"].each { |sp| m[sp] = name } }
        [r, m]
    end

    familiar = CSV.read("_data/familiar_species.csv", headers: true).map { |row| [row["species"], row["common_name"]] }.sort
    familiar.each do |sp, _|
        warn "WARNING: familiar species #{sp} is not in the taxonomy" unless sp_rank["family"].key?(sp)
    end

    FileUtils.mkdir_p "_data/summary"
    RANKS.each_with_index do |rank, ri|
        above = RANKS[0...ri]
        below = RANKS[(ri + 1)..]
        FileUtils.mkdir_p "downloads/taxonomy/#{rank}"
        out = {}
        data[rank].each do |name, v|
            species = v["species"]
            sampled = v["sampled_species"].to_set
            n, ns = species.size, sampled.size
            s = {}
            s["headline"] = "#{fmt_int(ns)} of #{fmt_int(n)} species (#{fmt_pct(ns, n)}) #{ns == 1 ? 'has' : 'have'} genetic data."
            s["n_sampled"] = fmt_int(ns)
            s["inline_list"] = n <= INLINE_SPECIES_LIMIT
            s["csv"] = "downloads/taxonomy/#{rank}/#{name}_species.csv"

            s["lineage"] = above.filter_map { |r| names = v["taxonomy"][r] || []; taxon_links(r, names) unless names.empty? }
            s["enclosed"] = below.filter_map { |r| names = v["taxonomy"][r] || []; taxon_links(r, names) unless names.empty? }
            s["enclosed_summary"] = s["enclosed"].map { |g| "#{fmt_int(g['taxa'].size)} #{rank_plural(g['rank'], g['taxa'].size)}" }.join(", ")

            # Immediate children: the first lower rank that splits this taxon's
            # species into >= 2 names, or into 1 name plus unassigned species.
            # If no rank splits it, fall back to its single family.
            unless below.empty?
                child_rank, groups = nil, nil
                below.each do |r|
                    g = species.group_by { |sp| sp_rank[r][sp] }
                    named = g.keys.compact
                    if named.size >= 2 || (named.size == 1 && g.key?(nil))
                        child_rank, groups = r, g
                        break
                    end
                end
                child_rank, groups = "family", species.group_by { |sp| sp_rank["family"][sp] } if child_rank.nil?
                rows = groups.map do |cname, sps|
                    cs = sps.count { |sp| sampled.include?(sp) }
                    row = { "rank" => child_rank, "n" => sps.size, "ns" => cs }
                    if cname
                        cv = data[child_rank][cname]
                        row.merge!("name" => cname, "url" => taxon_url(child_rank, cname),
                                   "nonmono" => !(cv["rogues"] || []).empty?, "mean_dr" => fmt_dr(cv["mean_dr"]))
                    else
                        rates = sps.filter_map { |sp| v["tiprates_dr"][sp] }
                        row.merge!("name" => nil, "url" => nil, "nonmono" => false,
                                   "mean_dr" => rates.empty? ? "" : fmt_dr(rates.sum / rates.size))
                    end
                    row
                end
                # largest first; the "unassigned" remainder always goes last
                rows.sort_by! { |r| [r["name"] ? 0 : 1, -r["n"], r["name"].to_s] }
                s["child_rank"] = child_rank
                s["any_nonmono"] = rows.any? { |r| r["nonmono"] }
                s["children"] = rows.map do |r|
                    n_c, ns_c = r.delete("n"), r.delete("ns")
                    r.merge("sampled" => fmt_int(ns_c), "total" => fmt_int(n_c),
                            "frac" => (ns_c.to_f / n_c).round(4), "pct" => fmt_pct(ns_c, n_c))
                end
            end

            # A. largest genera
            genera = Hash.new { |h, k| h[k] = [0, 0] }
            species.each do |sp|
                g = genera[sp.split(" ").first]
                g[0] += 1
                g[1] += 1 if sampled.include?(sp)
            end
            s["genera"] = genera.sort_by { |g, (t, _)| [-t, g] }.first(5).map do |g, (t, gs)|
                { "genus" => g, "sampled" => fmt_int(gs), "total" => fmt_int(t) }
            end

            # B. familiar species
            s["familiar"] = familiar.select { |sp, _| sp_rank[rank][sp] == name }.map do |sp, common|
                { "species" => sp, "common_name" => common, "sampled" => sampled.include?(sp) }
            end

            # gene coverage, as a share of this taxon's sampled species
            if ns > 0
                s["genes"] = v["gene_sampling"].map { |gene, l| [gene, l.size] }.sort_by { |gene, c| [-c, gene] }.map do |gene, c|
                    { "gene" => gene, "count" => fmt_int(c), "pct" => fmt_pct(c, ns) }
                end
            end

            out[name] = s

            File.open(s["csv"], "w") do |f|
                f << CSV.generate_line(%w[species genus family order sampled])
                species.sort.each do |sp|
                    f << CSV.generate_line([sp, sp.split(" ").first, sp_rank["family"][sp], sp_rank["order"][sp],
                                            sampled.include?(sp) ? "yes" : "no"])
                end
            end
        end
        File.write("_data/summary/#{rank}.json", JSON.generate(out))
    end
end

task :summary do
    make_summary
end

rule ( %r{api/taxonomy/.+} ) => [
    proc {|task_name| task_name.sub('api', '_data').concat('.json') }
] do |t|
    make_taxonomy_api(File.basename(t.name))
end

rule ( %r{_(#{RANKS.join("|")})} ) => [
    proc {|task_name| task_name.sub("_", "_data/taxonomy/").concat(".json") }
] do |t|
    make_taxonomy_md(t.name.sub("_", ""))
end

task :taxonomy_api => (RANKS.map {|r| "api/taxonomy/#{r}"})
task :taxonomy_md => (RANKS.map {|r| "_#{r}"})
task :taxonomy => [:taxonomy_api, :taxonomy_md]

task :deps => [:taxonomy, :summary]

task jekyll: :deps do
    sh "bundle", "exec", "jekyll", "build"
end

task serve: :deps do
    sh "bundle", "exec", "jekyll", "serve", "--incremental"
end

task serve2: :deps do
    sh "bundle", "exec", "jekyll", "serve"
end

CLEAN.include FileList["_site", '_data/taxonomy/', '_data/monophyly', '_data/summary', '_family', '_order', 'downloads/taxonomy', 'api/taxonomy']
