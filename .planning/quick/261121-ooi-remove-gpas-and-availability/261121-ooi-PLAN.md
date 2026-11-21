---
phase: quick
plan: 01
type: quick
wave: 1
depends_on: []
files_modified:
  - index.html
  - data.json
autonomous: true
quick_id: 261121-ooi
slug: remove-gpas-and-availability
---

<objective>
Remove the GPA figures from the education entries and remove the Availability "Working Hours: 24 Hours Available" card from the portfolio home page.

Purpose: The user reports both look odd. GPAs are dropped from the education timeline while the location (real CV data) is kept. The Availability card is removed in full — that also means the card no longer anchors a third column, so the surrounding grid drops from three columns to two.

Output: Updated `index.html` (rendered page) and `data.json` (the parallel data record) kept in sync, committed and pushed to `github_pages`.
</objective>

<context>
@index.html
@data.json

Note: this project has no `.planning/ROADMAP.md`, so no `requirements` frontmatter is emitted — there are no requirement IDs to address.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Strip the GPA figure from each education entry, keeping the location</name>
  <files>index.html</files>
  <action>
    Five education cards in the Education timeline render their GPA and location on one line, separated by a middot. Remove only the GPA prefix, leaving the location intact:

        "GPA: 8.6 · Chandigarh, India"   ->  "Chandigarh, India"
        "GPA: 5.25 · Ropar, India"       ->  "Ropar, India"
        "GPA: 8.9 · Kolkata, India"      ->  "Kolkata, India"
        "GPA: 9.4 · Haldia, India"       ->  "Haldia, India"
        "GPA: 9.6 · Haldia, India"       ->  "Haldia, India"

    The MBA entry (Haryana, India) has no GPA and is left untouched. Keep the `text-[#64748b] text-sm mt-2` class on each line — only the text content changes. The middot separator disappears with the GPA it introduced.
  </action>
  <verify>
    grep -c "GPA" index.html   # must print 0
    grep -c "Chandigarh, India" index.html   # must print 1
    grep -c "Ropar, India" index.html       # must print 1
    grep -c "Kolkata, India" index.html     # must print 1
    grep -c "Haldia, India" index.html      # must print 2
  </verify>
  <done>No "GPA" string remains anywhere in `index.html`; all five education locations survive; the middot separators are gone with the GPAs.</done>
</task>

<task type="auto">
  <name>Task 2: Remove the Availability card and rebalance the grid to two columns</name>
  <files>index.html</files>
  <action>
    In `index.html`, delete the entire Availability card — the third child of the "Hobbies, Languages &amp; Availability" grid, which holds the `fa-clock` icon, the "Availability" heading, and the "Working Hours:" / "24 Hours Available" pair.

    Because that card was the third column, the grid must go from three columns to two so Hobbies and Languages fill the row instead of leaving a gap:

        <div class="grid md:grid-cols-3 gap-8 mt-8">   ->   <div class="grid md:grid-cols-2 gap-8 mt-8">

    Also update the grid's HTML comment to match what remains:

        <!-- Hobbies, Languages &amp; Availability -->   ->   <!-- Hobbies &amp; Languages -->

    Leave the Hobbies card, the Languages card, and the Soft Skills block that follows the grid exactly as they are.
  </action>
  <verify>
    grep -c "Availability" index.html   # must print 0
    grep -c "Working Hours" index.html   # must print 0
    grep -c "24 Hours Available" index.html   # must print 0
    grep -c "md:grid-cols-2 gap-8 mt-8" index.html   # must print 1
    grep -c "md:grid-cols-3 gap-8 mt-8" index.html   # must print 0
    grep -c "Hobbies &amp; Languages" index.html   # must print 1
    node -e "const h=require('fs').readFileSync('index.html','utf8');for(const t of ['div','section','ul','li','p','span','a']){const o=(h.match(new RegExp('<'+t+'[ >]','g'))||[]).length,c=(h.match(new RegExp('</'+t+'>','g'))||[]).length;if(o!==c){console.error('UNBALANCED '+t+': '+o+'/'+c);process.exit(1)}}console.log('tags balanced')"
  </verify>
  <done>The Availability card is gone from the rendered page, its grid is two columns with Hobbies and Languages intact, and no HTML tag imbalance is introduced.</done>
</task>

<task type="auto">
  <name>Task 3: Drop the matching keys from data.json so the data record matches what is displayed</name>
  <files>data.json</files>
  <action>
    In `data.json`:
    - Remove the `cgpa` key from each of the five education entries that has one (M.Eng 8.6, Major in AI 5.25, B.Tech 8.9, Higher Secondary 9.4, Secondary 9.6). The `location` key on each entry stays.
    - Remove the whole `availability` object — the card it fed is gone, so `working_hours` has nothing left to describe.
  </action>
  <verify>
    node -e "const d=require('./data.json');if(JSON.stringify(d).includes('cgpa')||JSON.stringify(d).includes('gpa')){console.error('a gpa key survived');process.exit(1)}if('availability' in d){console.error('availability object survived');process.exit(1)}if(d.education.length!==6){console.error('education entries changed');process.exit(1)}if(!d.education.every(e=>e.location)){console.error('an education location was lost');process.exit(1)}console.log('data.json ok — education='+d.education.length+', availability removed')"
  </verify>
  <done>`data.json` parses as valid JSON, no GPA key remains anywhere, the `availability` object is gone, all six education entries survive and each still carries its `location`.</done>
</task>

</tasks>

<verification>
1. `index.html` contains no "GPA", no "Availability", no "Working Hours", no "24 Hours Available".
2. All six education locations survive in `index.html` (Haryana, Chandigarh, Ropar, Kolkata, Haldia ×2).
3. The Hobbies/Languages grid is `md:grid-cols-2`; the Soft Skills block is unchanged.
4. All HTML tags in `index.html` remain balanced.
5. `data.json` parses as valid JSON, no GPA keys, no `availability` object, six education entries each with a `location`.
6. Render `index.html` in a browser and confirm the education timeline shows locations only, the Hobbies/Languages grid is a clean two-column row with no gap, and there are no console errors.
7. Commit the change, push to `origin github_pages`, and confirm the deployed page no longer contains any removed string.
</verification>

<success_criteria>
- All GPA figures removed from `index.html` and `data.json`
- Availability card (including Working Hours) removed from `index.html`; `availability` object removed from `data.json`
- Education locations and the rest of the page preserved
- Grid rebalanced to two columns, no layout regression
- `data.json` remains valid JSON
- Change committed and pushed; live site verified
</success_criteria>

<output>
Create `.planning/quick/261121-ooi-remove-gpas-and-availability/261121-ooi-SUMMARY.md` when done
</output>
